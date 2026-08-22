"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import SeekerSidebar from "@/components/seeker/SeekerSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";
import { TableSkeleton } from "@/components/ui/loading/ShimmerSkeleton";

export default function SeekerApplicationsRoute() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active"); // "active" | "archived"
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  // Metrics
  const totalApplied = applications.length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted" || a.status === "Offered").length;
  const interviews = applications.filter((a) => a.status === "Shortlisted").length;
  const successRate = totalApplied > 0 ? Math.round((shortlisted / totalApplied) * 100) : 0;

  // Status pill styling matching Figma
  const getStatusBadge = (status) => {
    switch (status) {
      case "Offered":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-400";
      case "Shortlisted":
        return "bg-purple-500/15 border-purple-500/40 text-purple-300";
      case "Rejected":
        return "bg-rose-500/15 border-rose-500/40 text-rose-400";
      case "Under Review":
      case "Review":
        return "bg-amber-500/15 border-amber-500/40 text-amber-400";
      case "Applied":
      default:
        return "bg-white/10 border-white/20 text-zinc-300";
    }
  };

  // Pagination slicing
  const totalPages = Math.ceil(applications.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const displayedApplications = applications.slice(startIndex, startIndex + itemsPerPage);

  const handleExportPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Applications..."
        subMessage="Retrieving your submitted job applications"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <SeekerSidebar user={user} />

      {/* Main Content matching Figma Screenshot 5 */}
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
              placeholder="Search applications or companies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Top Title & Actions matching Figma Screenshot 5 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">My Applications</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Track review progress, status changes, and interview invitations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Active / Archived Toggle */}
              <div className="p-1 rounded-xl bg-[#141217] border border-white/5 flex items-center">
                <button
                  onClick={() => setTab("active")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === "active" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Active ({applications.length})
                </button>
                <button
                  onClick={() => setTab("archived")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === "archived" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Archived (0)
                </button>
              </div>

              {/* Export PDF Button */}
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* 4 Summary Stat Cards matching Figma Screenshot 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Total Applications</span>
              <h3 className="text-3xl font-extrabold text-white mt-2">{totalApplied}</h3>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Shortlisted</span>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-2">{shortlisted}</h3>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Interviews</span>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-2">{interviews}</h3>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Success Rate</span>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">{successRate}%</h3>
            </div>
          </div>

          {/* Applications Table Card matching Figma Screenshot 5 */}
          {loading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : applications.length === 0 ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141217] border border-white/5 text-center py-16 space-y-4">
              <div className="text-3xl">📂</div>
              <h4 className="text-base font-bold text-white">No applications submitted yet</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Start applying for open roles to track recruiter review and interview statuses in real-time.
              </p>
              <Link
                href="/jobs"
                className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 transition-all"
              >
                Browse Open Jobs →
              </Link>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
                      <th className="pb-4 pl-2">Job Title</th>
                      <th className="pb-4">Company</th>
                      <th className="pb-4">Applied</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {displayedApplications.map((app) => (
                        <tr key={app._id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Job Title & Details */}
                          <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                                {app.companyLogo ? (
                                  <img src={app.companyLogo} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (app.companyName || "C").slice(0, 2).toUpperCase()
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-white">{app.jobTitle}</h4>
                                <span className="text-[11px] text-zinc-400">Full-time • Remote</span>
                              </div>
                            </div>
                          </td>

                          {/* Company */}
                          <td className="py-4 text-zinc-300 font-medium">
                            {app.companyName}
                          </td>

                          {/* Date Applied */}
                          <td className="py-4 text-zinc-400">
                            {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "2 hours ago"}
                          </td>

                          {/* Status Pill */}
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                                app.status || "Applied"
                              )}`}
                            >
                              {app.status || "Applied"}
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-4 text-right pr-2">
                            <Link
                              href={`/jobs/${app.jobId}`}
                              className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer: Showing X of Y + Pagination */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400">
                  <span>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, applications.length)} of {applications.length} applications
                  </span>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ‹
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold ${
                            page === p ? "bg-white text-black" : "bg-white/5 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
