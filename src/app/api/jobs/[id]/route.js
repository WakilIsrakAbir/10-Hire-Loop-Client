import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const jobsCollection = db.collection("jobs");

    let job = null;

    if (ObjectId.isValid(id)) {
      job = await jobsCollection.findOne({ _id: new ObjectId(id) });
    }

    // Fallback search if not ObjectId or custom string ID
    if (!job) {
      job = await jobsCollection.findOne({ id: id });
    }

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Increment views count in background
    if (ObjectId.isValid(id)) {
      jobsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { viewsCount: 1 } }
      ).catch(() => {});
    }

    // Fetch 3 related jobs in same category
    const relatedJobs = await jobsCollection
      .find({
        category: job.category,
        _id: { $ne: job._id },
      })
      .limit(3)
      .toArray();

    return NextResponse.json({
      success: true,
      job,
      relatedJobs,
    });
  } catch (error) {
    console.error("GET /api/jobs/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job details", details: error.message },
      { status: 500 }
    );
  }
}
