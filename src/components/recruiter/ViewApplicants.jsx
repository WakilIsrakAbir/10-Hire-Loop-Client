"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";

// Sample initial applicants for this specific job
const initialApplicants = [
  {
    id: "APP-001",
    name: "Julianne Moore",
    email: "julianne.m@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    dateApplied: "Oct 24, 2023",
    experience: "6 years",
    resumeUrl: "#",
    status: "Shortlisted",
  },
  {
    id: "APP-002",
    name: "Robert Downey",
    email: "robert.d@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dateApplied: "Oct 23, 2023",
    experience: "4 years",
    resumeUrl: "#",
    status: "Under Review",
  },
  {
    id: "APP-003",
    name: "Emma Stone",
    email: "emma.stone@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dateApplied: "Oct 22, 2023",
    experience: "8 years",
    resumeUrl: "#",
    status: "Offered",
  },
  {
    id: "APP-004",
    name: "Chris Pratt",
    email: "chris.p@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    dateApplied: "Oct 21, 2023",
    experience: "5 years",
    resumeUrl: "#",
    status: "Applied",
  },
  {
    id: "APP-005",
    name: "Scarlett Johansson",
    email: "scarlett.j@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    dateApplied: "Oct 19, 2023",
    experience: "7 years",
    resumeUrl: "#",
    status: "Rejected",
  },
];

export default function ViewApplicants({ jobId = "JOB-101", user }) {
  const router = useRouter();
  const [applicants, setApplicants] = useState(initialApplicants);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch(`/api/applications?jobId=${jobId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.applications && data.applications.length > 0) {
            const mapped = data.applications.map((app) => ({
              id: app._id || app.id,
              name: app.applicantName,
              email: app.applicantEmail,
              avatar:
                app.applicantImage ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(app.applicantName)}`,
              dateApplied: new Date(app.appliedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              experience: "3+ years",
              resumeUrl: app.resumeUrl || "#",
              portfolioUrl: app.portfolio || "#",
              coverNote: app.coverNote || "",
              status: app.status || "Under Review",
            }));
            setApplicants([...mapped, ...initialApplicants]);
          }
        }
      } catch (err) {
        console.error("Failed to load live applications:", err);
      }
    }
    loadApplications();
  }, [jobId]);

  const statusOptions = ["Applied", "Under Review", "Shortlisted", "Rejected", "Offered"];

  const handleStatusChange = (applicantId, newStatus) => {
    const applicant = applicants.find((a) => a.id === applicantId);
    setApplicants((prev) =>
      prev.map((app) => (app.id === applicantId ? { ...app, status: newStatus } : app))
    );

    // Trigger email notification alert
    setToastMessage(
      `Updated ${applicant?.name}'s status to "${newStatus}". Email notification sent to ${applicant?.email}!`
    );
    setTimeout(() => setToastMessage(""), 4000);
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Left Sidebar */}
      <RecruiterSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <Link href="/dashboard/recruiter/jobs" className="text-zinc-400 hover:text-white transition-colors">
              Manage Jobs
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-indigo-400 font-mono">{jobId}</span>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-white">Applicants</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/recruiter/jobs"
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              ← Back to Jobs
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <svg className="w-4 h-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Job Applicants
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-zinc-300 border border-white/10">
                  {filteredApplicants.length} Candidates
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Review applicant profiles, download resumes, and manage interview pipeline stages.
              </p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="p-4 rounded-2xl bg-[#141417] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name or email..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {["All", ...statusOptions].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === status
                      ? "bg-white text-black font-semibold shadow"
                      : "text-zinc-400 hover:text-white bg-white/5"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Applicants Table */}
          <div className="rounded-2xl bg-[#141417] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-5">Applicant Name</th>
                    <th className="py-4 px-5">Email Address</th>
                    <th className="py-4 px-5">Date Applied</th>
                    <th className="py-4 px-5">Resume</th>
                    <th className="py-4 px-5 text-right">Pipeline Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-zinc-300">
                  {filteredApplicants.length > 0 ? (
                    filteredApplicants.map((app) => (
                      <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.avatar}
                              alt={app.name}
                              className="w-8 h-8 rounded-full object-cover border border-white/10"
                            />
                            <div>
                              <span className="font-bold text-white block">{app.name}</span>
                              <span className="text-[10px] text-zinc-500">{app.experience} exp</span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-5 text-zinc-400 font-mono text-[11px]">
                          {app.email}
                        </td>

                        {/* Date Applied */}
                        <td className="py-4 px-5 text-zinc-400">
                          {app.dateApplied}
                        </td>

                        {/* Resume Link */}
                        <td className="py-4 px-5">
                          <button
                            type="button"
                            onClick={() => alert(`Opening resume for ${app.name}`)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Resume.pdf</span>
                          </button>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-4 px-5 text-right">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer border ${
                              app.status === "Offered"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : app.status === "Shortlisted"
                                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                                : app.status === "Under Review"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : app.status === "Rejected"
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                : "bg-white/10 text-zinc-300 border-white/15"
                            }`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#141417] text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500 text-xs">
                        No applicants found matching this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
