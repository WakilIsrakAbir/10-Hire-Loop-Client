"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import { createJobAction } from "@/actions/jobActions";

export default function PostJob({ user }) {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Engineering",
    jobType: "Full-time",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    isRemote: true,
    location: "San Francisco, CA",
    deadline: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
  });

  // Fetch recruiter's registered company
  useEffect(() => {
    async function loadCompany() {
      try {
        setLoadingCompany(true);
        const res = await fetch("/api/company");
        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            setCompany(data.company);
          }
        }
      } catch (err) {
        console.error("Error fetching company for job post:", err);
      } finally {
        setLoadingCompany(false);
      }
    }
    loadCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await createJobAction(formData);
      if (result.success) {
        setSuccessToast(true);
        setTimeout(() => {
          router.push("/dashboard/recruiter/jobs");
        }, 1200);
      } else {
        setErrorMessage(result.error || "Failed to publish job post.");
      }
    } catch (err) {
      console.error("Job submit error:", err);
      setErrorMessage(err?.message || "Something went wrong while posting the job.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "Engineering",
    "Product Management",
    "Design & Creative",
    "Data & AI",
    "Marketing & Growth",
    "Sales & Business Development",
    "Customer Support & Operations",
    "Finance & Legal",
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Remote",
    "Contract",
    "Internship",
  ];

  const currencies = ["USD ($)", "EUR (€)", "GBP (£)", "BDT (৳)", "CAD ($)", "AUD ($)"];

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Left Sidebar */}
      <RecruiterSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/dashboard/recruiter/jobs"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Manage Jobs
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-white">Post a Job</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/recruiter/jobs"
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel
            </Link>

            <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">
                  {user?.name || "Alex Sterling"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {company?.name || user?.companyName || "TechFlow Inc."}
                </p>
              </div>
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">
                  {user?.name ? user.name.charAt(0) : "A"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-8 flex-1">
          {/* Success Toast */}
          {successToast && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in duration-200">
              <svg className="w-5 h-5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Job published successfully! Redirecting to Manage Jobs...</span>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 animate-in fade-in duration-200">
              <svg className="w-5 h-5 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Post a New Job
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Create and publish high-performance job listings connected to your verified company profile.
            </p>
          </div>

          {/* Company Status & Plan Banner */}
          <div className="p-5 rounded-3xl bg-[#141417] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D77F] p-0.5 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#141417] flex items-center justify-center overflow-hidden font-bold text-yellow-400">
                  {company?.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    company?.name?.charAt(0) || "C"
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white">
                    {company?.name || user?.companyName || "Your Company"}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {company?.status === "approved" ? "Approved Company" : "Active Recruiter"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Plan Limit: <span className="text-white font-medium">1 / 10 Active Jobs used</span> (Growth Plan)
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/recruiter/company"
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 border border-white/5 transition-colors"
            >
              Manage Company
            </Link>
          </div>

          {/* Main Job Post Form */}
          <form onSubmit={handleSubmitJob} className="space-y-8">
            {/* SECTION 1: JOB INFO */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/5 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>💼</span>
                  <span>Job Info</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  General details and basic employment specifications
                </p>
              </div>

              <div className="space-y-5">
                {/* Job Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Distributed Systems Engineer"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                  />
                </div>

                {/* Job Category & Job Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                      Job Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#141417] text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                      Job Type *
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                    >
                      {jobTypes.map((type) => (
                        <option key={type} value={type} className="bg-[#141417] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Salary Range (Min, Max, Currency) */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    Salary Range & Currency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="Min Salary (e.g. 130,000)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="Max Salary (e.g. 180,000)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                      >
                        {currencies.map((curr) => (
                          <option key={curr} value={curr} className="bg-[#141417] text-white">
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location, Remote toggle & Application Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                    />

                    {/* Remote Toggle */}
                    <label className="flex items-center gap-2.5 mt-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-300">
                        This is a fully remote position 🌍
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: JOB DESCRIPTION */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/5 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📝</span>
                  <span>Job Description & Requirements</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Detailed day-to-day responsibilities, experience qualifications, and benefits
                </p>
              </div>

              <div className="space-y-5">
                {/* Responsibilities */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    Key Responsibilities *
                  </label>
                  <textarea
                    rows={4}
                    name="responsibilities"
                    required
                    value={formData.responsibilities}
                    onChange={handleChange}
                    placeholder="• Architect and build scalable microservices and APIs&#10;• Collaborate with product and design teams to deliver delightful user experiences&#10;• Optimize applications for maximum performance and security"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 leading-relaxed resize-y"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    Job Requirements & Qualifications *
                  </label>
                  <textarea
                    rows={4}
                    name="requirements"
                    required
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="• 4+ years of professional experience in modern software engineering&#10;• Strong proficiency with TypeScript, React, Next.js, Node.js or Golang&#10;• Deep understanding of distributed databases and cloud platforms (AWS / GCP)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 leading-relaxed resize-y"
                  />
                </div>

                {/* Benefits (Optional) */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    Company Benefits & Perks <span className="text-[10px] text-zinc-500 normal-case">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    placeholder="• Comprehensive 100% covered health, dental & vision&#10;• Unlimited PTO & annual retreat in Europe&#10;• $3,000 yearly learning and wellness stipend"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 leading-relaxed resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Submission Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/dashboard/recruiter/jobs"
                className="px-5 py-3 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-all duration-200 shadow-xl shadow-white/10 flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Publishing Job...</span>
                  </>
                ) : (
                  <span>Publish Job Listing</span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
