import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST: Submit a job application (Requires Login)
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to apply for this job." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobId, jobTitle, companyName, fullName, email, resumeUrl, portfolio, coverNote } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    if (!resumeUrl?.trim()) {
      return NextResponse.json({ error: "Resume / CV link is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const applicationsCollection = db.collection("applications");
    const jobsCollection = db.collection("jobs");

    // Check if user already applied for this job
    let jobQuery = ObjectId.isValid(jobId) ? { _id: new ObjectId(jobId) } : { id: jobId };
    const jobDoc = await jobsCollection.findOne(jobQuery);

    const existingApplication = await applicationsCollection.findOne({
      jobId: String(jobId),
      applicantId: session.user.id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this position." },
        { status: 400 }
      );
    }

    const newApplication = {
      jobId: String(jobId),
      jobTitle: jobTitle || jobDoc?.title || "Role",
      companyName: companyName || jobDoc?.companyName || "Company",
      applicantId: session.user.id,
      applicantName: fullName?.trim() || session.user.name || "Anonymous Applicant",
      applicantEmail: email?.trim() || session.user.email,
      applicantImage: session.user.image || "",
      applicantRole: session.user.role || "seeker",
      resumeUrl: resumeUrl.trim(),
      portfolio: portfolio?.trim() || "",
      coverNote: coverNote?.trim() || "",
      status: "Under Review",
      appliedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await applicationsCollection.insertOne(newApplication);

    // Increment applicantsCount & newApplicants for the job
    if (jobDoc) {
      await jobsCollection.updateOne(
        { _id: jobDoc._id },
        {
          $inc: { applicantsCount: 1, newApplicants: 1 },
          $set: { updatedAt: new Date() },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! The hiring team has been notified.",
      applicationId: result.insertedId,
      application: { _id: result.insertedId, ...newApplication },
    });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET: Fetch applications (by jobId for recruiter, or by applicantId for seeker)
export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const applicantId = searchParams.get("applicantId");

    const db = await getDatabase();
    const applicationsCollection = db.collection("applications");

    let query = {};
    if (jobId) {
      query.jobId = String(jobId);
    }
    if (applicantId) {
      query.applicantId = applicantId;
    } else if (!jobId && session.user.role === "seeker") {
      query.applicantId = session.user.id;
    }

    const applications = await applicationsCollection
      .find(query)
      .sort({ appliedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
