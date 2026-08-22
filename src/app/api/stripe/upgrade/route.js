import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST: Upgrade current user to Pro / Growth subscription
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const plan = body.plan || "pro";
    const billingCycle = body.billingCycle || "monthly";

    const db = await getDatabase();
    const usersCollection = db.collection("users");
    const subscriptionsCollection = db.collection("subscriptions");

    let userQuery = {};
    if (session.user.id) {
      try {
        userQuery = { _id: new ObjectId(session.user.id) };
      } catch {
        userQuery = { id: session.user.id };
      }
    } else if (session.user.email) {
      userQuery = { email: session.user.email };
    }

    // Update user to Pro Plan in both possible collection names ('user' and 'users')
    const updatePayload = {
      $set: {
        plan: "pro",
        isPro: true,
        subscriptionStatus: "active",
        billingCycle,
        upgradedAt: new Date(),
      },
    };

    const filter = {
      $or: [
        ...(ObjectId.isValid(session.user.id) ? [{ _id: new ObjectId(session.user.id) }] : []),
        { id: session.user.id },
        { email: session.user.email },
      ],
    };

    await usersCollection.updateMany(filter, updatePayload);
    const userSingleCollection = db.collection("user");
    await userSingleCollection.updateMany(filter, updatePayload);

    // Record transaction
    const tx = {
      userId: session.user.id,
      userEmail: session.user.email,
      plan: "Professional Tier",
      amount: billingCycle === "yearly" ? "$252.00" : "$29.00",
      billingCycle,
      status: "PAID",
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-HL`,
      createdAt: new Date(),
    };

    await subscriptionsCollection.insertOne(tx);

    return NextResponse.json({
      success: true,
      message: "Successfully upgraded to HireLoop Professional Plan! Unlimited applications unlocked.",
      plan: "pro",
      isPro: true,
      transaction: tx,
    });
  } catch (error) {
    console.error("POST /api/stripe/upgrade error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upgrade subscription." },
      { status: 500 }
    );
  }
}
