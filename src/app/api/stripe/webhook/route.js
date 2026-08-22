import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, PLAN_DETAILS } from "@/lib/stripe";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    if (webhookSecret && !webhookSecret.includes("placeholder") && stripe) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err) {
        console.error(`⚠️ Webhook signature verification failed:`, err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // If webhook secret not configured, parse payload JSON directly for local dev
      try {
        event = JSON.parse(body);
      } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");
    const userSingleCollection = db.collection("user");
    const subscriptionsCollection = db.collection("subscriptions");

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const userEmail = metadata.userEmail || session.customer_details?.email;
        const planKey = metadata.plan || "pro";
        const billingCycle = metadata.billingCycle || "monthly";
        const planConfig = PLAN_DETAILS[planKey];

        const filter = {
          $or: [
            ...(userId && ObjectId.isValid(userId) ? [{ _id: new ObjectId(userId) }] : []),
            ...(userId ? [{ id: userId }] : []),
            ...(userEmail ? [{ email: userEmail }] : []),
          ],
        };

        const updatePayload = {
          $set: {
            plan: planKey,
            isPro: true,
            subscriptionStatus: "active",
            billingCycle,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription || session.id,
            activeJobLimit: planConfig?.limits?.activeJobLimit || 3,
            updatedAt: new Date(),
          },
        };

        if (filter.$or.length > 0) {
          await usersCollection.updateMany(filter, updatePayload);
          await userSingleCollection.updateMany(filter, updatePayload);
        }

        // Insert payment receipt into subscriptions collection
        const tx = {
          userId: userId || session.client_reference_id,
          userEmail,
          stripeSessionId: session.id,
          stripeCustomerId: session.customer,
          plan: planConfig?.name || planKey,
          planKey,
          amount: `$${((session.amount_total || 0) / 100).toFixed(2)}`,
          billingCycle,
          status: "PAID",
          paymentMethod: "Stripe Card",
          transactionId: `TXN-${session.id ? session.id.slice(-8).toUpperCase() : Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date(),
        };

        await subscriptionsCollection.insertOne(tx);
        console.log(`[Stripe Webhook] Successfully processed checkout for user ${userEmail} (${planKey})`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const updateDowngrade = {
          $set: {
            plan: "free",
            isPro: false,
            subscriptionStatus: "canceled",
            activeJobLimit: 3,
            canceledAt: new Date(),
          },
        };

        await usersCollection.updateMany({ stripeCustomerId: customerId }, updateDowngrade);
        await userSingleCollection.updateMany({ stripeCustomerId: customerId }, updateDowngrade);
        console.log(`[Stripe Webhook] Subscription canceled for customer ${customerId}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
