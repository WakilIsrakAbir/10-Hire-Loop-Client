"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "@/lib/auth-client";

export default function Pricing() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "yearly"
  const [upgrading, setUpgrading] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: (
        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3l4 9 3-6 3 6 4-9v16a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
        </svg>
      ),
      monthlyPrice: 0,
      yearlyPrice: 0,
      subheading: "Start building your insights hub:",
      features: [
        "Daily AI match brief (top 5)",
        "Verified salary bands",
        "Company insight dashboards",
        "1-click apply, unlimited",
      ],
      isPopular: false,
      buttonStyle: "secondary",
    },
    {
      id: "growth",
      name: "Growth",
      icon: (
        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      monthlyPrice: 17,
      yearlyPrice: 13,
      subheading: "Start building your insights hub:",
      features: [
        "Daily AI match brief (top 5)",
        "Verified salary bands",
        "Company insight dashboards",
        "1-click apply, unlimited",
      ],
      isPopular: true,
      buttonStyle: "primary",
    },
    {
      id: "premium",
      name: "Premium",
      icon: (
        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      monthlyPrice: 99,
      yearlyPrice: 74,
      subheading: "Start building your insights hub:",
      features: [
        "Everything in Pro",
        "Multi-profile career portfolios",
        "Shared talent rooms",
        "Recruiter view (read-only)",
      ],
      isPopular: false,
      buttonStyle: "secondary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="pricing" className="relative w-full max-w-7xl mx-auto pt-14 sm:pt-20 pb-4 sm:pb-8 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/15 via-[#EC4899]/10 to-[#5B60F6]/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        {/* Tag / Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-sm bg-[#8B5CF6] inline-block" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
            PRICING
          </span>
          <span className="w-1.5 h-1.5 rounded-sm bg-[#8B5CF6] inline-block" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.15] mb-8"
        >
          Pay for the leverage,
          <br />
          not the listings
        </motion.h2>

        {/* Monthly / Yearly Switcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center p-1 rounded-full bg-[#141217] border border-white/10 shadow-lg"
        >
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`relative px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-white text-[#0A0A0C] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
              billingCycle === "yearly"
                ? "bg-white text-[#0A0A0C] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Yearly</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#D946EF] text-white text-[10px] font-bold tracking-tight">
              25%
            </span>
          </button>
        </motion.div>
      </div>

      {/* Pricing Cards (3 Columns) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
      >
        {plans.map((plan) => {
          const currentPrice =
            billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

          return (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl backdrop-blur-xl transition-all duration-300 shadow-2xl overflow-hidden ${
                plan.isPopular
                  ? "bg-[#16141D]/90 border border-white/20 shadow-indigo-500/5 ring-1 ring-white/10"
                  : "bg-[#141217]/75 hover:bg-[#18151D]/90 border border-white/10 hover:border-white/20"
              }`}
            >
              {/* Inner ambient glow */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  plan.isPopular
                    ? "bg-gradient-to-b from-purple-500/[0.08] via-transparent to-indigo-500/[0.05] opacity-100"
                    : "bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 hover:opacity-100"
                }`}
              />

              <div>
                {/* Header: Icon, Plan Name & Price */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1D1A24] border border-white/10 flex items-center justify-center shrink-0">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      ${currentPrice}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 font-medium">
                      /month
                    </span>
                  </div>
                </div>

                {/* Subheading */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium mb-4">
                  {plan.subheading}
                </p>

                {/* Feature List with '+' bullets */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400 font-normal"
                    >
                      <div className="shrink-0 w-4 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center mt-0.5 text-slate-400 text-xs font-semibold">
                        +
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={upgrading}
                  onClick={async () => {
                    if (!user) {
                      if (plan.id === "starter") {
                        router.push("/register");
                      } else {
                        router.push("/login?callbackUrl=/pricing");
                      }
                      return;
                    }

                    if (plan.id === "starter") {
                      router.push("/dashboard/seeker");
                    } else if (plan.id === "growth") {
                      try {
                        setUpgrading(true);
                        const res = await fetch("/api/stripe/upgrade", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ plan: "pro", billingCycle }),
                        });
                        const data = await res.json();
                        if (res.ok && data.success) {
                          router.push("/pricing/success");
                        } else {
                          router.push("/pricing");
                        }
                      } catch {
                        router.push("/pricing");
                      } finally {
                        setUpgrading(false);
                      }
                    } else {
                      router.push("/pricing");
                    }
                  }}
                  className={`group w-full py-3.5 px-5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50 ${
                    plan.buttonStyle === "primary"
                      ? "bg-white text-[#0A0A0C] hover:bg-slate-200 active:scale-[0.99]"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-[0.99]"
                  }`}
                >
                  <span>
                    {upgrading && plan.id === "growth"
                      ? "Processing Upgrade..."
                      : user && plan.id === "starter"
                      ? "Go to Dashboard"
                      : "Choose This Plan"}
                  </span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
