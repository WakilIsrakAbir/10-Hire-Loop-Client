"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";

export default function MyCompany({ user }) {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    industry: "Technology",
    website: "",
    location: "San Francisco, CA",
    employeeRange: "1-10 employees",
    logo: "",
    description: "",
  });

  // Fetch company from API
  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true);
        const res = await fetch("/api/company");
        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            setCompany(data.company);
            setFormData({
              name: data.company.name || "",
              industry: data.company.industry || "Technology",
              website: data.company.website || "",
              location: data.company.location || "San Francisco, CA",
              employeeRange: data.company.employeeRange || "1-10 employees",
              logo: data.company.logo || "",
              description: data.company.description || "",
            });
          }
        }
      } catch (err) {
        console.error("Error loading company:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, []);

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.company) {
        setCompany(data.company);
        setIsRegisterModalOpen(false);
        showToast("Company registered successfully! Status is currently Pending Approval.");
      } else {
        alert(data.error || "Failed to register company.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting company registration.");
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const industries = [
    "Technology",
    "Financial Services",
    "Healthcare & Biotech",
    "E-Commerce & Retail",
    "Design & Creative",
    "AI & Data Intelligence",
    "Telecommunications",
    "Media & Entertainment",
  ];

  const employeeRanges = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500-1000 employees",
    "1000+ employees",
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Left Sidebar */}
      <RecruiterSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold text-white">My Company</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Companies Input */}
            <div className="relative hidden sm:block w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">
                  {user?.name ? user.name.charAt(0) : "A"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="m-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-3 text-zinc-400 text-xs">
              <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading company details...</span>
            </div>
          </div>
        ) : !company ? (
          /* ========================================================================= */
          /* STATE 1: COMPANY NOT REGISTERED YET (EMPTY STATE - IMAGE 1)              */
          /* ========================================================================= */
          <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-xl mx-auto space-y-6">
            {/* Dark Device Mockup Graphic with Floating Store Badge */}
            <div className="relative mb-2">
              <div className="w-32 h-40 sm:w-40 sm:h-48 rounded-3xl bg-[#18181c] border border-white/10 p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/5" />
                  <div className="w-16 h-2 rounded bg-white/10" />
                  <div className="w-full h-1.5 rounded bg-white/5" />
                  <div className="w-3/4 h-1.5 rounded bg-white/5" />
                </div>
                <div className="self-end">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-zinc-500">
                    🏢
                  </div>
                </div>
              </div>

              {/* Floating Store Badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-black/80 font-bold">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            {/* Empty State Text */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Company not registered yet
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
                Set up your business profile to start posting high-performance job listings and manage your talent loop.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-all duration-200 shadow-lg shadow-white/10 cursor-pointer"
              >
                Register your company
              </button>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#141417] hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
              >
                View FAQ
              </button>
            </div>

            {/* Footer Notice */}
            <p className="text-[11px] text-zinc-500 pt-6">
              Need specialized assistance? Contact our enterprise support team.
            </p>
          </main>
        ) : (
          /* ========================================================================= */
          /* STATE 2: COMPANY REGISTERED - SHOWCASE VIEW (IMAGE 3)                     */
          /* ========================================================================= */
          <main className="p-6 sm:p-8 space-y-8 flex-1">
            {/* Top Atmospheric Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e0e1a] via-[#101018] to-[#14141c] p-6 sm:p-10 shadow-2xl">
              {/* Glowing Globe / Nebula Ambient Background */}
              <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/25 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-1/4 w-96 h-48 bg-blue-500/15 blur-[120px] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                {/* Logo and Main Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Golden / Brand Logo Box */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D77F] p-0.5 shadow-2xl shadow-yellow-500/20 shrink-0">
                    <div className="w-full h-full rounded-[22px] bg-[#141417] flex items-center justify-center overflow-hidden">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-extrabold text-[#D4AF37]">
                          {company.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {company.name}
                      </h1>
                      {/* Dynamic Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          company.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : company.status === "rejected"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            company.status === "approved"
                              ? "bg-emerald-400"
                              : company.status === "rejected"
                              ? "bg-rose-400"
                              : "bg-amber-400"
                          }`}
                        />
                        {company.status === "approved" ? "APPROVED" : company.status === "rejected" ? "REJECTED" : "PENDING REVIEW"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                      {company.description ||
                        "Engineering the future of enterprise cloud intelligence and distributed ledger solutions."}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1">
                      <span>{company.industry}</span>
                      <span>•</span>
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenRegisterModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                  >
                    Edit Company
                  </button>
                  {company.website && (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Main Details Grid: Left 8 Cols (About, Stats, Photos), Right 4 Cols (Active Roles, Hiring Team) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* About Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    About {company.name}
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    <p>
                      {company.description ||
                        `Founded with a vision to redefine excellence, ${company.name} has emerged as a global leader in high-performance digital infrastructure and intelligent automated ecosystems.`}
                    </p>
                    <p>
                      Our mission is to empower organizations with resilient, scalable, and secure technologies that drive meaningful progress. With continuous focus on innovation and high-standard design, our teams solve mission-critical problems every day.
                    </p>
                  </div>
                </div>

                {/* Company Stats 3 Cards */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                    Company Stats
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Employees */}
                    <div className="p-5 rounded-2xl bg-[#141417] border border-white/5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-white">{company.employeeRange}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">EMPLOYEES</p>
                    </div>

                    {/* Headquarters */}
                    <div className="p-5 rounded-2xl bg-[#141417] border border-white/5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-white truncate">{company.location}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">HEADQUARTERS</p>
                    </div>

                    {/* Presence */}
                    <div className="p-5 rounded-2xl bg-[#141417] border border-white/5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-white">Global</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">PRESENCE</p>
                    </div>
                  </div>
                </div>

                {/* Life at Company Gallery */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      Life at {company.name}
                    </h3>
                    <button
                      type="button"
                      className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      View Gallery
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="h-44 rounded-2xl overflow-hidden border border-white/5 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
                        alt="Office workspace"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="h-44 rounded-2xl overflow-hidden border border-white/5 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
                        alt="Collaborative meeting"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="h-44 rounded-2xl overflow-hidden border border-white/5 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"
                        alt="Engineering setup"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Active Roles + Hiring Team */}
              <div className="lg:col-span-4 space-y-6">
                {/* Active Roles Widget */}
                <div className="p-5 rounded-3xl bg-[#141417] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Active Roles</h3>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-xs font-bold">
                      3
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Role 1 */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            Senior Distributed Systems Engineer
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            SF / Remote • $160k - $240k
                          </p>
                        </div>
                        <span className="text-zinc-500 hover:text-white cursor-pointer">↗</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex -space-x-1.5">
                          <img className="w-5 h-5 rounded-full border border-zinc-800" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50" alt="" />
                          <img className="w-5 h-5 rounded-full border border-zinc-800" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" alt="" />
                          <span className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">+12</span>
                        </div>
                        <Link
                          href="/dashboard/recruiter/jobs"
                          className="px-3 py-1 rounded-lg text-[10px] font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
                        >
                          Quick Apply
                        </Link>
                      </div>
                    </div>

                    {/* Role 2 */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            Product Design Lead
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            New York • $160k - $210k
                          </p>
                        </div>
                        <span className="text-zinc-500 hover:text-white cursor-pointer">↗</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex -space-x-1.5">
                          <img className="w-5 h-5 rounded-full border border-zinc-800" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50" alt="" />
                          <span className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">+5</span>
                        </div>
                        <Link
                          href="/dashboard/recruiter/jobs"
                          className="px-3 py-1 rounded-lg text-[10px] font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
                        >
                          Quick Apply
                        </Link>
                      </div>
                    </div>

                    {/* Role 3 */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            DevOps Architect (Infra)
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            Remote • $190k+
                          </p>
                        </div>
                        <span className="text-zinc-500 hover:text-white cursor-pointer">↗</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex -space-x-1.5">
                          <img className="w-5 h-5 rounded-full border border-zinc-800" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50" alt="" />
                          <span className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">+8</span>
                        </div>
                        <Link
                          href="/dashboard/recruiter/jobs"
                          className="px-3 py-1 rounded-lg text-[10px] font-semibold text-black bg-white hover:bg-zinc-200 transition-colors"
                        >
                          Quick Apply
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/recruiter/jobs"
                    className="block text-center text-xs font-semibold text-zinc-400 hover:text-white transition-colors pt-1"
                  >
                    See all openings →
                  </Link>
                </div>

                {/* Hiring Team Widget */}
                <div className="p-5 rounded-3xl bg-[#141417] border border-white/5 space-y-4">
                  <h3 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                    HIRING TEAM
                  </h3>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="Sarah Chen"
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">Sarah Chen</h4>
                      <p className="text-[10px] text-zinc-400">Head of Talent Acquisition</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 transition-colors border border-white/5 text-center cursor-pointer"
                  >
                    Message Team
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REGISTER / EDIT COMPANY MODAL (IMAGE 2)                                  */}
      {/* ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-[#141417] border border-white/10 p-6 sm:p-8 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {company ? "Edit Company Profile" : "Register New Company"}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Enter your business details to start hiring on HireLoop.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterCompany} className="space-y-4">
              {/* Company Name & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Industry / Category
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind} className="bg-[#141417] text-white">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Website URL & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Website URL
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-zinc-500 font-mono">
                      https://
                    </span>
                    <input
                      type="text"
                      value={formData.website.replace(/^https?:\/\//, "")}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="www.company.com"
                      className="w-full pl-16 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Location
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-zinc-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>
              </div>

              {/* Employee Count Range & Company Logo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Employee Count Range
                  </label>
                  <select
                    value={formData.employeeRange}
                    onChange={(e) => setFormData({ ...formData, employeeRange: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                  >
                    {employeeRanges.map((range) => (
                      <option key={range} value={range} className="bg-[#141417] text-white">
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://.../logo.png"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* Brief Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Brief Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your company's mission and culture..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Register Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FAQ MODAL                                                                 */}
      {/* ========================================================================= */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-white/10 p-6 sm:p-8 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white">Company Registration FAQ</h3>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div>
                <h4 className="font-bold text-white">Why register a company?</h4>
                <p className="text-zinc-400 mt-0.5">
                  Registering a company unlocks verified job postings, talent search access, and premium candidate loops.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white">How long does approval take?</h4>
                <p className="text-zinc-400 mt-0.5">
                  Our admin team reviews submissions within 24 hours to ensure high quality on the HireLoop platform.
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
