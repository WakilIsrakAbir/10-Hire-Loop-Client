"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Applicant count per job post data for Recharts
const applicantChartData = [
  { name: "Frontend Eng", applicants: 64 },
  { name: "Product Design", applicants: 42 },
  { name: "DevOps Arch", applicants: 29 },
  { name: "Marketing Lead", applicants: 88 },
  { name: "AI Scientist", applicants: 15 },
  { name: "Backend Dev", applicants: 52 },
];

// Recent applicants list
const recentApplications = [
  {
    id: 1,
    name: "Julianne Moore",
    jobTitle: "Senior Product Designer",
    date: "12 mins ago",
    status: "Interviewing",
    statusColor: "emerald",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Robert Downey",
    jobTitle: "Senior Full Stack Engineer",
    date: "45 mins ago",
    status: "Under Review",
    statusColor: "amber",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Emma Stone",
    jobTitle: "Growth Marketing Manager",
    date: "2 hours ago",
    status: "Shortlisted",
    statusColor: "indigo",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Chris Pratt",
    jobTitle: "DevOps & Cloud Architect",
    date: "5 hours ago",
    status: "Applied",
    statusColor: "slate",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

export default function RecruiterDashboard({ user }) {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true);

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
        console.error(err);
      } finally {
        setLoadingCompany(false);
      }
    }
    loadCompany();
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Left Sidebar */}
      <RecruiterSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="relative flex-1 max-w-xl">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search applications, jobs, or talent..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141417] border border-white/5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/recruiter/jobs/new"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Post a Job</span>
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
                  className="w-9 h-9 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">
                  {user?.name ? user.name.charAt(0) : "A"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {/* Welcome Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Alex Sterling"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Here is your talent acquisition pipeline and hiring performance overview.
            </p>
          </div>

          {/* 1. Stats Row: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-[#141417] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Total Job Posts</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">48</h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#141417] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Total Applicants</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">1,284</h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#141417] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Active Jobs</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">18</h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#141417] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Jobs Closed</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-300 mt-1">32</h3>
            </div>
          </div>

          {/* 2. Recharts & Company Card Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Company Profile Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141417] border border-white/5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🏢</span>
                  <span>Company Profile</span>
                </h3>
                <Link
                  href="/dashboard/recruiter/company"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D77F] p-0.5 shrink-0 shadow-lg shadow-yellow-500/10">
                  <div className="w-full h-full rounded-[14px] bg-[#141417] flex items-center justify-center overflow-hidden font-bold text-2xl text-yellow-400">
                    {company?.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      company?.name?.charAt(0) || "C"
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">
                    {company?.name || "TechFlow Inc."}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {company?.industry || "Technology & Software"} • {company?.location || "San Francisco, CA"}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {company?.status === "approved" ? "Verified Employer" : "Active Recruiter"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Plan: Growth (10 Jobs)</span>
                <Link
                  href="/dashboard/recruiter/billing"
                  className="text-white hover:text-indigo-400 font-medium"
                >
                  Manage Plan →
                </Link>
              </div>
            </div>

            {/* Right: Recharts Bar Chart (Applicant count per job post last 30 days) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141417] border border-white/5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📊</span>
                    <span>Applicant Count per Job Post (Last 30 Days)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Live candidate volume across top active listings
                  </p>
                </div>
                <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  Total: 245
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicantChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1c1c21",
                        borderColor: "#ffffff20",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="applicants" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 3. Recent Applications: Notification-style List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Recent Applications
                </h2>
                <p className="text-xs text-zinc-400">
                  Notification-style timeline of latest candidate submissions
                </p>
              </div>
              <Link
                href="/dashboard/recruiter/jobs"
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                View all jobs →
              </Link>
            </div>

            <div className="rounded-3xl bg-[#141417] border border-white/5 divide-y divide-white/5 overflow-hidden">
              {recentApplications.map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {candidate.name}
                        </h4>
                        <span className="text-[10px] text-zinc-500">• {candidate.date}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Applied for <span className="text-zinc-300 font-medium">{candidate.jobTitle}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        candidate.statusColor === "emerald"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : candidate.statusColor === "amber"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : candidate.statusColor === "indigo"
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                          : "bg-white/10 text-zinc-300 border border-white/10"
                      }`}
                    >
                      {candidate.status}
                    </span>

                    <Link
                      href={`/dashboard/jobs/JOB-101/applicants`}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Review candidate"
                    >
                      →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button for Post Job */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/recruiter/jobs/new")}
        aria-label="Post a new job"
        className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-white text-black hover:bg-zinc-200 shadow-2xl flex items-center justify-center font-bold text-2xl transition-all duration-200 hover:scale-110 cursor-pointer shadow-black/80"
      >
        +
      </button>
    </div>
  );
}
