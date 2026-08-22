"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function AdminJobsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusTab, setStatusTab] = useState("active"); // "active" | "closed"
  const [toastMessage, setToastMessage] = useState("");

  const [jobsList, setJobsList] = useState([
    {
      id: "j-1",
      refCode: "HL-90210",
      title: "Senior Product Designer",
      company: "Nexus Lab",
      category: "Design",
      type: "Full-time",
      datePosted: "Oct 24, 2026",
      status: "Active",
    },
    {
      id: "j-2",
      refCode: "HL-88231",
      title: "Full-stack Engineer",
      company: "Quantum",
      category: "Engineering",
      type: "Contract",
      datePosted: "Oct 22, 2026",
      status: "Active",
    },
    {
      id: "j-3",
      refCode: "HL-11022",
      title: "Marketing Director",
      company: "Vanguard",
      category: "Marketing",
      type: "Full-time",
      datePosted: "Oct 15, 2026",
      status: "Closed",
    },
    {
      id: "j-4",
      refCode: "HL-99032",
      title: "Backend Architect",
      company: "CloudScale",
      category: "Engineering",
      type: "Remote",
      datePosted: "Oct 20, 2026",
      status: "Active",
    },
    {
      id: "j-5",
      refCode: "HL-44112",
      title: "UX Research Lead",
      company: "Humanize",
      category: "Design",
      type: "Hybrid",
      datePosted: "Oct 19, 2026",
      status: "Active",
    },
  ]);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const handleDeleteJob = (jobId, title) => {
    if (confirm(`Are you sure you want to remove job "${title}" from the platform?`)) {
      setJobsList((prev) => prev.filter((j) => j.id !== jobId));
      setToastMessage(`Job listing "${title}" removed.`);
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  const handleStatusToggle = (jobId, currentStatus, title) => {
    const newStatus = currentStatus === "Active" ? "Closed" : "Active";
    setJobsList((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    setToastMessage(`Job "${title}" is now ${newStatus}.`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filteredJobs = jobsList.filter((j) => {
    const matchStatus =
      selectedStatus === "All" || j.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchCategory =
      selectedCategory === "All" || j.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchTab = statusTab === "active" ? j.status === "Active" : j.status === "Closed";
    const matchSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.refCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchStatus && matchCategory && matchTab && matchSearch;
  });

  const activeCount = jobsList.filter((j) => j.status === "Active").length;
  const closedCount = jobsList.filter((j) => j.status === "Closed").length;

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Jobs Management..."
        subMessage="Fetching all platform listings and status records"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content matching Figma Screenshot 1 */}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, or ref ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white">
              Admin View ▾
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Title Header & Create Job Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Jobs</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Oversee all active listings and historical job posts across the platform.
              </p>
            </div>

            <Link
              href="/dashboard/recruiter/jobs/new"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>+</span>
              <span>Create Job</span>
            </Link>
          </div>

          {/* Filters Row matching Figma Screenshot 1 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#141217] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Category dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#141217] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            {/* Active / Closed Toggle Pills */}
            <div className="p-1 rounded-xl bg-[#141217] border border-white/5 flex items-center">
              <button
                onClick={() => setStatusTab("active")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusTab === "active" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Active ({activeCount + 124})
              </button>
              <button
                onClick={() => setStatusTab("closed")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusTab === "closed" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Closed ({closedCount + 44})
              </button>
            </div>
          </div>

          {/* Jobs Table matching Figma Screenshot 1 */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="pb-4 pl-2">Title</th>
                    <th className="pb-4">Company</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Date Posted</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Title & Ref code */}
                      <td className="py-4 pl-2">
                        <div>
                          <h4 className="font-semibold text-sm text-white">{job.title}</h4>
                          <span className="text-[10px] text-zinc-500 font-mono">Ref: {job.refCode}</span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                            {job.company.slice(0, 1)}
                          </div>
                          <span className="text-zinc-300 font-medium">{job.company}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300">
                          {job.category}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-4 text-zinc-400">{job.type}</td>

                      {/* Date Posted */}
                      <td className="py-4 text-zinc-400">{job.datePosted}</td>

                      {/* Status */}
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === "Active"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : "bg-zinc-700/30 border border-zinc-600/30 text-zinc-400"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${job.status === "Active" ? "bg-emerald-400" : "bg-zinc-400"}`} />
                          <span>{job.status.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right pr-2">
                        <div className="flex items-center justify-end gap-3">
                          {/* View Job link */}
                          <Link
                            href="/jobs"
                            className="text-zinc-400 hover:text-white p-1 transition-colors"
                            title="View Job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>

                          {/* Delete Job */}
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            title="Delete Job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Showing 1-5 of 173 results</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">‹</button>
                <button className="w-7 h-7 rounded-lg bg-white text-black font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">3</button>
                <span className="px-1 text-zinc-500">...</span>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">35</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">›</button>
              </div>
            </div>
          </div>

          {/* Bottom 3 Summary KPI Cards matching Figma Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 1. Engagement Rate */}
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <span>📈</span>
                <span>Engagement Rate</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">82.4%</h3>
              <p className="text-[10px] text-emerald-400 font-semibold">+5.2% from last month</p>
            </div>

            {/* 2. Avg. Time to Fill */}
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <span>⏱</span>
                <span>Avg. Time to Fill</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">14 Days</h3>
              <p className="text-[10px] text-zinc-500">Stable performance</p>
            </div>

            {/* 3. Total Applications */}
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <span>📨</span>
                <span>Total Applications</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">12,840</h3>
              <p className="text-[10px] text-amber-400">-2.1% across tech sectors</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
