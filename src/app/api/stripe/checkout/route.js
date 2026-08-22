import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe, PLAN_DETAILS } from "@/lib/stripe";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to choose a subscription plan." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const planKey = body.plan || "pro";
    const billingCycle = body.billingCycle || "monthly";

    const planConfig = PLAN_DETAILS[planKey];
    if (!planConfig) {
      return NextResponse.json(
        { error: `Invalid plan specified: "${planKey}".` },
        { status: 400 }
      );
    }

    const priceInfo = planConfig.pricing[billingCycle] || planConfig.pricing.monthly;
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // If Stripe Secret Key is active and not a placeholder, create real Stripe Checkout Session
    const isStripeConfigured =
      process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes("placeholder") &&
      stripe !== null;

    if (isStripeConfigured) {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // or 'subscription' if recurring Price IDs are registered
        customer_email: session.user.email,
        line_items: [
          {
            price_data: {
              currency: priceInfo.currency,
              product_data: {
                name: `HireLoop ${planConfig.name}`,
                description: `${planConfig.name} (${billingCycle === "yearly" ? "Billed Annually" : "Billed Monthly"})`,
              },
              unit_amount: priceInfo.amount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
          userEmail: session.user.email,
          plan: planKey,
          planName: planConfig.name,
          role: planConfig.role,
          billingCycle,
        },
        success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}&plan=${planKey}&cycle=${billingCycle}`,
        cancel_url: `${origin}/pricing?canceled=true`,
      });

      return NextResponse.json({
        success: true,
        url: checkoutSession.url,
        sessionId: checkoutSession.id,
        isLiveStripe: true,
      });
    }

    // Fallback Simulation Mode (when STRIPE_SECRET_KEY is placeholder/in development)
    const db = await getDatabase();
    const usersCollection = db.collection("users");
    const subscriptionsCollection = db.collection("subscriptions");

    const filter = {
      $or: [
        ...(ObjectId.isValid(session.user.id) ? [{ _id: new ObjectId(session.user.id) }] : []),
        { id: session.user.id },
        { email: session.user.email },
      ],
    };

    const updatePayload = {
      $set: {
        plan: planKey,
        isPro: true,
        subscriptionStatus: "active",
        billingCycle,
        activeJobLimit: planConfig.limits.activeJobLimit || 3,
        updatedAt: new Date(),
      },
    };

    await usersCollection.updateMany(filter, updatePayload);
    const userSingleCollection = db.collection("user");
    await userSingleCollection.updateMany(filter, updatePayload);

    // Save transaction
    const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}-HL`;
    const tx = {
      userId: session.user.id,
      userEmail: session.user.email,
      plan: planConfig.name,
      planKey,
      amount: `$${(priceInfo.amount / 100).toFixed(2)}`,
      billingCycle,
      status: "PAID",
      paymentMethod: "Stripe Simulated (Card •••• 4242)",
      transactionId,
      createdAt: new Date(),
    };

    await subscriptionsCollection.insertOne(tx);

    return NextResponse.json({
      success: true,
      url: `${origin}/pricing/success?plan=${planKey}&cycle=${billingCycle}&tx=${transactionId}`,
      isLiveStripe: false,
      message: "Upgraded in simulation mode (Add real STRIPE_SECRET_KEY in .env for live Stripe checkout).",
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
