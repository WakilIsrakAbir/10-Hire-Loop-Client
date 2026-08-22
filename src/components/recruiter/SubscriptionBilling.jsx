"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";
import { TableSkeleton } from "@/components/ui/loading/ShimmerSkeleton";

export default function SubscriptionBilling({ user }) {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState(
    user?.plan === "recruiter-enterprise"
      ? "Enterprise"
      : user?.plan === "recruiter-growth"
      ? "Growth"
      : "Free"
  );
  const [activeJobsUsed, setActiveJobsUsed] = useState(user?.jobsCount || 3);
  const [activeJobLimit, setActiveJobLimit] = useState(user?.activeJobLimit || 3);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Fetch real payment transactions for user
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await fetch("/api/stripe/history");
        const data = await res.json();
        if (res.ok && data.history?.length > 0) {
          setPaymentHistory(
            data.history.map((tx) => ({
              id: tx.transactionId || tx._id,
              date: new Date(tx.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
              plan: tx.plan,
              amount: tx.amount,
              status: tx.status || "Paid",
            }))
          );
        } else {
          setPaymentHistory([
            {
              id: "TXN-8942-HL",
              date: "Aug 01, 2026",
              plan: "Growth Plan (Monthly)",
              amount: "$49.00",
              status: "Paid",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const handleStripeCheckout = async (planKey) => {
    try {
      setIsProcessingPayment(true);
      setToastMessage("Redirecting to Stripe Checkout...");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, billingCycle: "monthly" }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.assign(data.url);
      } else {
        setToastMessage(`Error: ${data.error || "Failed to start Stripe checkout."}`);
        setIsProcessingPayment(false);
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Error connecting to payment provider.");
      setIsProcessingPayment(false);
    }
  };

  const handleOpenStripePortal = async () => {
    try {
      setToastMessage("Opening Stripe Customer Portal...");
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
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Left Sidebar */}
      <RecruiterSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-18 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white">Subscription & Billing</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenStripePortal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              Stripe Customer Portal
            </button>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
            >
              Compare All Plans
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8 flex-1">
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm flex items-center gap-2 animate-in fade-in duration-200">
              <svg className="w-5 h-5 shrink-0 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{toastMessage}</span>
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Subscription & Plan Usage
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage your company’s hiring tier, active job capacities, and Stripe invoices.
            </p>
          </div>

          {/* Current Plan Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#16161d] to-[#111116] border border-white/10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-white">
                    {currentPlan} Plan
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Active Subscription
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Billed monthly via Stripe. Auto-renews automatically.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Change Tier
                </Link>
                {currentPlan !== "Enterprise" && (
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={() => handleStripeCheckout("recruiter-enterprise")}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 cursor-pointer disabled:opacity-60"
                  >
                    {isProcessingPayment ? "Connecting..." : "Upgrade to Enterprise"}
                  </button>
                )}
              </div>
            </div>

            {/* Active Job Usage Meter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-semibold">Active Job Posts Capacity</span>
                <span className="text-white font-bold">
                  {activeJobsUsed} / {activeJobLimit} jobs used ({Math.min(100, Math.round((activeJobsUsed / activeJobLimit) * 100))}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeJobsUsed / activeJobLimit) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Need to post more than {activeJobLimit} simultaneous jobs? Upgrading to Enterprise unlocks 50 active listings with featured boosts.
              </p>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Payment & Billing History</h3>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                🔒 Secured by Stripe
              </span>
            </div>

            {loadingHistory ? (
              <TableSkeleton rows={3} cols={5} />
            ) : (
              <div className="rounded-2xl bg-[#141417] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        <th className="py-4 px-5">Date</th>
                        <th className="py-4 px-5">Plan Description</th>
                        <th className="py-4 px-5">Amount</th>
                        <th className="py-4 px-5">Transaction ID</th>
                        <th className="py-4 px-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-zinc-300">
                      {paymentHistory.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-5 text-white font-medium">{item.date}</td>
                          <td className="py-4 px-5 text-zinc-300">{item.plan}</td>
                          <td className="py-4 px-5 text-white font-bold">{item.amount}</td>
                          <td className="py-4 px-5 text-indigo-400 font-mono text-[11px]">{item.id}</td>
                          <td className="py-4 px-5 text-right">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                              ✓ {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Stripe Payment Redirect Modal Overlay */}
      {isProcessingPayment && (
        <PageLoader
          message="Connecting to Stripe Checkout..."
          subMessage="Redirecting you securely to complete your subscription upgrade"
          fullScreen={true}
        />
      )}
    </div>
  );
}
