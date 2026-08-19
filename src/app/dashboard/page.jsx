"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const user = session?.user;

  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    } else if (user) {
      setFormData({
        name: user.name || "",
        image: user.image || "",
      });
    }
  }, [user, isPending, router]);

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

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709] text-white">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-400 text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || "Job Seeker"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {user?.email} • Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#5B60F6] to-[#7C3AED] hover:from-[#4F53E8] hover:to-[#6D28D9] shadow-lg shadow-indigo-500/25 transition-all duration-200"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Applied Jobs</span>
            <h3 className="text-3xl font-bold text-white mt-1">0</h3>
            <p className="text-[11px] text-slate-500 mt-2">Start exploring positions</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Saved Jobs</span>
            <h3 className="text-3xl font-bold text-white mt-1">0</h3>
            <p className="text-[11px] text-slate-500 mt-2">Bookmark top opportunities</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Profile Status</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">Active</h3>
            <p className="text-[11px] text-slate-500 mt-2">Ready for applications</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141217]/85 border border-white/10 backdrop-blur-xl">
            <span className="text-xs text-slate-400 font-medium">Interviews</span>
            <h3 className="text-3xl font-bold text-white mt-1">0</h3>
            <p className="text-[11px] text-slate-500 mt-2">No upcoming interviews</p>
          </div>
        </div>

        {/* Profile Settings Section inside Dashboard */}
        <div className="rounded-3xl bg-[#141217]/85 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
          
          <div className="mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Profile Settings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Update your account name and avatar picture URL
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Avatar Preview */}
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
              <span className="mt-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium">
                Live Preview
              </span>
            </div>

            {/* Right: Update Form */}
            <form onSubmit={handleUpdateProfile} className="lg:col-span-2 space-y-4">
              
              {/* Name Input */}
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

              {/* Email (Read only) */}
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

              {/* Profile Picture URL */}
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

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#5B60F6] to-[#7C3AED] hover:from-[#4F53E8] hover:to-[#6D28D9] shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
