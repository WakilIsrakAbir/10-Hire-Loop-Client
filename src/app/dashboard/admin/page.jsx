"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const transactions = [
    {
      user: "marcus.k@techcorp.io",
      company: "TechCorp Inc.",
      plan: "Enterprise Monthly",
      txId: "TXN-902341",
      amount: "$1,299.00",
      date: "Oct 24, 2026, 14:20",
      status: "Success",
    },
    {
      user: "sarah.l@creativestudio.com",
      company: "Creative Studio",
      plan: "Professional Annual",
      txId: "TXN-882183",
      amount: "$499.00",
      date: "Oct 24, 2026, 11:05",
      status: "Success",
    },
    {
      user: "j.doe@freelance.org",
      company: "Independent",
      plan: "Starter Monthly",
      txId: "TXN-774128",
      amount: "$49.00",
      date: "Oct 23, 2026, 16:45",
      status: "Pending",
    },
    {
      user: "admin@retailglobal.net",
      company: "Retail Global",
      plan: "Enterprise Monthly",
      txId: "TXN-552014",
      amount: "$1,299.00",
      date: "Oct 23, 2026, 09:12",
      status: "Failed",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Success":
        return "text-emerald-400";
      case "Pending":
        return "text-amber-400";
      case "Failed":
      default:
        return "text-rose-400";
    }
  };

  const handleExportReport = () => {
    if (typeof window !== "undefined") window.print();
  };

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Admin Console..."
        subMessage="Preparing real-time platform metrics and ecosystem logs"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Admin Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content matching Figma Screenshot 3 */}
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
              placeholder="Global search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Top Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Real-time platform performance and growth metrics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl bg-[#141217] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="30d">Last 30 Days</option>
                <option value="7d">Last 7 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>

              <button
                onClick={handleExportReport}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                Export Report
              </button>
            </div>
          </div>

          {/* 5 Metric Summary Cards matching Figma Screenshot 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Total Users */}
            <div className="p-5 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium">Total Users</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +12%
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">124,892</h3>
            </div>

            {/* 2. Total Recruiters */}
            <div className="p-5 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium">Total Recruiters</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +8%
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">12,405</h3>
            </div>

            {/* 3. Total Companies */}
            <div className="p-5 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium">Total Companies</span>
                <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                  -0%
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">4,281</h3>
            </div>

            {/* 4. Jobs Posted */}
            <div className="p-5 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium">Jobs Posted</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +24%
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">8,920</h3>
            </div>

            {/* 5. Platform Revenue */}
            <div className="p-5 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium">Platform Revenue</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +18.5%
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">$245,800</h3>
            </div>
          </div>

          {/* Charts Row: Job Posts by Category (Left) & New Users 30d (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Job Posts by Category (7 Cols) */}
            <div className="lg:col-span-6 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">Job Posts by Category</h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  Active Listings
                </span>
              </div>

              {/* Bar visualization */}
              <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2">
                {[
                  { name: "Engineering", height: "85%", count: "3.2k" },
                  { name: "Design", height: "60%", count: "1.8k" },
                  { name: "Marketing", height: "45%", count: "1.1k" },
                  { name: "Sales", height: "70%", count: "2.4k" },
                  { name: "Operations", height: "30%", count: "800" },
                ].map((col) => (
                  <div key={col.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      {col.count}
                    </span>
                    <div
                      className="w-full rounded-t-xl bg-zinc-700 hover:bg-zinc-500 transition-all cursor-pointer"
                      style={{ height: col.height }}
                    />
                    <span className="text-[10px] text-zinc-400 truncate max-w-full">{col.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: New Users (30d) Growth Curve (6 Cols) */}
            <div className="lg:col-span-6 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">New Users (30d)</h3>
                <span className="text-xs font-bold text-emerald-400">+2,410</span>
              </div>

              {/* Smooth curve mock */}
              <div className="relative h-44 flex items-center justify-center">
                <svg className="w-full h-36" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradientCurve" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 100 Q 80 40, 160 80 T 320 20 L 400 60 L 400 120 L 0 120 Z"
                    fill="url(#gradientCurve)"
                  />
                  <path
                    d="M 0 100 Q 80 40, 160 80 T 320 20 L 400 60"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span>Day 1</span>
                <span>Day 15</span>
                <span>Day 30</span>
              </div>
            </div>
          </div>

          {/* Recent Subscription Transactions Table matching Figma Screenshot 3 */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Subscription Transactions</h3>
              <button className="text-xs text-purple-400 hover:text-purple-300">
                View All Activity →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="pb-4 pl-2">User / Recruiter</th>
                    <th className="pb-4">Plan Type</th>
                    <th className="pb-4">Transaction ID</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4 text-right pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0">
                            {tx.company.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{tx.user}</span>
                            <span className="text-[11px] text-zinc-500">{tx.company}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-300">
                          {tx.plan}
                        </span>
                      </td>

                      <td className="py-4 font-mono text-zinc-500 text-[11px]">{tx.txId}</td>

                      <td className="py-4 font-bold text-white">{tx.amount}</td>

                      <td className="py-4 text-zinc-400">{tx.date}</td>

                      <td className="py-4 text-right pr-2">
                        <span className={`font-semibold text-xs ${getStatusBadge(tx.status)}`}>
                          • {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
