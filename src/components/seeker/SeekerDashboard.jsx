"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SeekerSidebar from "./SeekerSidebar";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { MetricCardsSkeleton } from "@/components/ui/loading/ShimmerSkeleton";

export { ProfileSettingsForm };

export default function SeekerDashboard({ user, refetch }) {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [quota, setQuota] = useState({
    appliedCount: 0,
    maxLimit: 3,
    remaining: 3,
    isPro: false,
    limitReached: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // 1. Fetch applications
        const appRes = await fetch("/api/applications");
        if (appRes.ok) {
          const data = await appRes.json();
          setApplications(data.applications || []);
          if (data.quota) setQuota(data.quota);
        }

        // 2. Fetch saved jobs count
        const saveRes = await fetch("/api/saved-jobs");
        if (saveRes.ok) {
          const data = await saveRes.json();
          setSavedJobsCount(data.count || (data.savedJobs || []).length);
        }
      } catch (err) {
        console.error("Failed to load seeker dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Status metrics
  const appliedCount = applications.length;
  const underReviewCount = applications.filter((a) => (a.status || "Under Review") === "Under Review").length;
  const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;
  const offeredCount = applications.filter((a) => a.status === "Offered").length;
  const interviewsCount = shortlistedCount + offeredCount;

  // Max for bar chart proportion
  const maxStatus = Math.max(1, appliedCount, underReviewCount, shortlistedCount, rejectedCount, offeredCount);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Unified Left Sidebar */}
      <SeekerSidebar user={user} isPro={quota.isPro} />

      {/* Main Content Area matching Figma Screenshot 3 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between gap-6 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          {/* Search bar */}
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
              placeholder="Search for opportunities..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Action icons & Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-colors relative">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-2 ring-2 ring-[#0c0c0e]" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] flex items-center justify-center font-bold text-xs overflow-hidden shadow-lg">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                (user?.name || "U").charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Top 4 Stat Cards matching Figma Screenshot 3 */}
          {loading ? (
            <MetricCardsSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Saved Jobs */}
              <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-medium">Saved Jobs</span>
                  <h3 className="text-3xl font-extrabold text-white mt-2">{savedJobsCount}</h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 text-zinc-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              </div>

              {/* 2. Applications Submitted */}
              <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-medium">Applications Submitted</span>
                  <h3 className="text-3xl font-extrabold text-white mt-2">{appliedCount}</h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>

              {/* 3. Interviews Scheduled */}
              <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-medium">Interviews Scheduled</span>
                  <h3 className="text-3xl font-extrabold text-amber-400 mt-2">{interviewsCount}</h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* 4. Offers Received */}
              <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-medium">Offers Received</span>
                  <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">{offeredCount}</h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 2-Column Analytics Section (Profile Card & Application Status Bars) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: User Profile Card */}
            <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 flex flex-col justify-between space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-xl shrink-0">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{user?.name || "Alex Rivera"}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-xs text-zinc-400">
                  <span>Tier: </span>
                  <span className="font-semibold text-purple-400">
                    {quota.isPro ? "Professional Member" : "Free Seeker Plan"}
                  </span>
                </div>
                <Link
                  href="/dashboard/seeker/settings"
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Right: Application Status Horizontal Bars matching Figma Screenshot 3 */}
            <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Application Status</h3>

              <div className="space-y-3 pt-1 text-xs">
                {/* Applied */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 font-medium">
                    <span>Applied</span>
                    <span className="text-white font-bold">{appliedCount}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{ width: `${Math.min(100, (appliedCount / maxStatus) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Under Review */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 font-medium">
                    <span>Under Review</span>
                    <span className="text-amber-400 font-bold">{underReviewCount}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (underReviewCount / maxStatus) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Shortlisted */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 font-medium">
                    <span>Shortlisted</span>
                    <span className="text-indigo-400 font-bold">{shortlistedCount}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (shortlistedCount / maxStatus) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Rejected */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 font-medium">
                    <span>Rejected</span>
                    <span className="text-rose-400 font-bold">{rejectedCount}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (rejectedCount / maxStatus) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Offered */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 font-medium">
                    <span>Offered</span>
                    <span className="text-emerald-400 font-bold">{offeredCount}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (offeredCount / maxStatus) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed matching Figma Screenshot 3 */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
              <Link href="/dashboard/seeker/applications" className="text-xs text-purple-400 hover:text-purple-300">
                View All Activity →
              </Link>
            </div>

            <div className="space-y-3">
              {applications.length > 0 ? (
                applications.slice(0, 3).map((app, idx) => (
                  <div
                    key={app._id || idx}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm">
                        🔄
                      </div>
                      <div>
                        <p className="text-xs text-zinc-200">
                          Application for <strong className="text-white">{app.jobTitle}</strong> at{" "}
                          <span className="text-purple-400">{app.companyName}</span> updated to{" "}
                          <span className="underline decoration-purple-500/50">{app.status || "Under Review"}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-500 shrink-0">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No recent activity yet. Start browsing and applying for jobs!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
