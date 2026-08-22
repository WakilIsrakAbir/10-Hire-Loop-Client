"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [usersList, setUsersList] = useState([
    {
      id: "u-1",
      name: "Jordan Davis",
      email: "jordan.davis@example.com",
      role: "Seeker",
      joinDate: "Oct 12, 2026",
      status: "Active",
    },
    {
      id: "u-2",
      name: "Elena Rodriguez",
      email: "elena.r@talentflow.io",
      role: "Recruiter",
      joinDate: "Sep 28, 2026",
      status: "Active",
    },
    {
      id: "u-3",
      name: "Marcus Webb",
      email: "m.webb@outlook.com",
      role: "Seeker",
      joinDate: "Aug 05, 2026",
      status: "Suspended",
    },
    {
      id: "u-4",
      name: "Tom Hiddleston",
      email: "t.hiddles@loki-tech.com",
      role: "Recruiter",
      joinDate: "Nov 01, 2026",
      status: "Active",
    },
  ]);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const handleRoleToggle = (userId, currentRole, name) => {
    const newRole = currentRole === "Seeker" ? "Recruiter" : "Seeker";
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setToastMessage(`Updated ${name}'s role to ${newRole}!`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleStatusToggle = (userId, currentStatus, name) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    setToastMessage(`${name} is now ${newStatus}.`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDeleteUser = (userId, name) => {
    if (confirm(`Are you sure you want to remove user "${name}"?`)) {
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      setToastMessage(`User ${name} has been removed.`);
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Users Management..."
        subMessage="Fetching platform accounts and role permissions"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content matching Figma Screenshot 4 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between gap-6 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white">
              Manage Roles ▾
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">User Management</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Review, filter, and manage platform access for all users.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-xl bg-[#141217] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Seeker">Seeker</option>
                <option value="Recruiter">Recruiter</option>
              </select>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                Export List
              </button>
            </div>
          </div>

          {/* 4 Summary Cards matching Figma Screenshot 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium">Total Active Users</span>
              <h3 className="text-2xl font-extrabold text-white">12,842</h3>
              <p className="text-[10px] text-emerald-400 font-medium">+12% vs last month</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium">Recruiter Growth</span>
              <h3 className="text-2xl font-extrabold text-white">843</h3>
              <p className="text-[10px] text-emerald-400 font-medium">High demand</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium">Suspended Accounts</span>
              <h3 className="text-2xl font-extrabold text-white">124</h3>
              <p className="text-[10px] text-zinc-500 font-medium">0.8% of total</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium">New Signups (24h)</span>
              <h3 className="text-2xl font-extrabold text-white">42</h3>
              <p className="text-[10px] text-zinc-400 font-medium">Steady activity</p>
            </div>
          </div>

          {/* Users Table matching Figma Screenshot 4 */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="pb-4 pl-2">User Name</th>
                    <th className="pb-4">Email Address</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Join Date</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{u.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 text-zinc-400 font-mono text-[11px]">
                        {u.email}
                      </td>

                      {/* Role */}
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-zinc-300">
                          <span>{u.role === "Recruiter" ? "🏢" : "👤"}</span>
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Join Date */}
                      <td className="py-4 text-zinc-400">{u.joinDate}</td>

                      {/* Status */}
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === "Active"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <span>{u.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right pr-2">
                        <div className="flex items-center justify-end gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => handleRoleToggle(u.id, u.role, u.name)}
                            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {u.role === "Seeker" ? "Make Recruiter" : "Make Seeker"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusToggle(u.id, u.status, u.name)}
                            className={u.status === "Active" ? "text-rose-400 hover:text-rose-300" : "text-emerald-400 hover:text-emerald-300"}
                          >
                            {u.status === "Active" ? "Suspend" : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="text-zinc-500 hover:text-rose-400"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Showing 1 to {filteredUsers.length} of 12,842 users</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">‹</button>
                <button className="w-7 h-7 rounded-lg bg-white text-black font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">3</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">›</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
