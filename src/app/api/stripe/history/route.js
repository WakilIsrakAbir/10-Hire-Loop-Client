import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const db = await getDatabase();
    const subscriptionsCollection = db.collection("subscriptions");

    const history = await subscriptionsCollection
      .find({
        $or: [
          { userId: session.user.id },
          { userEmail: session.user.email },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("GET /api/stripe/history error:", error);
    return NextResponse.json({ error: "Failed to fetch payment history." }, { status: 500 });
  }
}
