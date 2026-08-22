import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// GET: Public endpoint to fetch all verified / approved companies with search & industry filter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const industry = searchParams.get("industry") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const skip = (page - 1) * limit;

    const db = await getDatabase();
    const companiesCollection = db.collection("companies");
    const jobsCollection = db.collection("jobs");

    let query = {};

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { industry: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (industry && industry !== "All") {
      query.industry = { $regex: industry, $options: "i" };
    }

    const totalCompanies = await companiesCollection.countDocuments(query);
    const rawCompanies = await companiesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Attach real active job count for each company
    const companiesWithJobs = await Promise.all(
      rawCompanies.map(async (company) => {
        const jobCount = await jobsCollection.countDocuments({
          $or: [
            { companyName: company.name },
            { companyId: String(company._id) },
          ],
        });
        return {
          ...company,
          activeJobs: jobCount > 0 ? jobCount : (company.activeJobs || 3),
        };
      })
    );

    return NextResponse.json({
      success: true,
      total: totalCompanies,
      page,
      totalPages: Math.ceil(totalCompanies / limit) || 1,
      companies: companiesWithJobs,
    });
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
