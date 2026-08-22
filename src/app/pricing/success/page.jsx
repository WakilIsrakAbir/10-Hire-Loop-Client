"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";
  const cycle = searchParams.get("cycle") || "monthly";
  const tx = searchParams.get("tx") || searchParams.get("session_id") || "TXN-VERIFIED-HL";

  const isRecruiter = plan.startsWith("recruiter");
  const isEnterprise = plan === "recruiter-enterprise";
  const isPremium = plan === "premium";

  const planTitle = isEnterprise
    ? "Recruiter Enterprise Tier"
    : isRecruiter
    ? "Recruiter Growth Tier"
    : isPremium
    ? "Premium Unlimited Tier"
    : "Professional Tier";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#141217]/90 backdrop-blur-2xl border border-white/10 shadow-2xl text-center space-y-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20">
        ⚡
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold tracking-widest uppercase">
          STRIPE PAYMENT VERIFIED
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome to {planTitle}!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {isRecruiter
            ? `Your recruiter tier is now live (${cycle === "yearly" ? "Billed Annually" : "Billed Monthly"}). Increased active job capacities and pipeline features have been unlocked.`
            : `Your candidate tier is active (${cycle === "yearly" ? "Billed Annually" : "Billed Monthly"}). Unlimited applications and priority verified candidate badge unlocked.`}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5 text-left text-xs">
        <div className="flex items-center justify-between text-zinc-300">
          <span>Active Plan:</span>
          <span className="font-bold text-white">{planTitle}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-300">
          <span>{isRecruiter ? "Active Job Post Limit:" : "Application Capacity:"}</span>
          <span className="font-bold text-emerald-400">
            {isEnterprise ? "50 Live Jobs" : isRecruiter ? "10 Live Jobs" : "UNLIMITED"}
          </span>
        </div>
        <div className="flex items-center justify-between text-zinc-300">
          <span>Transaction Ref:</span>
          <span className="font-mono text-[11px] text-indigo-400 truncate max-w-[170px]">{tx}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-300">
          <span>Status:</span>
          <span className="font-bold text-emerald-400">PAID & ACTIVE</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href={isRecruiter ? "/dashboard/recruiter" : "/dashboard/seeker"}
          className="block w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-all text-center"
        >
          Go to {isRecruiter ? "Recruiter" : "Seeker"} Dashboard →
        </Link>

        <Link
          href={isRecruiter ? "/dashboard/recruiter/jobs/new" : "/jobs"}
          className="block w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition-colors text-center"
        >
          {isRecruiter ? "+ Post a New Job Opening" : "Explore Openings & Apply"}
        </Link>
      </div>
    </motion.div>
  );
}

export default function PricingSuccessPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-transparent blur-[160px] rounded-full pointer-events-none -z-10" />

      <Suspense
        fallback={
          <div className="animate-pulse text-zinc-400 text-sm">
            Verifying subscription confirmation...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
