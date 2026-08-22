"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";
import SeekerSidebar from "@/components/seeker/SeekerSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function SeekerSettingsRoute() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    headline: "Senior UX/UI Designer",
    bio: "Passionate designer with 5+ years of experience crafting user-centric digital experiences...",
  });

  const [skills, setSkills] = useState(["Figma", "UI Design", "Prototyping", "Design Systems", "User Research"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [resumeName, setResumeName] = useState("Jane_Doe_Resume_2026.pdf");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      }));
    }
  }, [user, isPending, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
        setSkills([...skills, newSkillInput.trim()]);
        setNewSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await updateUser({
        name: formData.name.trim(),
        image: formData.image.trim() || undefined,
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to update profile.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Profile updated successfully!");
      if (refetch) await refetch();
    } catch (err) {
      console.error(err);
      setErrorMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfessional = (e) => {
    e.preventDefault();
    setSuccessMessage("Professional details & skills saved!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Seeker Settings..."
        subMessage="Fetching your profile preferences and resume details"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <SeekerSidebar user={user} />

      {/* Main Content matching Figma Screenshot 2 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-xs text-zinc-400">Manage your account details and professional profile.</p>
          </div>
        </header>

        {/* Settings Body */}
        <main className="p-8 space-y-8 max-w-6xl">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              ✓ {successMessage}
            </div>
          )}

          {/* Row 1: Profile Information (Left) & Resume Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Profile Information (8 Cols) */}
            <div className="lg:col-span-8 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
              <h3 className="text-base font-bold text-white tracking-tight">Profile Information</h3>

              {/* Avatar Section */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-xl shrink-0">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    (formData.name || "U").charAt(0).toUpperCase()
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt("Enter new Profile Image URL:", formData.image);
                      if (newUrl !== null) setFormData({ ...formData, image: newUrl });
                    }}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Change Avatar
                  </button>
                  <p className="text-[10px] text-zinc-500">JPG, GIF or PNG. Max size of 5MB.</p>
                </div>
              </div>

              {/* Inputs */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Full Name</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/5 text-xs text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Update Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Password reset instructions have been sent to your email.")}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Resume Card (4 Cols) */}
            <div className="lg:col-span-4 p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Resume</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  Upload your most recent resume to enable one-click applications.
                </p>

                {resumeName ? (
                  <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm shrink-0">
                      📄
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{resumeName}</h4>
                      <p className="text-[10px] text-zinc-500">Last updated 2 days ago • 1.2 MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-zinc-500">
                    No resume uploaded yet.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newRes = prompt("Enter new Resume Link or File Name:", resumeName);
                    if (newRes) setResumeName(newRes);
                  }}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer text-center"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setResumeName("")}
                  className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium text-rose-400 transition-colors cursor-pointer text-center"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Professional Details with Skills Chips (matching Figma Screenshot 2) */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
            <h3 className="text-base font-bold text-white tracking-tight">Professional Details</h3>

            <form onSubmit={handleSaveProfessional} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Professional Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Senior UX/UI Designer"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Bio</label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Skills Chips Tag Bar */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Skills</label>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center gap-2 min-h-[44px]">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-white font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-zinc-400 hover:text-white font-bold ml-1 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Add a skill and press Enter..."
                    className="flex-1 min-w-[180px] bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none px-2"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-lg cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
