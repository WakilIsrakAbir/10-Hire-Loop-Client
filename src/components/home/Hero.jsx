"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const trendingPositions = [
    "Product Designer",
    "AI Engineering",
    "Dev-ops Engineer",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 flex flex-col items-center">
      {/* Top Announcement Badge */}
      <div className="flex items-center justify-center gap-3 w-full mb-5">
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-white/20" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18171C]/90 border border-white/10 backdrop-blur-md shadow-lg shadow-black/40">
          <span className="text-sm">💼</span>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            50,000+ NEW JOBS THIS MONTH
          </span>
        </div>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-white/20" />
      </div>

      {/* Hero Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white text-center tracking-tight leading-[1.12]">
        Find Your Dream Job Today
      </h1>

      {/* Hero Subtitle */}
      <p className="mt-4 text-base sm:text-lg text-slate-400 text-center max-w-2xl mx-auto leading-relaxed">
        HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.
      </p>

      {/* Search Bar Form */}
      <form
        onSubmit={handleSearch}
        className="mt-8 w-full max-w-3xl rounded-2xl bg-[#141417]/85 border border-white/10 backdrop-blur-xl p-2 sm:p-2.5 shadow-2xl shadow-black/60 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 transition-all duration-200 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20"
      >
        {/* Job title */}
        <div className="flex items-center gap-3 px-3 py-2.5 sm:py-2 flex-1 w-full">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, skill or company"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-7 w-[1px] bg-white/15" />

        {/* Location */}
        <div className="flex items-center gap-3 px-3 py-2.5 sm:py-2 flex-1 w-full border-t sm:border-t-0 border-white/10">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location or Remote"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          aria-label="Search"
          className="w-full sm:w-auto p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#5B60F6] to-[#7C3AED] hover:from-[#4F53E8] hover:to-[#6D28D9] text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Trending Positions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <span className="text-slate-500 font-medium mr-1">Trending Position</span>
        {trendingPositions.map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => handleTagClick(pos)}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all duration-200 hover:border-white/20 active:scale-95"
          >
            {pos}
          </button>
        ))}
      </div>
    </section>
  );
}
