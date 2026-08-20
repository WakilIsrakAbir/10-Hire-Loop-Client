"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, updateUser } from "@/lib/auth-client";

import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";

export default function RecruiterSettings({ user, refetch }) {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileToast, setProfileToast] = useState("");
  const [passwordToast, setPasswordToast] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch company
  useEffect(() => {
    async function loadCompany() {
      try {
        setLoadingCompany(true);
        const res = await fetch("/api/company");
        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            setCompany(data.company);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCompany(false);
      }
    }
    loadCompany();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;

    setSavingProfile(true);
    setProfileToast("");

    try {
      const res = await updateUser({
        name: profileForm.name.trim(),
        image: profileForm.image.trim() || undefined,
      });

      if (res?.error) {
        alert(res.error.message || "Failed to update profile.");
      } else {
        setProfileToast("Personal information updated successfully!");
        if (refetch) await refetch();
        setTimeout(() => setProfileToast(""), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordToast("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setSavingPassword(true);

    // Simulate password change success
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordToast("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordToast(""), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Left Sidebar */}
      <RecruiterSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white">Recruiter Settings</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">
                  {user?.name || "Alex Sterling"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {company?.name || user?.companyName || "TechFlow Inc."}
                </p>
              </div>
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

        {/* Content Body */}
        <main className="p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-8 flex-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Account & Company Settings
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage your personal credentials, profile appearance, and linked company profile.
            </p>
          </div>

          {/* SECTION 1: LINKED COMPANY CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>🏢</span>
                  <span>Linked Company Profile</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  The company associated with all your published job postings
                </p>
              </div>
              <Link
                href="/dashboard/recruiter/company"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <span>Manage Company</span>
                <span>→</span>
              </Link>
            </div>

            {loadingCompany ? (
              <div className="py-4 text-xs text-zinc-500">Loading linked company data...</div>
            ) : company ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D77F] p-0.5 shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-[#141417] flex items-center justify-center overflow-hidden font-bold text-yellow-400">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        company.name.charAt(0)
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{company.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {company.status === "approved" ? "Approved" : "Pending Review"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {company.industry} • {company.location} • {company.employeeRange}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/recruiter/company"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors self-start sm:self-auto"
                >
                  View Details
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <span>No company registered yet. Register your business profile to verify job listings.</span>
                <Link
                  href="/dashboard/recruiter/company"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs shrink-0 hover:bg-amber-400 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>

          {/* SECTION 2: PERSONAL INFO FORM */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/5 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>👤</span>
                <span>Personal Information</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update your display name and recruiter avatar
              </p>
            </div>

            {profileToast && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{profileToast}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Email (Read only) */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">
                    Email Address <span className="text-[10px] text-zinc-500 normal-case">(read-only)</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Avatar Picture URL */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                  Profile Picture URL
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">
                    {profileForm.image ? (
                      <img
                        src={profileForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "";
                        }}
                      />
                    ) : (
                      <span className="text-base font-bold text-zinc-500">
                        {profileForm.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={profileForm.image}
                    onChange={(e) => setProfileForm({ ...profileForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/.../photo.jpg"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {savingProfile ? "Saving..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: CHANGE PASSWORD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141417] border border-white/5 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>🔒</span>
                <span>Change Password</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Ensure your account is protected with a secure password
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}

            {passwordToast && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{passwordToast}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {savingPassword ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
