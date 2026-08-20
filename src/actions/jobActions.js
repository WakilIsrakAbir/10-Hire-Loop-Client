"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

/**
 * Server Action to create and save a new Job Listing in MongoDB
 */
export async function createJobAction(formData) {
  try {
    // 1. Authenticate the recruiter session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please sign in to post a job.",
      };
    }

    // 2. Validate essential fields
    const title = formData?.title?.trim();
    if (!title) {
      return {
        success: false,
        error: "Job title is required.",
      };
    }

    const db = await getDatabase();
    const jobsCollection = db.collection("jobs");
    const companiesCollection = db.collection("companies");

    // 3. Fetch recruiter's company if exists
    let company = null;
    try {
      company = await companiesCollection.findOne({
        $or: [
          { recruiterEmail: session.user.email },
          { recruiterId: session.user.id },
        ],
      });
    } catch (cErr) {
      console.warn("Could not fetch associated company:", cErr.message);
    }

    // 4. Prepare Job Document
    const salaryMin = formData.salaryMin ? Number(formData.salaryMin) : null;
    const salaryMax = formData.salaryMax ? Number(formData.salaryMax) : null;
    const currency = formData.currency || "USD";

    let salaryFormatted = "Competitive";
    if (salaryMin && salaryMax) {
      salaryFormatted = `${currency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`;
    } else if (salaryMin) {
      salaryFormatted = `From ${currency} ${salaryMin.toLocaleString()}`;
    }

    const newJobDoc = {
      title,
      category: formData.category || "Engineering",
      department: formData.department || formData.category || "Engineering",
      jobType: formData.jobType || "Full-time",
      workplace: formData.isRemote ? "Remote" : (formData.workplace || "On-site"),
      isRemote: Boolean(formData.isRemote),
      location: formData.location || "Remote",
      salaryMin,
      salaryMax,
      currency,
      salaryFormatted,
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      responsibilities: formData.responsibilities || "",
      requirements: formData.requirements || "",
      benefits: formData.benefits || "",

      // Company info
      companyId: company?._id?.toString() || null,
      companyName: company?.name || session.user?.companyName || "TechFlow Inc.",
      companyLogo: company?.logo || "",

      // Recruiter info
      recruiterId: session.user.id,
      recruiterEmail: session.user.email,
      recruiterName: session.user.name,

      // Job Metrics & Status
      status: "Active",
      applicantsCount: 0,
      newApplicants: 0,
      viewsCount: 0,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 5. Insert into MongoDB
    const result = await jobsCollection.insertOne(newJobDoc);

    // 6. Revalidate cache
    revalidatePath("/dashboard/recruiter/jobs");
    revalidatePath("/dashboard/recruiter");
    revalidatePath("/jobs");

    return {
      success: true,
      message: "Job posted successfully!",
      jobId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Error in createJobAction:", error);
    return {
      success: false,
      error: error?.message || "Failed to post job due to server error.",
    };
  }
}

/**
 * Server Action to fetch all jobs for the currently logged-in recruiter
 */
export async function getRecruiterJobsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized", jobs: [] };
    }

    const db = await getDatabase();
    const jobsCollection = db.collection("jobs");

    const rawJobs = await jobsCollection
      .find({
        $or: [
          { recruiterEmail: session.user.email },
          { recruiterId: session.user.id },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Map _id to string for client serialization
    const jobs = rawJobs.map((job) => ({
      ...job,
      _id: job._id.toString(),
      companyId: job.companyId ? job.companyId.toString() : null,
      createdAt: job.createdAt ? job.createdAt.toISOString() : null,
      updatedAt: job.updatedAt ? job.updatedAt.toISOString() : null,
      deadline: job.deadline ? job.deadline.toISOString() : null,
    }));

    return { success: true, jobs };
  } catch (error) {
    console.error("Error in getRecruiterJobsAction:", error);
    return { success: false, error: error?.message || "Failed to fetch jobs", jobs: [] };
  }
}

/**
 * Server Action to delete a job post
 */
export async function deleteJobAction(jobId) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!ObjectId.isValid(jobId)) {
      return { success: false, error: "Invalid Job ID format" };
    }

    const db = await getDatabase();
    const jobsCollection = db.collection("jobs");

    const result = await jobsCollection.deleteOne({
      _id: new ObjectId(jobId),
      $or: [
        { recruiterEmail: session.user.email },
        { recruiterId: session.user.id },
      ],
    });

    if (result.deletedCount === 0) {
      return { success: false, error: "Job not found or permission denied" };
    }

    revalidatePath("/dashboard/recruiter/jobs");
    revalidatePath("/jobs");

    return { success: true, message: "Job deleted successfully" };
  } catch (error) {
    console.error("Error in deleteJobAction:", error);
    return { success: false, error: error?.message || "Failed to delete job" };
  }
}
