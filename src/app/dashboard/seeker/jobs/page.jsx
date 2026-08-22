"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "@/lib/auth-client";
import SeekerSidebar from "@/components/seeker/SeekerSidebar";

export default function SeekerPortalJobsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorkType, setSelectedWorkType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedMinSalary, setSelectedMinSalary] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Application Modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    resumeUrl: "",
    portfolioUrl: "",
    coverNote: "",
  });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Quota status
  const [quota, setQuota] = useState({
    appliedCount: 0,
    maxLimit: 3,
    remaining: 3,
    isPro: false,
    limitReached: false,
  });

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeekerQuota = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        if (data.quota) {
          setQuota(data.quota);
        }
      }
    } catch (err) {
      console.error("Failed to fetch quota:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSeekerQuota();
    }
  }, [user]);

  const categories = ["All", "Engineering", "Design", "Product", "Marketing", "Sales", "AI & ML"];
  const workTypes = ["All", "Full-time", "Contract", "Remote", "Part-time", "Hybrid"];
  const locations = ["All", "Remote", "San Francisco, CA", "New York, NY", "London, UK", "Austin, TX"];
  const salaryOptions = [
    { label: "All Salaries", value: "All" },
    { label: "$60k+ / year", value: 60000 },
    { label: "$100k+ / year", value: 100000 },
    { label: "$140k+ / year", value: 140000 },
    { label: "$180k+ / year", value: 180000 },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Category
      if (selectedCategory !== "All") {
        const cat = (job.category || job.department || "").toLowerCase();
        if (!cat.includes(selectedCategory.toLowerCase())) return false;
      }
      // Work type
      if (selectedWorkType !== "All") {
        const type = (job.type || job.jobType || "").toLowerCase();
        if (!type.includes(selectedWorkType.toLowerCase())) return false;
      }
      // Location
      if (selectedLocation !== "All") {
        const loc = (job.location || "").toLowerCase();
        if (selectedLocation === "Remote") {
          if (!loc.includes("remote")) return false;
        } else {
          if (!loc.includes(selectedLocation.toLowerCase().split(",")[0])) return false;
        }
      }
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const titleMatch = (job.title || "").toLowerCase().includes(q);
        const compMatch = (job.companyName || "").toLowerCase().includes(q);
        const descMatch = (job.description || "").toLowerCase().includes(q);
        if (!titleMatch && !compMatch && !descMatch) return false;
      }
      return true;
    });
  }, [jobs, selectedCategory, selectedWorkType, selectedLocation, searchTerm]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const openApplyModal = (job) => {
    fetchSeekerQuota();
    setSelectedJobForApply(job);
    setApplyError("");
    setApplySuccess(false);
    setApplyForm({
      name: user?.name || "",
      email: user?.email || "",
      resumeUrl: "",
      portfolioUrl: "",
      coverNote: "",
    });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    setApplySubmitting(true);
    setApplyError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJobForApply._id || selectedJobForApply.id,
          jobTitle: selectedJobForApply.title,
          companyName: selectedJobForApply.companyName,
          fullName: applyForm.name,
          email: applyForm.email,
          resumeUrl: applyForm.resumeUrl,
          portfolio: applyForm.portfolioUrl,
          coverNote: applyForm.coverNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApplyError(data.error || "Failed to submit application.");
        if (data.limitReached) {
          setQuota((prev) => ({ ...prev, limitReached: true }));
        }
        setApplySubmitting(false);
        return;
      }

      if (data.quota) {
        setQuota(data.quota);
      }

      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedJobForApply(null);
      }, 2200);
    } catch (err) {
      console.error(err);
      setApplyError("Network error while submitting application.");
    } finally {
      setApplySubmitting(false);
    }
  };

  const handleBookmarkJob = async (job) => {
    try {
      const res = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id || job.id,
          title: job.title,
          companyName: job.companyName,
          location: job.location,
          salary: job.salary,
          jobType: job.type || job.jobType,
          category: job.category || job.department,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setToastMessage(data.message || "Bookmark updated!");
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isPending || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c0e] text-white">
        <div className="animate-pulse text-zinc-400 text-sm">Loading jobs portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <SeekerSidebar user={user} isPro={quota.isPro} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between gap-6 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, company, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">
              Applications Quota:{" "}
              <strong className={quota.isPro ? "text-purple-400" : "text-amber-400"}>
                {quota.isPro ? "Unlimited" : `${quota.appliedCount} / ${quota.maxLimit} Used`}
              </strong>
            </span>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Toast Message */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Opportunities</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Browse, filter, and apply for active positions across leading tech organizations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#141217] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 rounded-3xl bg-[#141217]/50 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : paginatedJobs.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#141217] border border-white/5 space-y-3">
              <div className="text-3xl">🔍</div>
              <h4 className="text-base font-bold text-white">No jobs matched your filters</h4>
              <p className="text-xs text-zinc-400">Try clearing filters or search terms.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/15"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedJobs.map((job) => (
                <div
                  key={job._id || job.id}
                  className="p-6 sm:p-7 rounded-3xl bg-[#141217] hover:bg-[#18151D] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-6 shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                          {job.companyName || "Company"}
                        </span>
                        <Link href={`/jobs/${job._id || job.id}`}>
                          <h3 className="text-lg font-bold text-white hover:text-purple-300 transition-colors mt-0.5">
                            {job.title}
                          </h3>
                        </Link>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => handleBookmarkJob(job)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Save Job"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {job.description || "Exciting role to design, build, and deploy high-impact software solutions."}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] text-zinc-300">
                        📍 {job.location || "Remote"}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] text-zinc-300">
                        ⏱ {job.type || job.jobType || "Full-time"}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] text-purple-300 font-medium">
                        💰 {job.salary || "$130k - $170k"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href={`/jobs/${job._id || job.id}`}
                      className="text-xs font-semibold text-zinc-400 hover:text-white"
                    >
                      View Details →
                    </Link>

                    <button
                      type="button"
                      onClick={() => openApplyModal(job)}
                      className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg cursor-pointer"
                    >
                      Quick Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center disabled:opacity-30"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold ${
                    currentPage === p ? "bg-white text-black" : "bg-white/5 text-zinc-400"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center disabled:opacity-30"
              >
                ›
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Quick Apply Modal */}
      <AnimatePresence>
        {selectedJobForApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-7 rounded-3xl bg-[#141217] border border-white/10 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Apply for {selectedJobForApply.title}</h3>
                  <p className="text-xs text-purple-400 mt-0.5">{selectedJobForApply.companyName}</p>
                </div>
                <button
                  onClick={() => setSelectedJobForApply(null)}
                  className="text-zinc-400 hover:text-white text-base"
                >
                  ✕
                </button>
              </div>

              {/* Free limit warning screen */}
              {quota.limitReached && !applySuccess ? (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Free Plan Limit Reached (3/3)</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
                      You have submitted all 3 free job applications. Upgrade to **Pro** to unlock unlimited applications.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Link
                      href="/dashboard/seeker/billing"
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
                    >
                      ⚡ Upgrade to Pro ($29/mo)
                    </Link>
                    <button
                      onClick={() => setSelectedJobForApply(null)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-zinc-400"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {applyError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                      ⚠️ {applyError}
                    </div>
                  )}

                  {applySuccess ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                        ✓
                      </div>
                      <h4 className="text-lg font-bold text-white">Application Submitted!</h4>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        The recruiter at {selectedJobForApply.companyName} has received your application.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleApplySubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-300">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={applyForm.name}
                          onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-300">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-300">Resume / CV Link *</label>
                        <input
                          type="url"
                          required
                          value={applyForm.resumeUrl}
                          onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-300">Cover Note (Optional)</label>
                        <textarea
                          rows={3}
                          value={applyForm.coverNote}
                          onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedJobForApply(null)}
                          className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={applySubmitting}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {applySubmitting ? "Submitting..." : "Submit Application"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
