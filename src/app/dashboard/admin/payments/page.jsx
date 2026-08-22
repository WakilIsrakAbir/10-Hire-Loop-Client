"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [toastMessage, setToastMessage] = useState("");

  const transactions = [
    {
      email: "jordan.daniels@enterprise.co",
      plan: "Enterprise",
      amount: "$4,500.00",
      date: "May 19, 2026",
      relDate: "Just now",
      txId: "TXN-882910443",
      status: "SUCCESS",
    },
    {
      email: "sarah.k@techflow.io",
      plan: "Pro",
      amount: "$299.00",
      date: "May 18, 2026",
      relDate: "1 day ago",
      txId: "TXN-773410291",
      status: "SUCCESS",
    },
    {
      email: "marcus.lee@gmail.com",
      plan: "Starter",
      amount: "$49.00",
      date: "May 17, 2026",
      relDate: "2 days ago",
      txId: "TXN-110294857",
      status: "PENDING",
    },
    {
      email: "e.lopez@globalfoundries.com",
      plan: "Enterprise",
      amount: "$12,000.00",
      date: "May 10, 2026",
      relDate: "9 days ago",
      txId: "TXN-080485712",
      status: "FAILED",
    },
  ];

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["User Email,Plan,Amount,Date,Transaction ID,Status"]
        .concat(
          transactions.map(
            (t) =>
              `"${t.email}","${t.plan}","${t.amount}","${t.date}","${t.txId}","${t.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "HireLoop_Payments_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Payments exported to CSV successfully!");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "PENDING":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "FAILED":
      default:
        return "bg-rose-500/10 border-rose-500/30 text-rose-400";
    }
  };

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Payments & Revenue..."
        subMessage="Calculating platform subscriptions and transaction records"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content matching Figma Screenshot 2 */}
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
              placeholder="Search transactions, users, or IDs..."
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

          {/* Title Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Payments & Subscriptions</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Comprehensive overview of platform revenue and active subscriptions.
            </p>
          </div>

          {/* 4 Top Summary Metric Cards matching Figma Screenshot 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Total Revenue */}
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Total Revenue</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +12.4%
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">$1,284,500</h3>
            </div>

            {/* 2. Monthly Revenue */}
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Monthly Revenue</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +8.1%
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">$94,210</h3>
            </div>

            {/* 3. Active Pro Users */}
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Active Pro Users</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +2.3%
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">12,408</h3>
            </div>

            {/* 4. Active Enterprise Users */}
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Active Enterprise Users</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +15.7%
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">842</h3>
            </div>
          </div>

          {/* Recent Transactions Table Card matching Figma Screenshot 2 */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Recent Transactions</h3>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>≡</span>
                  <span>Filter</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="pb-4 pl-2">User Email</th>
                    <th className="pb-4">Plan</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Transaction ID</th>
                    <th className="pb-4 text-right pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px] text-zinc-300">
                            {tx.email.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{tx.email}</span>
                        </div>
                      </td>

                      <td className="py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-300">
                          {tx.plan}
                        </span>
                      </td>

                      <td className="py-4 font-bold text-white text-sm">{tx.amount}</td>

                      <td className="py-4 text-zinc-400">
                        {tx.date} <span className="text-[11px] text-zinc-500">• {tx.relDate}</span>
                      </td>

                      <td className="py-4 font-mono text-zinc-500 text-[11px]">{tx.txId}</td>

                      <td className="py-4 text-right pr-2">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadge(tx.status)}`}>
                          • {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Showing 1 to 4 of 24,510 transactions</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">‹</button>
                <button className="w-7 h-7 rounded-lg bg-white text-black font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">3</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">›</button>
              </div>
            </div>
          </div>

          {/* Bottom 2 Insights Grid matching Figma Screenshot 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Revenue Trend (Last 7 Days) */}
            <div className="lg:col-span-8 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">Revenue Trend (Last 7 Days)</h3>
                <span className="text-xs text-zinc-500">USD ($)</span>
              </div>

              {/* 7 Days Bar Chart */}
              <div className="h-44 flex items-end justify-between gap-4 pt-4 px-4">
                {[
                  { day: "MON", height: "45%", val: "$12.4k" },
                  { day: "TUE", height: "60%", val: "$18.2k" },
                  { day: "WED", height: "80%", val: "$24.1k" },
                  { day: "THU", height: "70%", val: "$21.5k" },
                  { day: "FRI", height: "95%", val: "$29.8k" },
                  { day: "SAT", height: "50%", val: "$15.6k" },
                  { day: "SUN", height: "65%", val: "$19.3k" },
                ].map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      {d.val}
                    </span>
                    <div
                      className="w-full rounded-t-xl bg-zinc-700 hover:bg-purple-500 transition-all cursor-pointer"
                      style={{ height: d.height }}
                    />
                    <span className="text-[10px] text-zinc-400 font-semibold">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Plan Distribution */}
            <div className="lg:col-span-4 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Plan Distribution</h3>

                <div className="space-y-4 pt-4 text-xs">
                  {/* Enterprise */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-zinc-400 font-medium">
                      <span>Enterprise</span>
                      <span className="text-white font-bold">35%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-white" style={{ width: "35%" }} />
                    </div>
                  </div>

                  {/* Professional */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-zinc-400 font-medium">
                      <span>Professional</span>
                      <span className="text-white font-bold">52%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: "52%" }} />
                    </div>
                  </div>

                  {/* Starter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-zinc-400 font-medium">
                      <span>Starter</span>
                      <span className="text-white font-bold">13%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-zinc-500" style={{ width: "13%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => alert("Detailed plan breakdown report generated.")}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  View detailed report →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
