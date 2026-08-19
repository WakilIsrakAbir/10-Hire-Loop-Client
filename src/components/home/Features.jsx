"use client";

import React from "react";
import { motion } from "motion/react";

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Smart Search",
      description: "Find your ideal job with advanced filters.",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" strokeWidth={1.75} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 20l-3.5-3.5" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Salary Insights",
      description: "Get real salary data to negotiate confidently.",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 19h18M5 15l4.5-5 4 3.5 5.5-7" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Top Companies",
      description: "Apply to vetted companies that are hiring.",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 20h16M7 20V12h3v8M14 20V8h3v12" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Saved Jobs",
      description: "Manage apps & favorites on your dashboard.",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: "One-Click Apply",
      description: "Simplify your job applications for an easier process!",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 15l5 2-7.5 3-3-7.5 2 5 3.5-2.5zM12 3v3M3 12h3M18.36 5.64l-2.12 2.12M5.64 5.64l2.12 2.12" />
        </svg>
      ),
    },
    {
      id: 6,
      title: "Resume Builder",
      description: "Create professional resumes with modern templates.",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="5" y="3" width="14" height="18" rx="3" strokeWidth={1.75} />
          <circle cx="12" cy="8" r="2" strokeWidth={1.75} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 14h6M9 17h4" />
        </svg>
      ),
    },
    {
      id: 7,
      title: "Skill-Based Matching",
      description: "Discover jobs that match your skills and experience.",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3l7.5 4.3v8.7L12 20.3 4.5 16V7.3L12 3z" />
        </svg>
      ),
    },
    {
      id: 8,
      title: "Career Growth Resources",
      description: "Boost your career with quick interview tips.",
      icon: (
        <svg className="w-5 h-5 text-pink-400/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h5v5M18 7l-7 7-4-4-4 4" />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8">
      {/* Ambient background blur lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/12 to-[#EC4899]/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
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
            FEATURES JOB
          </span>
          <span className="w-1.5 h-1.5 rounded-sm bg-[#8B5CF6] inline-block" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.15]"
        >
          Everything you need
          <br />
          to succeed
        </motion.h2>
      </div>

      {/* 4-Column x 2-Row Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12 gap-x-6 sm:gap-x-8"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="group flex items-start gap-4 p-2 rounded-2xl transition-all duration-300"
          >
            {/* Square Glassmorphism Icon Box */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.3 }}
              className="shrink-0 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#141217]/90 border border-white/10 group-hover:border-pink-500/30 group-hover:bg-[#18151D] flex items-center justify-center shadow-xl shadow-black/40 transition-all duration-300"
            >
              {feature.icon}
            </motion.div>

            {/* Title & Description */}
            <div className="flex flex-col pt-0.5">
              <h3 className="text-base sm:text-[17px] font-semibold text-white tracking-tight mb-1 group-hover:text-pink-100 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
