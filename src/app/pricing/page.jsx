"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSession } from "@/lib/auth-client";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [roleTab, setRoleTab] = useState("seekers"); // "seekers" | "recruiters"
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "yearly"
  const [upgrading, setUpgrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const handleCheckout = async (planKey) => {
    if (!user) {
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }

    try {
      setUpgrading(true);
      setErrorMessage("");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, billingCycle }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.assign(data.url);
      } else {
        setErrorMessage(data.error || "Failed to initiate Stripe checkout.");
        setUpgrading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error initiating payment session.");
      setUpgrading(false);
    }
  };

  const seekerPlans = [
    {
      id: "free",
      name: "Free",
      badge: "Free Forever",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Essential tools for active job seekers starting their career exploration.",
      features: [
        "Apply to up to 3 jobs per month",
        "Browse & save up to 10 jobs",
        "Basic candidate profile",
        "Standard email alerts",
        "Community support",
      ],
      isPopular: false,
      ctaText: user ? "Current Free Plan" : "Get Started Free",
      ctaAction: () => {
        if (user) router.push("/dashboard/seeker");
        else router.push("/register");
      },
    },
    {
      id: "pro",
      name: "Pro",
      badge: "MOST POPULAR",
      monthlyPrice: 19,
      yearlyPrice: 14,
      description: "Everything you need to accelerate your search and land top-tier offers fast.",
      features: [
        "Apply to up to 30 jobs per month",
        "Unlimited saved jobs",
        "Application status tracking",
        "Verified salary band insights",
        "Priority candidate queue",
      ],
      isPopular: true,
      ctaText: "⚡ Upgrade to Pro",
      ctaAction: () => handleCheckout("pro"),
    },
    {
      id: "premium",
      name: "Premium",
      badge: "Unlimited Access",
      monthlyPrice: 39,
      yearlyPrice: 29,
      description: "Maximum visibility and unlimited career potential with AI-enhanced discovery.",
      features: [
        "⚡ Unlimited job applications",
        "🏅 Profile boost to recruiters",
        "🚀 Early access to new job posts",
        "💬 Direct recruiter messaging",
        "⭐️ Dedicated priority support",
      ],
      isPopular: false,
      ctaText: "Get Premium Unlimited",
      ctaAction: () => handleCheckout("premium"),
    },
  ];

  const recruiterPlans = [
    {
      id: "recruiter-free",
      name: "Free",
      badge: "Standard Listing",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Great for a company's first year of hiring and small teams.",
      features: [
        "Up to 3 active job posts",
        "Basic applicant management",
        "Standard listing visibility",
        "Company profile page",
        "Email notifications",
      ],
      isPopular: false,
      ctaText: user?.role === "recruiter" ? "Current Recruiter Tier" : "Start Hiring Free",
      ctaAction: () => {
        if (user?.role === "recruiter") router.push("/dashboard/recruiter/jobs/new");
        else router.push("/register?role=recruiter");
      },
    },
    {
      id: "recruiter-growth",
      name: "Growth",
      badge: "FOR GROWING TEAMS",
      monthlyPrice: 49,
      yearlyPrice: 37,
      description: "Scale your talent pipeline with more posts and applicant tracking.",
      features: [
        "Up to 10 active job posts",
        "Full applicant tracking system (ATS)",
        "Basic performance analytics",
        "Featured company tag",
        "Standard email support",
      ],
      isPopular: true,
      ctaText: "Upgrade to Growth",
      ctaAction: () => handleCheckout("recruiter-growth"),
    },
    {
      id: "recruiter-enterprise",
      name: "Enterprise",
      badge: "Full Hiring Suite",
      monthlyPrice: 149,
      yearlyPrice: 112,
      description: "High-volume recruitment for established organizations and scaling startups.",
      features: [
        "Up to 50 active job posts",
        "Advanced analytics dashboard",
        "Featured job listings boost",
        "Team collaboration & permissions",
        "Custom company branding",
        "Dedicated priority support",
      ],
      isPopular: false,
      ctaText: "Upgrade to Enterprise",
      ctaAction: () => handleCheckout("recruiter-enterprise"),
    },
  ];

  const currentPlans = roleTab === "seekers" ? seekerPlans : recruiterPlans;

  const faqs = [
    {
      q: "How does the Free plan application quota work for Job Seekers?",
      a: "Job seekers on the Free plan can submit up to 3 applications per month. Upgrading to Pro unlocks 30 applications/month, and Premium provides unlimited applications.",
    },
    {
      q: "How does the active job post limit work for Recruiters?",
      a: "Recruiter plans determine the number of live, active jobs you can post at any given time (3 on Free, 10 on Growth, 50 on Enterprise). Once you close a job, a slot opens up immediately.",
    },
    {
      q: "Can I cancel or switch my plan at any time?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your dashboard billing settings. All plans support prorated billing and a 14-day money-back guarantee.",
    },
    {
      q: "How are payments handled securely?",
      a: "All transactions are encrypted and processed through Stripe. We do not store your credit card information on our servers.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/15 to-transparent blur-[180px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px)] bg-[size:4.5rem_100%] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            TRANSPARENT PLANS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Simple, flexible pricing for everyone.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Choose the plan tailored for your hiring or job search needs. Upgrade, downgrade, or cancel at any time.
          </p>

          {/* Role Toggle: For Job Seekers vs For Recruiters */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-1 rounded-2xl bg-[#141217] border border-white/10 flex items-center shadow-xl">
              <button
                type="button"
                onClick={() => setRoleTab("seekers")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleTab === "seekers"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                👤 For Job Seekers
              </button>
              <button
                type="button"
                onClick={() => setRoleTab("recruiters")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleTab === "recruiters"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                🏢 For Recruiters
              </button>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="p-1 rounded-2xl bg-[#141217] border border-white/10 flex items-center shadow-xl">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {currentPlans.map((plan) => {
            const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 shadow-2xl ${
                  plan.isPopular
                    ? "bg-gradient-to-b from-[#1b1528] to-[#120f1b] border-2 border-purple-500/60 ring-4 ring-purple-500/15"
                    : "bg-[#141217]/85 border border-white/10 hover:border-white/20"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg shadow-purple-500/30">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        ${price}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        / {billingCycle === "yearly" ? "month, billed yearly" : "month"}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">
                      Included features:
                    </span>
                    <ul className="space-y-2.5 text-xs text-zinc-300">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                            ✓
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-8">
                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={plan.ctaAction}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer disabled:opacity-50 ${
                      plan.isPopular
                        ? "bg-white hover:bg-zinc-200 text-black shadow-purple-500/20"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    }`}
                  >
                    {plan.id === "pro" && upgrading ? "Processing Upgrade..." : plan.ctaText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-zinc-400">Everything you need to know about plans, limits, and billing.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="p-5 rounded-2xl bg-[#141217]/80 border border-white/5 hover:border-white/10 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                  <span>{faq.q}</span>
                  <span className="text-purple-400 text-base">{activeFaq === idx ? "−" : "+"}</span>
                </div>
                {activeFaq === idx && (
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
