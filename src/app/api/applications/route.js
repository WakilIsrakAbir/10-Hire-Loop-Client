import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const FREE_APPLICATIONS_LIMIT = 3;

// POST: Submit a job application (Enforces Free Plan Quota Limit)
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
    const usersCollection = db.collection("users");

    // Live check user Pro status in DB
    const userDoc =
      (await usersCollection.findOne({
        $or: [{ id: session.user.id }, { email: session.user.email }],
      })) ||
      (await db.collection("user").findOne({
        $or: [{ id: session.user.id }, { email: session.user.email }],
      }));

    const isPro =
      userDoc?.plan === "pro" ||
      userDoc?.isPro === true ||
      session.user.plan === "pro" ||
      session.user.isPro === true;

    const existingCount = await applicationsCollection.countDocuments({
      applicantId: session.user.id,
    });

    if (!isPro && existingCount >= FREE_APPLICATIONS_LIMIT) {
      return NextResponse.json(
        {
          error: `You have reached your Free Plan limit of ${FREE_APPLICATIONS_LIMIT} job applications. Please upgrade to Pro for unlimited applications.`,
          limitReached: true,
          currentCount: existingCount,
          maxLimit: FREE_APPLICATIONS_LIMIT,
        },
        { status: 403 }
      );
    }

    // 2. Check if user already applied for this specific job
    let jobQuery = ObjectId.isValid(jobId) ? { _id: new ObjectId(jobId) } : { id: jobId };
    const jobDoc = await jobsCollection.findOne(jobQuery);

    const alreadyApplied = await applicationsCollection.findOne({
      jobId: String(jobId),
      applicantId: session.user.id,
    });

    if (alreadyApplied) {
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

    const newCount = existingCount + 1;
    const remaining = isPro ? Infinity : Math.max(0, FREE_APPLICATIONS_LIMIT - newCount);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! The hiring team has been notified.",
      applicationId: result.insertedId,
      application: { _id: result.insertedId, ...newApplication },
      quota: {
        appliedCount: newCount,
        maxLimit: FREE_APPLICATIONS_LIMIT,
        remaining,
        isPro,
        limitReached: !isPro && newCount >= FREE_APPLICATIONS_LIMIT,
      },
    });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET: Fetch applications with live Quota stats
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

    // Compute seeker's quota status with live DB check
    const usersCollection = db.collection("users");
    const userDoc =
      (await usersCollection.findOne({
        $or: [{ id: session.user.id }, { email: session.user.email }],
      })) ||
      (await db.collection("user").findOne({
        $or: [{ id: session.user.id }, { email: session.user.email }],
      }));

    const isPro =
      userDoc?.plan === "pro" ||
      userDoc?.isPro === true ||
      session.user.plan === "pro" ||
      session.user.isPro === true;
    const appliedCount = await applicationsCollection.countDocuments({
      applicantId: session.user.id,
    });
    const remaining = isPro ? Infinity : Math.max(0, FREE_APPLICATIONS_LIMIT - appliedCount);

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
      quota: {
        appliedCount,
        maxLimit: FREE_APPLICATIONS_LIMIT,
        remaining,
        isPro,
        limitReached: !isPro && appliedCount >= FREE_APPLICATIONS_LIMIT,
      },
    });
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
