"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    adminRole: "Super Administrator",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        adminRole: "Super Administrator",
      });
    }
  }, [user, isPending, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSaveSettings = async (e) => {
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
        setErrorMessage(res.error.message || "Failed to update admin profile.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Admin profile and preferences saved successfully!");
      if (refetch) await refetch();
    } catch (err) {
      console.error(err);
      setErrorMessage("Error updating settings.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Admin Settings..."
        subMessage="Fetching system profile and preferences"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Settings</h1>
            <p className="text-xs text-zinc-400">Manage your system credentials and console preferences.</p>
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-5xl">
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

          <div className="p-8 rounded-3xl bg-[#141217] border border-white/5 space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-white/5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-3xl overflow-hidden shadow-xl shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  (formData.name || "A").charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">{formData.name || "Super Admin"}</h3>
                <p className="text-xs text-zinc-400">{user?.email}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider mt-1">
                  System Administrator
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Admin Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Admin Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Admin Avatar URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert("Password reset instructions have been sent to your administrator email.")}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 transition-colors"
                >
                  Reset Admin Password
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving Changes..." : "Save Admin Profile"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
