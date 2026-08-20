import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET company for current recruiter
export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const companies = db.collection("companies");

    // Search by recruiterId or recruiterEmail or companyName
    const company = await companies.findOne({
      $or: [
        { recruiterEmail: session.user.email },
        { recruiterId: session.user.id },
      ],
    });

    return NextResponse.json({ company: company || null });
  } catch (error) {
    console.error("GET /api/company error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch company" },
      { status: 500 }
    );
  }
}

// POST register new company
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      industry,
      website,
      location,
      employeeRange,
      logo,
      description,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const companies = db.collection("companies");

    // Check if company already registered by this recruiter
    const existing = await companies.findOne({
      recruiterEmail: session.user.email,
    });

    const newCompanyData = {
      name: name.trim(),
      industry: industry || "Technology",
      website: website || "",
      location: location || "San Francisco, CA",
      employeeRange: employeeRange || "1-10 employees",
      logo: logo || "",
      description: description || "",
      status: "pending", // Default to pending as requested
      recruiterEmail: session.user.email,
      recruiterId: session.user.id,
      recruiterName: session.user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (existing) {
      await companies.updateOne(
        { _id: existing._id },
        { $set: { ...newCompanyData, updatedAt: new Date() } }
      );
      return NextResponse.json({
        success: true,
        company: { ...existing, ...newCompanyData },
        message: "Company details updated successfully!",
      });
    }

    const result = await companies.insertOne(newCompanyData);

    return NextResponse.json({
      success: true,
      company: { _id: result.insertedId, ...newCompanyData },
      message: "Company registered successfully with pending status!",
    });
  } catch (error) {
    console.error("POST /api/company error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to register company" },
      { status: 500 }
    );
  }
}

// PUT update company
export async function PUT(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      industry,
      website,
      location,
      employeeRange,
      logo,
      description,
    } = body;

    const db = await getDatabase();
    const companies = db.collection("companies");

    const updateFields = {
      ...(name && { name: name.trim() }),
      ...(industry && { industry }),
      ...(website !== undefined && { website }),
      ...(location !== undefined && { location }),
      ...(employeeRange && { employeeRange }),
      ...(logo !== undefined && { logo }),
      ...(description !== undefined && { description }),
      updatedAt: new Date(),
    };

    const result = await companies.findOneAndUpdate(
      { recruiterEmail: session.user.email },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      company: result,
      message: "Company profile updated successfully!",
    });
  } catch (error) {
    console.error("PUT /api/company error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update company" },
      { status: 500 }
    );
  }
}
