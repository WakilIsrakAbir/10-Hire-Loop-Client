"use client";

import React, { useState } from "react";
import { updateUser } from "@/lib/auth-client";

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

export default ProfileSettingsForm;
