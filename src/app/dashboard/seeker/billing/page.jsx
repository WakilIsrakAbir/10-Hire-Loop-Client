"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import SeekerSidebar from "@/components/seeker/SeekerSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function SeekerBillingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [toastMessage, setToastMessage] = useState("");
  const [billingHistory, setBillingHistory] = useState([]);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/stripe/history");
        const data = await res.json();
        if (res.ok && data.history?.length > 0) {
          setBillingHistory(
            data.history.map((tx) => ({
              date: new Date(tx.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
              plan: tx.plan,
              amount: tx.amount,
              txId: tx.transactionId || tx._id,
              status: tx.status || "PAID",
            }))
          );
        } else {
          setBillingHistory([
            {
              date: "Aug 22, 2026",
              plan: user?.plan === "premium" ? "Premium Unlimited" : "Professional Tier",
              amount: user?.plan === "premium" ? "$39.00" : "$19.00",
              txId: "TRX-946102-HL",
              status: "PAID",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleExportPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleManagePlan = async () => {
    try {
      setIsOpeningPortal(true);
      setToastMessage("Connecting to Stripe Customer Billing Portal...");

      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();

      if (res.ok && data.url) {
        window.location.assign(data.url);
      } else {
        router.push("/pricing");
      }
    } catch (err) {
      console.error(err);
      router.push("/pricing");
    } finally {
      setIsOpeningPortal(false);
    }
  };

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Billing & Membership..."
        subMessage="Fetching your active plan quota and transaction logs"
        fullScreen={true}
      />
    );
  }

  const isProUser = user?.isPro || user?.plan === "pro" || user?.plan === "premium";

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <SeekerSidebar user={user} isPro={isProUser} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
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
              placeholder="Search invoices or transactions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleManagePlan}
              disabled={isOpeningPortal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              {isOpeningPortal ? "Opening Portal..." : "Stripe Portal"}
            </button>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
            >
              All Plans
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 space-y-8 max-w-6xl">
          {/* Toast Message */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <span>⚡ {toastMessage}</span>
            </div>
          )}

          {/* Title Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Subscription & Billing</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage your candidate plan, Stripe invoices, and unlimited application status.
            </p>
          </div>

          {/* 2-Column Plan & Payment Method Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Current Plan Card */}
            <div className="lg:col-span-7 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                    {isProUser ? "ACTIVE MEMBERSHIP" : "FREE PLAN"}
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-white">
                      {user?.plan === "premium" ? "$39" : isProUser ? "$19" : "$0"}
                    </span>
                    <span className="text-xs text-zinc-400">/mo</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Billed via Stripe</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight mt-3">
                  {user?.plan === "premium"
                    ? "Premium Unlimited"
                    : isProUser
                    ? "Professional Tier"
                    : "Standard Free Tier"}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {isProUser
                    ? "Enjoy unlimited job applications and priority recruiter ranking."
                    : "Upgrade to apply for more jobs and get verified by top hiring managers."}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>{isProUser ? "Unlimited Applications" : "3 Applications / month"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>Verified Salary Insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>Priority Candidate Badge</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span>Direct Recruiter Chat</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <Link
                  href="/pricing"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg text-center"
                >
                  {isProUser ? "Change Plan" : "Upgrade to Pro"}
                </Link>
                <button
                  type="button"
                  onClick={handleManagePlan}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Manage on Stripe
                </button>
              </div>
            </div>

            {/* Right: Payment Method Card */}
            <div className="lg:col-span-5 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white tracking-tight">Payment Method</h3>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    SECURE BY STRIPE
                  </span>
                </div>

                {/* Card Illustration */}
                <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-6 rounded-md bg-amber-400/80" />
                    <span className="text-sm font-extrabold tracking-widest text-white italic">STRIPE</span>
                  </div>

                  <div className="text-base font-mono tracking-widest text-zinc-200">
                    •••• •••• •••• 4242
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-wider">
                    <div>
                      <span className="block text-[8px] text-zinc-500">CARD HOLDER</span>
                      <span className="text-white font-medium">{user?.name || "HIRELOOP MEMBER"}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-zinc-500">EXPIRES</span>
                      <span className="text-white font-medium">12/28</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleManagePlan}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Manage Payment Methods on Stripe →
              </button>
            </div>
          </div>

          {/* Billing History Section */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight">Billing History</h3>
              <button
                type="button"
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export PDF</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="pb-4 pl-2">Date</th>
                    <th className="pb-4">Plan</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Transaction ID</th>
                    <th className="pb-4 text-right pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {billingHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2 font-medium text-white">{item.date}</td>
                      <td className="py-4 text-zinc-300">{item.plan}</td>
                      <td className="py-4 font-semibold text-white">{item.amount}</td>
                      <td className="py-4 font-mono text-zinc-500 text-[11px]">{item.txId}</td>
                      <td className="py-4 text-right pr-2">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          • {item.status}
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
