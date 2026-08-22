import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const db = await getDatabase();
    const usersCollection = db.collection("users");

    const userDoc = await usersCollection.findOne({
      $or: [
        ...(ObjectId.isValid(session.user.id) ? [{ _id: new ObjectId(session.user.id) }] : []),
        { id: session.user.id },
        { email: session.user.email },
      ],
    });

    const isStripeConfigured =
      process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes("placeholder") &&
      stripe !== null;

    if (isStripeConfigured && userDoc?.stripeCustomerId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: userDoc.stripeCustomerId,
        return_url: `${origin}/dashboard/${session.user.role === "recruiter" ? "recruiter/billing" : "seeker/billing"}`,
      });

      return NextResponse.json({ url: portalSession.url });
    }

    // Fallback: Redirect to pricing page
    return NextResponse.json({
      url: `${origin}/pricing`,
      message: "Stripe Customer Portal is active once a live checkout payment has been completed.",
    });
  } catch (error) {
    console.error("Stripe Portal error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create portal session." },
      { status: 500 }
    );
  }
}
