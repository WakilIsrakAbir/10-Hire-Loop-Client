"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";

const initialPaymentHistory = [
  {
    id: "TXN-8942",
    date: "Aug 01, 2023",
    plan: "Growth Plan (Monthly)",
    amount: "$79.00",
    status: "Paid",
    invoiceUrl: "#",
  },
  {
    id: "TXN-7621",
    date: "Jul 01, 2023",
    plan: "Growth Plan (Monthly)",
    amount: "$79.00",
    status: "Paid",
    invoiceUrl: "#",
  },
  {
    id: "TXN-6310",
    date: "Jun 01, 2023",
    plan: "Starter Plan",
    amount: "$29.00",
    status: "Paid",
    invoiceUrl: "#",
  },
];

export default function SubscriptionBilling({ user }) {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState("Growth");
  const [activeJobsUsed, setActiveJobsUsed] = useState(7);
  const [activeJobLimit, setActiveJobLimit] = useState(10);
  const [paymentHistory, setPaymentHistory] = useState(initialPaymentHistory);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState("Enterprise");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [cardForm, setCardForm] = useState({
    cardNumber: "**** **** **** 4242",
    expDate: "12/26",
    cvc: "888",
    nameOnCard: user?.name || "Alex Sterling",
  });

  const handleOpenUpgrade = (planName) => {
    setSelectedUpgradePlan(planName);
    setIsStripeModalOpen(true);
  };

  const handleConfirmStripePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsStripeModalOpen(false);

      if (selectedUpgradePlan === "Enterprise") {
        setCurrentPlan("Enterprise");
        setActiveJobLimit(50);
      } else if (selectedUpgradePlan === "Growth") {
        setCurrentPlan("Growth");
        setActiveJobLimit(10);
      }

      // Add to payment history
      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: "Just now",
        plan: `${selectedUpgradePlan} Plan`,
        amount: selectedUpgradePlan === "Enterprise" ? "$199.00" : "$79.00",
        status: "Paid",
        invoiceUrl: "#",
      };
      setPaymentHistory((prev) => [newTxn, ...prev]);

      setToastMessage(`Payment successful via Stripe! Upgraded to ${selectedUpgradePlan} plan (50 Active Jobs limit activated).`);
      setTimeout(() => setToastMessage(""), 5000);
    }, 1200);
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

          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Compare All Plans
          </Link>
        </header>

        <main className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8 flex-1">
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in duration-200">
              <svg className="w-5 h-5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  Billed monthly. Auto-renews on Sep 01, 2023.
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
                    onClick={() => handleOpenUpgrade("Enterprise")}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 cursor-pointer"
                  >
                    Upgrade to Enterprise
                  </button>
                )}
              </div>
            </div>

            {/* Active Job Usage Meter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-semibold">Active Job Posts Capacity</span>
                <span className="text-white font-bold">
                  {activeJobsUsed} / {activeJobLimit} jobs used ({Math.round((activeJobsUsed / activeJobLimit) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${(activeJobsUsed / activeJobLimit) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Need to post more than {activeJobLimit} simultaneous jobs? Upgrading to Enterprise unlocks 50 active listings.
              </p>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Payment & Billing History</h3>
              <span className="text-xs text-zinc-500">Powered by Stripe Secure</span>
            </div>

            <div className="rounded-2xl bg-[#141417] border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="py-4 px-5">Date</th>
                      <th className="py-4 px-5">Plan Description</th>
                      <th className="py-4 px-5">Amount</th>
                      <th className="py-4 px-5">Transaction ID</th>
                      <th className="py-4 px-5 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-zinc-300">
                    {paymentHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-5 text-white font-medium">{item.date}</td>
                        <td className="py-4 px-5 text-zinc-300">{item.plan}</td>
                        <td className="py-4 px-5 text-white font-bold">{item.amount}</td>
                        <td className="py-4 px-5 text-indigo-400 font-mono text-[11px]">{item.id}</td>
                        <td className="py-4 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => alert(`Downloading Invoice for ${item.id}`)}
                            className="text-xs text-zinc-400 hover:text-white transition-colors underline cursor-pointer"
                          >
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Stripe Payment Modal */}
      {isStripeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-white/10 p-6 sm:p-8 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Upgrade via Stripe</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Plan: <span className="text-white font-semibold">{selectedUpgradePlan} ($199/month)</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsStripeModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmStripePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardForm.cardNumber}
                  onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    value={cardForm.expDate}
                    onChange={(e) => setCardForm({ ...cardForm, expDate: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    CVC
                  </label>
                  <input
                    type="password"
                    required
                    value={cardForm.cvc}
                    onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                    placeholder="123"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Name on Card
                </label>
                <input
                  type="text"
                  required
                  value={cardForm.nameOnCard}
                  onChange={(e) => setCardForm({ ...cardForm, nameOnCard: e.target.value })}
                  placeholder="Cardholder Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStripeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessingPayment ? "Processing..." : "Pay $199 & Upgrade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
