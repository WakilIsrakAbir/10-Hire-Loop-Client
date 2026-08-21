"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorkType, setSelectedWorkType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedMinSalary, setSelectedMinSalary] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Apply Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    portfolioUrl: "",
    resumeUrl: "",
    coverNote: "",
  });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const categories = [
    "All",
    "Engineering",
    "AI & ML",
    "Design",
    "Marketing",
    "Security",
    "DevOps",
  ];

  const workTypes = ["All", "Remote", "Hybrid", "Full-time", "Onsite"];

  const locations = [
    "All",
    "San Francisco",
    "New York",
    "London",
    "Berlin",
    "Seattle",
    "Austin",
    "Remote",
  ];

  const salaryOptions = [
    { label: "All Salaries", value: "All" },
    { label: "$100k+ / year", value: "100000" },
    { label: "$130k+ / year", value: "130000" },
    { label: "$150k+ / year", value: "150000" },
    { label: "$180k+ / year", value: "180000" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Highest Salary", value: "salary-high" },
    { label: "Most Popular", value: "popular" },
  ];

  // Fetch Jobs whenever filters change
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        let url = "/api/jobs";
        const params = new URLSearchParams();

        if (selectedCategory !== "All") params.append("category", selectedCategory);
        if (selectedWorkType !== "All") params.append("jobType", selectedWorkType);
        if (selectedLocation !== "All") params.append("location", selectedLocation);
        if (selectedMinSalary !== "All") params.append("minSalary", selectedMinSalary);
        if (sortBy) params.append("sortBy", sortBy);
        if (searchTerm.trim()) params.append("search", searchTerm.trim());

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchJobs();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedWorkType, selectedLocation, selectedMinSalary, sortBy]);

  // Active filters count
  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedCategory !== "All") {
      filters.push({
        id: "category",
        label: `Category: ${selectedCategory}`,
        clear: () => setSelectedCategory("All"),
      });
    }
    if (selectedWorkType !== "All") {
      filters.push({
        id: "workType",
        label: `Type: ${selectedWorkType}`,
        clear: () => setSelectedWorkType("All"),
      });
    }
    if (selectedLocation !== "All") {
      filters.push({
        id: "location",
        label: `Location: ${selectedLocation}`,
        clear: () => setSelectedLocation("All"),
      });
    }
    if (selectedMinSalary !== "All") {
      const match = salaryOptions.find((s) => s.value === selectedMinSalary);
      filters.push({
        id: "salary",
        label: `Salary: ${match?.label || selectedMinSalary}`,
        clear: () => setSelectedMinSalary("All"),
      });
    }
    if (searchTerm.trim()) {
      filters.push({
        id: "search",
        label: `Search: "${searchTerm}"`,
        clear: () => setSearchTerm(""),
      });
    }
    return filters;
  }, [selectedCategory, selectedWorkType, selectedLocation, selectedMinSalary, searchTerm]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedWorkType("All");
    setSelectedLocation("All");
    setSelectedMinSalary("All");
    setSortBy("newest");
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySubmitting(true);
    setTimeout(() => {
      setApplySubmitting(false);
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedJobForApply(null);
        setApplyForm({
          name: "",
          email: "",
          portfolioUrl: "",
          resumeUrl: "",
          coverNote: "",
        });
      }, 2000);
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4.5rem_100%] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-purple-300">
            <span>✨</span> Explore Open Positions
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Find Your Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
              Opportunity
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Discover roles that match your passion at fast-growing tech companies and AI-first startups.
          </p>
        </div>

        {/* Filter Control Box */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#141217]/90 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-5">
          {/* Row 1: Search & Sorting */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by job title, skill, location, or company..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-black/50 border border-white/10 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-all"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-between md:justify-end">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#141217] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Secondary Dropdowns (Location, Work Type, Salary) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
            {/* Workplace Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Workplace Type
              </label>
              <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                {workTypes.map((type) => (
                  <option key={type} value={type} className="bg-[#141217] text-white">
                    {type === "All" ? "All Workplace Types" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#141217] text-white">
                    {loc === "All" ? "All Locations" : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Salary */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Salary Range
              </label>
              <select
                value={selectedMinSalary}
                onChange={(e) => setSelectedMinSalary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                {salaryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#141217] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Category Pills */}
          <div className="pt-2">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2.5">
              Category
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Active Filter Chips Bar */}
          {activeFilters.length > 0 && (
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Active filters:</span>
                {activeFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={filter.clear}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/25 transition-colors cursor-pointer"
                  >
                    <span>{filter.label}</span>
                    <span className="text-purple-400 font-bold">×</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between px-2">
          <div className="text-xs font-semibold text-slate-400">
            {loading ? (
              <span>Searching open roles...</span>
            ) : (
              <span>
                Showing <strong className="text-white">{jobs.length}</strong> {jobs.length === 1 ? "position" : "positions"}
              </span>
            )}
          </div>
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
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-[#141217]/40 border border-white/5 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 text-xl">
              🔍
            </div>
            <h3 className="text-lg font-semibold text-white">No jobs found</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
              We couldn&apos;t find any open positions matching your selected filters. Try broadening your criteria or reset filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {jobs.map((job, idx) => {
              const displayLocation = job.location || "Remote";
              const displayType = job.workType || job.jobType || (job.isRemote ? "Remote" : "Hybrid");
              const displaySalary =
                job.salaryFormatted ||
                (job.salaryMin && job.salaryMax
                  ? `${job.currency || "$"}${job.salaryMin} - ${job.salaryMax}`
                  : "€25–€40/hour");
              const displayDesc =
                job.description ||
                "Showcase your commitment to diversity and inclusion by highlighting initiatives";

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
                  {/* Ambient hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.06] via-transparent to-indigo-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    {/* Company Pill */}
                    {job.companyName && (
                      <div className="mb-2 text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                        <span>{job.companyName}</span>
                        {job.category && (
                          <span className="text-[10px] font-normal text-slate-400 lowercase px-2 py-0.5 rounded-md bg-white/5">
                            {job.category}
                          </span>
                        )}
                      </div>
                    )}

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

                  {/* Bottom Link: View Details & Apply Now */}
                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href={`/jobs/${job._id || job.id}`}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      <span>View Details</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJobForApply(job);
                      }}
                      className="px-3 py-1.5 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all cursor-pointer"
                    >
                      Quick Apply
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Quick Apply Modal */}
      <AnimatePresence>
        {selectedJobForApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#141217] border border-white/10 shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">
                    {selectedJobForApply.companyName}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Apply for {selectedJobForApply.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedJobForApply.location} • {selectedJobForApply.jobType || selectedJobForApply.workType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="text-slate-400 hover:text-white p-1 text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {applySuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-white">Application Submitted!</h4>
                  <p className="text-xs text-slate-400">
                    The recruiter at {selectedJobForApply.companyName} has received your application.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Resume / CV Link *</label>
                      <input
                        type="url"
                        required
                        value={applyForm.resumeUrl}
                        onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Portfolio / GitHub</label>
                      <input
                        type="url"
                        value={applyForm.portfolioUrl}
                        onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Short Note / Introduction</label>
                    <textarea
                      rows={3}
                      value={applyForm.coverNote}
                      onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                      placeholder="Tell the hiring team why you are a great fit..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none text-xs text-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedJobForApply(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applySubmitting}
                      className="px-6 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-slate-200 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      {applySubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
