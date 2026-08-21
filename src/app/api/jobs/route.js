import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const jobType = searchParams.get("jobType");
    const location = searchParams.get("location");
    const minSalary = searchParams.get("minSalary");
    const sortBy = searchParams.get("sortBy") || "newest";
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    const db = await getDatabase();
    const jobsCollection = db.collection("jobs");

    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (jobType && jobType !== "All") {
      query.$or = [
        { jobType: { $regex: jobType, $options: "i" } },
        { workType: { $regex: jobType, $options: "i" } },
      ];
    }

    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
    }

    if (minSalary && minSalary !== "All") {
      const minVal = parseInt(minSalary, 10);
      if (!isNaN(minVal)) {
        query.salaryMax = { $gte: minVal };
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { requirements: { $regex: search, $options: "i" } },
      ];
    }

    // Sort order
    let sortObj = { createdAt: -1 };
    if (sortBy === "salary-high") {
      sortObj = { salaryMax: -1, createdAt: -1 };
    } else if (sortBy === "popular") {
      sortObj = { applicantsCount: -1, createdAt: -1 };
    }

    let cursor = jobsCollection.find(query).sort(sortObj);
    if (limit) {
      cursor = cursor.limit(parseInt(limit, 10));
    }

    const jobs = await cursor.toArray();

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error.message },
      { status: 500 }
    );
  }
}
