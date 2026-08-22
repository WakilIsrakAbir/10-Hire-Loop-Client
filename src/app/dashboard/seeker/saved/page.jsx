"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import SeekerSidebar from "@/components/seeker/SeekerSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function SavedJobsRoute() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [toastMessage, setToastMessage] = useState("");

  const categories = ["All Saved", "Engineering", "Design", "Product", "Marketing"];

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/saved-jobs");
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data.savedJobs || []);
      }
    } catch (err) {
      console.error("Failed to load saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const handleRemoveSaved = async (jobId, title) => {
    try {
      const res = await fetch(`/api/saved-jobs?jobId=${jobId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedJobs((prev) => prev.filter((j) => String(j.jobId) !== String(jobId)));
        setToastMessage(`Removed "${title}" from saved jobs.`);
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to remove saved job:", err);
    }
  };

  const filteredJobs = savedJobs.filter((job) => {
    if (filterCategory === "All Saved") return true;
    return (job.category || "").toLowerCase() === filterCategory.toLowerCase();
  });

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Saved Jobs..."
        subMessage="Retrieving your bookmarked career opportunities"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <SeekerSidebar user={user} />

      {/* Main Content matching Figma Screenshot 4 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
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
              placeholder="Search jobs, companies, or skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-lg"
            >
              <span>+</span>
              <span>Find More Jobs</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Toast Alert */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Title & Summary Stats Header matching Figma Screenshot 4 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Jobs</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage and track your bookmarked opportunities.
              </p>
            </div>

            {/* Right Stat Summary Boxes */}
            <div className="flex items-center gap-4">
              <div className="p-4 px-6 rounded-2xl bg-[#141217] border border-white/5 flex items-center gap-4 min-w-[140px]">
                <div className="p-2.5 rounded-xl bg-white/5 text-zinc-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">
                    Total Saved
                  </span>
                  <strong className="text-2xl font-bold text-white">{savedJobs.length}</strong>
                </div>
              </div>

              <div className="p-4 px-6 rounded-2xl bg-[#141217] border border-white/5 flex items-center gap-4 min-w-[140px]">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">
                    Closing Soon
                  </span>
                  <strong className="text-2xl font-bold text-amber-400">
                    {Math.min(3, savedJobs.length)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs & Sort Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    filterCategory === cat
                      ? "bg-white/10 text-white font-semibold border border-white/10"
                      : "bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#141217] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="recent">Recently Saved</option>
                <option value="closing">Closing Soon</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Saved Job Cards matching Figma Screenshot 4 */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-3xl bg-[#141217]/70 border border-white/5 animate-shimmer p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 shrink-0" />
                    <div className="space-y-2">
                      <div className="h-4 w-44 bg-white/10 rounded" />
                      <div className="h-3 w-28 bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-white/5 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#141217] border border-white/5 space-y-4">
              <div className="text-4xl">🔖</div>
              <h3 className="text-base font-bold text-white">No saved jobs yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Explore openings and click the bookmark icon on any job card to save it for quick review.
              </p>
              <Link
                href="/jobs"
                className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 transition-all"
              >
                Browse Openings →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job._id || job.jobId}
                  className="p-6 rounded-3xl bg-[#141217] hover:bg-[#18151D] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-base overflow-hidden shrink-0">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                      ) : (
                        (job.companyName || "C").slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/jobs/${job.jobId}`}>
                          <h3 className="text-base font-bold text-white hover:text-purple-300 transition-colors">
                            {job.title}
                          </h3>
                        </Link>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {job.companyName}
                        </span>
                      </div>

                      {/* Location & Salary pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                          <span>📍</span>
                          <span>{job.location || "Remote"}</span>
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-300 font-medium">
                          <span>💰</span>
                          <span>{job.salary || "$140k - $180k"}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right metadata & action buttons */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-zinc-400 block">Saved recently</span>
                      <span className="text-amber-400 text-[11px] font-medium block mt-0.5">Closes in 3 days</span>
                    </div>

                    {/* Bookmark Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(job.jobId, job.title)}
                      className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>

                    {/* Apply Now */}
                    <Link
                      href={`/jobs/${job.jobId}`}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg text-center"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
