"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";

export default function JobDiscovery() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs?limit=6");
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && data.jobs.length > 0) {
            setJobs(data.jobs);
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs for discovery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
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
    <section className="relative w-full max-w-7xl mx-auto pt-10 sm:pt-14 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/15 to-[#5B60F6]/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        {/* Badge / Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-sm bg-[#8B5CF6] inline-block" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
            SMART JOB DISCOVERY
          </span>
          <span className="w-1.5 h-1.5 rounded-sm bg-[#8B5CF6] inline-block" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.15]"
        >
          The roles you&apos;d never
          <br />
          find by searching
        </motion.h2>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-7 rounded-3xl bg-[#141217]/50 border border-white/5 animate-pulse min-h-[260px] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
                <div className="h-4 w-full bg-white/5 rounded-md" />
                <div className="h-4 w-2/3 bg-white/5 rounded-md" />
              </div>
              <div className="flex gap-2 pt-6">
                <div className="h-7 w-20 bg-white/5 rounded-full" />
                <div className="h-7 w-16 bg-white/5 rounded-full" />
                <div className="h-7 w-24 bg-white/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {jobs.map((job, idx) => {
            const displayLocation = job.location || "Remote";
            const displayType = job.workType || job.jobType || (job.isRemote ? "Remote" : "Hybrid");
            const displaySalary = job.salaryFormatted || (job.salaryMin && job.salaryMax ? `${job.currency || "$"}${job.salaryMin} - ${job.salaryMax}` : "€25–€40/hour");
            const displayDesc = job.description || "Showcase your commitment to diversity and inclusion by highlighting initiatives";

            return (
              <motion.div
                key={job._id || job.id || idx}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#141217]/70 hover:bg-[#18151D]/90 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl overflow-hidden"
              >
                {/* Ambient inner glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.06] via-transparent to-indigo-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Job Title */}
                  <Link href={`/jobs/${job._id || job.id}`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2.5 hover:text-purple-300 transition-colors cursor-pointer">
                      {job.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-normal line-clamp-2">
                    {displayDesc}
                  </p>

                  {/* Meta Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    {/* Location */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-medium">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" strokeWidth={2} />
                        <circle cx="12" cy="12" r="8" strokeWidth={1.5} />
                      </svg>
                      <span>{displayLocation}</span>
                    </div>

                    {/* Work Type */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-medium">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{displayType}</span>
                    </div>

                    {/* Salary */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-medium">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.5 9a3.5 3.5 0 00-5 3.5 3.5 3.5 0 005 3.5M8 12h5" />
                      </svg>
                      <span>{displaySalary}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Link: Apply Now / Details */}
                <div className="pt-2">
                  <Link
                    href={`/jobs/${job._id || job.id}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    <span>View Role & Apply</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Bottom Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 sm:mt-10 text-center"
      >
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-[#0A0A0C] font-semibold text-sm hover:bg-slate-200 transition-all duration-200 shadow-xl shadow-white/5 hover:scale-105 active:scale-95"
        >
          View all job open
        </Link>
      </motion.div>
    </section>
  );
}
