"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id;

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Application form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    portfolio: "",
    resumeUrl: "",
    coverNote: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    async function fetchJobDetails() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Job not found or has been closed.");
          } else {
            setError("Failed to load job details.");
          }
          return;
        }

        const data = await res.json();
        if (data.job) {
          setJob(data.job);
          setRelatedJobs(data.relatedJobs || []);
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Network error loading job details.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [jobId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setAppliedSuccess(true);
    }, 900);
  };

  const scrollToApply = () => {
    const el = document.getElementById("apply-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-6 w-36 bg-white/10 rounded-lg" />
          <div className="p-8 rounded-3xl bg-[#141217]/60 border border-white/5 space-y-4">
            <div className="h-8 w-1/3 bg-white/10 rounded-xl" />
            <div className="h-4 w-1/4 bg-white/5 rounded-md" />
            <div className="flex gap-3 pt-4">
              <div className="h-8 w-24 bg-white/5 rounded-full" />
              <div className="h-8 w-24 bg-white/5 rounded-full" />
              <div className="h-8 w-28 bg-white/5 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-40 rounded-3xl bg-[#141217]/40 border border-white/5" />
              <div className="h-60 rounded-3xl bg-[#141217]/40 border border-white/5" />
            </div>
            <div className="h-80 rounded-3xl bg-[#141217]/40 border border-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#070709] text-white pt-36 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center max-w-md space-y-4 p-8 rounded-3xl bg-[#141217] border border-white/10">
          <div className="text-4xl">🔍</div>
          <h2 className="text-2xl font-bold text-white">Job Not Found</h2>
          <p className="text-slate-400 text-xs sm:text-sm">{error || "The job posting you are looking for does not exist."}</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg transition-all"
          >
            ← Back to Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const salaryDisplay =
    job.salaryFormatted ||
    (job.salaryMin && job.salaryMax
      ? `${job.currency || "$"}${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
      : "Competitive Compensation");

  const locationDisplay = job.location || "Remote";
  const workTypeDisplay = job.workType || job.jobType || (job.isRemote ? "Remote" : "Hybrid");

  // Responsibilities list (convert multiline or string)
  const responsibilities = job.responsibilities
    ? job.responsibilities.split("\n").filter((r) => r.trim())
    : [
        "Architect and implement modern, scalable web applications with clean design patterns.",
        "Collaborate closely with cross-functional product designers, managers, and engineers.",
        "Maintain high test coverage, code review standards, and continuous integration pipelines.",
        "Proactively identify technical debt and performance bottlenecks in existing systems.",
      ];

  // Requirements list
  const requirements = job.requirements
    ? job.requirements.split("\n").filter((r) => r.trim())
    : [
        "3+ years of professional software engineering and product shipping experience.",
        "Proficiency with modern JavaScript/TypeScript, React/Next.js, and modern CSS systems.",
        "Deep understanding of RESTful APIs, async state management, and database architectures.",
        "Strong communication skills and enthusiasm for fast-paced collaborative startup environments.",
      ];

  // Benefits list
  const benefits = job.benefits
    ? job.benefits.split("\n").filter((b) => b.trim())
    : [
        "Top-tier competitive salary and early equity options package",
        "Comprehensive health, dental, vision, and mental wellness coverage",
        "Flexible working model (Remote / Hybrid) with home-office equipment stipend",
        "Annual learning budget, conference sponsorships, and book allowances",
      ];

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-transparent blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4.5rem_100%] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-white transition-colors">
              Browse Jobs
            </Link>
            <span>/</span>
            <span className="text-purple-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {job.title}
            </span>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            ← Back to Jobs
          </Link>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative p-6 sm:p-8 rounded-3xl bg-[#141217]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Logo & Job Title Info */}
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Company Logo / Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-white/15 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shrink-0 overflow-hidden shadow-xl">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.companyName || "Company"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (job.companyName || "HL").slice(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
                    {job.companyName || "Innovative Tech"}
                  </span>
                  {job.category && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                      {job.category}
                    </span>
                  )}
                  {job.status === "Active" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Actively Hiring
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {job.title}
                </h1>

                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-xs">
                  {/* Location */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3" strokeWidth={2} />
                      <circle cx="12" cy="12" r="8" strokeWidth={1.5} />
                    </svg>
                    <span>{locationDisplay}</span>
                  </div>

                  {/* Work type */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{workTypeDisplay}</span>
                  </div>

                  {/* Salary */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.5 9a3.5 3.5 0 00-5 3.5 3.5 3.5 0 005 3.5M8 12h5" />
                    </svg>
                    <span>{salaryDisplay}</span>
                  </div>

                  {/* Applicants count */}
                  {job.applicantsCount !== undefined && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                      <span>👥 {job.applicantsCount} Applicants</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <button
                type="button"
                onClick={handleShare}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Share Job Link"
              >
                {copied ? "✓ Copied" : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                  saved
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                }`}
                title="Bookmark Job"
              >
                <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={scrollToApply}
                className="flex-1 md:flex-initial px-6 py-3 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-xs sm:text-sm transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Apply for this Role →
              </button>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Main Details Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141217]/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-sm bg-purple-500 inline-block" />
                Role Overview
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {job.description ||
                  "We are seeking a talented and passionate builder to join our core engineering team. In this role, you will be instrumental in architecting and delivering high-performance features that impact thousands of global users daily."}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141217]/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements & Qualifications */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141217]/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-sm bg-purple-500 inline-block" />
                Qualifications & Skills
              </h2>
              <ul className="space-y-3">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits & Perks */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141217]/70 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <span className="text-emerald-400 text-sm">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Application Box */}
            <div
              id="apply-section"
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181520] to-[#121017] border border-purple-500/30 shadow-2xl space-y-6"
            >
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  Quick Application
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                  Apply for {job.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Submit your details directly to the hiring team at {job.companyName || "the company"}.
                </p>
              </div>

              {appliedSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-white">Application Received!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you for applying. The recruiter will review your profile and get in touch with you via email.
                  </p>
                  <button
                    onClick={() => setAppliedSuccess(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Resume / CV Link *</label>
                      <input
                        type="url"
                        required
                        value={form.resumeUrl}
                        onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Portfolio / GitHub</label>
                      <input
                        type="url"
                        value={form.portfolio}
                        onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Why are you interested in this role?</label>
                    <textarea
                      rows={3}
                      value={form.coverNote}
                      onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
                      placeholder="Briefly highlight your relevant experience and enthusiasm..."
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Sending Application..." : "Submit My Application →"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar Column (1 Col) */}
          <div className="space-y-6">
            {/* Job Summary Card */}
            <div className="p-6 rounded-3xl bg-[#141217]/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Job Overview
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Department</span>
                  <span className="font-medium text-white">{job.department || job.category || "Engineering"}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Job Type</span>
                  <span className="font-medium text-white">{workTypeDisplay}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Location</span>
                  <span className="font-medium text-white">{locationDisplay}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Compensation</span>
                  <span className="font-medium text-purple-400">{salaryDisplay}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Posted On</span>
                  <span className="font-medium text-white">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Application Deadline</span>
                  <span className="font-medium text-white">
                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Open until filled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Profile Card */}
            <div className="p-6 rounded-3xl bg-[#141217]/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                About Company
              </h3>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-base shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                  ) : (
                    (job.companyName || "C").slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{job.companyName || "Tech Company"}</h4>
                  <p className="text-[11px] text-slate-400">{job.location || "San Francisco, CA"}</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/company"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  View Company Profile
                </Link>
              </div>
            </div>

            {/* Safe Hiring Tips */}
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <span>🛡️</span> Verified Hiring Protection
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                HireLoop directly connects verified hiring teams. Never send payments for interviews or equipment.
              </p>
            </div>
          </div>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <div className="pt-10 border-t border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Similar Positions</h3>
              <Link href="/jobs" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                View all jobs →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedJobs.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/jobs/${rel._id}`}
                  className="p-6 rounded-3xl bg-[#141217]/70 hover:bg-[#18151D] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                      {rel.companyName}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{rel.description}</p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{rel.location}</span>
                    <span className="text-white font-medium">View Role →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
