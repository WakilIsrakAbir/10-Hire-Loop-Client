"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { updateUser } from "@/lib/auth-client";

// Profile Settings Form
export function ProfileSettingsForm({ user, refetch }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await updateUser({
        name: formData.name.trim(),
        image: formData.image.trim() || undefined,
      });

      if (response?.error) {
        setErrorMessage(response.error.message || "Failed to update profile.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Profile updated successfully!");
      if (refetch) await refetch();
      setLoading(false);
    } catch (err) {
      setErrorMessage(
        err?.message || "An unexpected error occurred while updating profile."
      );
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-[#141217]/85 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
      <div className="mb-6 border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Profile Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Update your account name and avatar picture URL
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="relative mb-4">
            {formData.image ? (
              <img
                src={formData.image}
                alt={formData.name || "Avatar"}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl shadow-indigo-500/25"
                onError={(e) => {
                  e.currentTarget.src = "";
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-3xl uppercase shadow-xl shadow-indigo-500/30">
                {formData.name ? formData.name.charAt(0) : "U"}
              </div>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white truncate max-w-full">
            {formData.name || "Your Name"}
          </h4>
          <p className="text-xs text-slate-400 truncate max-w-full mt-0.5">
            {user?.email}
          </p>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium uppercase tracking-wider">
              {user?.role === "recruiter" ? "Recruiter" : "Job Seeker"}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address <span className="text-[10px] text-slate-500 lowercase">(read-only)</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Profile Picture URL
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/your-avatar.jpg"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#5B60F6] to-[#7C3AED] hover:from-[#4F53E8] hover:to-[#6D28D9] shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Saving changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Job Seeker Dashboard Main View Component
export default function SeekerDashboard({ user, refetch }) {
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function fetchMyApplications() {
      try {
        setLoadingApps(true);
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoadingApps(false);
      }
    }
    fetchMyApplications();
  }, []);

  const statusFilters = ["All", "Under Review", "Shortlisted", "Offered", "Rejected"];

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "All") return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Offered":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
      case "Shortlisted":
        return "bg-purple-500/15 border-purple-500/30 text-purple-300";
      case "Rejected":
        return "bg-rose-500/15 border-rose-500/30 text-rose-400";
      case "Under Review":
      default:
        return "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Vertical Stripes & Ambient Light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px)] bg-[size:4.5rem_100%] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7C3AED]/15 to-[#5B60F6]/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141217]/85 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-lg shadow-indigo-500/25"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xl uppercase shadow-lg shadow-indigo-500/30">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {user?.name || "Job Seeker"}! 👋
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                  Job Seeker
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>{user?.email}</span>
                <span className="text-slate-600">•</span>
                <span>Active Candidate</span>
              </p>
            </div>
          </div>

          <Link
            href="/jobs"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#5B60F6] to-[#7C3AED] hover:from-[#4F53E8] hover:to-[#6D28D9] shadow-lg shadow-indigo-500/25 transition-all duration-200"
          >
            Browse Open Jobs →
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Applied Jobs</span>
            <h3 className="text-3xl font-bold text-white mt-1">{applications.length}</h3>
            <p className="text-[11px] text-indigo-400 mt-2">Active applications</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Under Review</span>
            <h3 className="text-3xl font-bold text-white mt-1">
              {applications.filter((a) => (a.status || "Under Review") === "Under Review").length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-2">In review by recruiters</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Shortlisted</span>
            <h3 className="text-3xl font-bold text-purple-400 mt-1">
              {applications.filter((a) => a.status === "Shortlisted" || a.status === "Offered").length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-2">Passed to next round</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Profile Status</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">Active</h3>
            <p className="text-[11px] text-slate-500 mt-2">Ready for applications</p>
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141217]/85 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                My Job Applications
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Track the status and progress of the positions you applied for
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {statusFilters.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                      : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loadingApps ? (
            <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
              Loading your submitted applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
                📂
              </div>
              <h3 className="text-base font-semibold text-white">No applications found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {statusFilter === "All"
                  ? "You haven't submitted any job applications yet. Discover roles and start applying today!"
                  : `No applications with "${statusFilter}" status.`}
              </p>
              <Link
                href="/jobs"
                className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B60F6] to-[#7C3AED] text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
              >
                Browse Open Positions
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pl-2">Job Title & Company</th>
                    <th className="pb-3">Applied Date</th>
                    <th className="pb-3">Resume / CV</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2">
                        <div className="font-semibold text-sm text-white">{app.jobTitle}</div>
                        <div className="text-xs text-purple-400 mt-0.5">{app.companyName}</div>
                      </td>
                      <td className="py-4 text-slate-400">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="py-4">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 underline"
                          >
                            View Resume ↗
                          </a>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getStatusBadge(
                            app.status || "Under Review"
                          )}`}
                        >
                          {app.status || "Under Review"}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <Link
                          href={`/jobs/${app.jobId}`}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                        >
                          View Job
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Profile Settings Section */}
        <ProfileSettingsForm key={user?.id || user?.email} user={user} refetch={refetch} />
      </div>
    </div>
  );
}
