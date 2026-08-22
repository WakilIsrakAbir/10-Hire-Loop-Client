import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET all saved jobs for the logged in seeker
export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const savedJobsCollection = db.collection("saved_jobs");

    const saved = await savedJobsCollection
      .find({ userId: session.user.id })
      .sort({ savedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      count: saved.length,
      savedJobs: saved,
    });
  } catch (error) {
    console.error("GET /api/saved-jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

// POST: Toggle save/bookmark job
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, title, companyName, location, salary, jobType, category, companyLogo } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    const db = await getDatabase();
    const savedJobsCollection = db.collection("saved_jobs");

    const existing = await savedJobsCollection.findOne({
      userId: session.user.id,
      jobId: String(jobId),
    });

    if (existing) {
      // Remove bookmark (toggle off)
      await savedJobsCollection.deleteOne({ _id: existing._id });
      return NextResponse.json({
        success: true,
        isSaved: false,
        message: "Job removed from saved list.",
      });
    }

    // Insert bookmark (toggle on)
    const newSaved = {
      userId: session.user.id,
      jobId: String(jobId),
      title: title || "Role",
      companyName: companyName || "Company",
      companyLogo: companyLogo || "",
      location: location || "Remote",
      salary: salary || "Competitive",
      jobType: jobType || "Full-time",
      category: category || "Engineering",
      savedAt: new Date(),
    };

    await savedJobsCollection.insertOne(newSaved);

    return NextResponse.json({
      success: true,
      isSaved: true,
      message: "Job bookmarked successfully!",
      savedJob: newSaved,
    });
  } catch (error) {
    console.error("POST /api/saved-jobs error:", error);
    return NextResponse.json(
      { error: "Failed to bookmark job" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a saved job
export async function DELETE(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    const db = await getDatabase();
    const savedJobsCollection = db.collection("saved_jobs");

    await savedJobsCollection.deleteOne({
      userId: session.user.id,
      jobId: String(jobId),
    });

    return NextResponse.json({
      success: true,
      message: "Removed from saved jobs.",
    });
  } catch (error) {
    console.error("DELETE /api/saved-jobs error:", error);
    return NextResponse.json(
      { error: "Failed to remove saved job" },
      { status: 500 }
    );
  }
}
