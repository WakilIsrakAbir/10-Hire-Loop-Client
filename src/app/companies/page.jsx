"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { CompanyCardSkeleton } from "@/components/ui/loading/ShimmerSkeleton";
import PageLoader from "@/components/ui/loading/PageLoader";

function BrowseCompaniesContent() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const industries = [
    "All",
    "Fintech",
    "AI & ML",
    "Cloud Tech",
    "HealthTech",
    "Design",
    "GreenTech",
    "Developer Tools",
    "E-Commerce",
  ];

  const fetchCompanies = async (currentPage = 1, currentSearch = search, currentIndustry = selectedIndustry) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "9");
      if (currentSearch.trim()) params.append("search", currentSearch.trim());
      if (currentIndustry && currentIndustry !== "All") params.append("industry", currentIndustry);

      const res = await fetch(`/api/companies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(page, search, selectedIndustry);
  }, [page, selectedIndustry]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCompanies(1, search, selectedIndustry);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-transparent blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px)] bg-[size:4.5rem_100%] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section matching Figma Frame */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Browse Companies
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Discover the world&apos;s leading technology and creative organizations. Filter by industry, size, and values to find your next professional home.
          </p>
        </div>

        {/* Search Bar Bar matching Figma */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#141217]/90 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-3"
          >
            <div className="relative flex-1 flex items-center pl-3">
              <svg
                className="w-4 h-4 text-slate-400 shrink-0 mr-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, industry, or location..."
                className="w-full py-2 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    fetchCompanies(1, "", selectedIndustry);
                  }}
                  className="text-slate-400 hover:text-white p-1 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-200 text-black font-semibold text-xs transition-all shadow-lg shrink-0 cursor-pointer"
            >
              Find Companies
            </button>
          </form>

          {/* Industry Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => {
                  setSelectedIndustry(ind);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedIndustry === ind
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards Grid matching Figma Screenshot 1 */}
        {loading ? (
          <CompanyCardSkeleton count={6} />
        ) : companies.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-[#141217]/40 border border-white/5 space-y-4">
            <div className="text-3xl">🏢</div>
            <h3 className="text-lg font-bold text-white">No companies found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any organizations matching your search criteria. Try a different query or industry filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedIndustry("All");
              }}
              className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, idx) => (
              <motion.div
                key={company._id || idx}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#141217]/80 hover:bg-[#18151D]/90 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl overflow-hidden"
              >
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Top Header: Logo + Verified Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-white/10 flex items-center justify-center font-bold text-white text-base overflow-hidden shrink-0 shadow-lg">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        company.name.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    {/* Verified Green Badge matching Figma */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>VERIFIED</span>
                    </div>
                  </div>

                  {/* Company Name */}
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                    {company.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {company.description ||
                      "Leading innovation with advanced digital engineering and human-centered design principles."}
                  </p>

                  {/* Tags: Industry & Location */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {company.industry && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium">
                        <span className="text-purple-400 text-[10px]">☁</span>
                        <span>{company.industry}</span>
                      </span>
                    )}

                    {company.location && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium">
                        <span className="text-indigo-400 text-[10px]">📍</span>
                        <span>{company.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Active Jobs + View Openings */}
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    <strong className="text-white font-bold">{company.activeJobs || 3}</strong> Active Jobs
                  </span>

                  <Link
                    href={`/jobs?search=${encodeURIComponent(company.name)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white group-hover:text-purple-300 transition-colors"
                  >
                    <span>View Openings</span>
                    <span>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Bar matching Figma Frame: < 1 2 3 ... 12 > */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  page === p
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseCompaniesPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          message="Loading Company Directory..."
          subMessage="Fetching verified tech partners and hiring organizations"
          fullScreen={true}
        />
      }
    >
      <BrowseCompaniesContent />
    </Suspense>
  );
}
