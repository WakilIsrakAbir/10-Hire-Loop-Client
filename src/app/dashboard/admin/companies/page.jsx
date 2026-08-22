"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function AdminCompaniesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const [companiesList, setCompaniesList] = useState([
    {
      id: "c-1",
      name: "Nexus Labs",
      recruiterEmail: "sarah.j@nexuslabs.io",
      industry: "Quantum Computing",
      status: "Pending",
      dateSubmitted: "Oct 12, 2026",
    },
    {
      id: "c-2",
      name: "Aether Ventures",
      recruiterEmail: "hiring@aetherv.co",
      industry: "Venture Capital",
      status: "Approved",
      dateSubmitted: "Oct 10, 2026",
    },
    {
      id: "c-3",
      name: "Flux Tech",
      recruiterEmail: "admin@fluxtech.net",
      industry: "E-commerce",
      status: "Rejected",
      dateSubmitted: "Oct 09, 2026",
    },
    {
      id: "c-4",
      name: "Orbital Systems",
      recruiterEmail: "ops@orbital.space",
      industry: "Aerospace",
      status: "Pending",
      dateSubmitted: "Oct 14, 2026",
    },
    {
      id: "c-5",
      name: "Solaris Robotics",
      recruiterEmail: "hr@solaris-robotics.com",
      industry: "Robotics",
      status: "Approved",
      dateSubmitted: "Oct 05, 2026",
    },
  ]);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const handleStatusUpdate = (companyId, newStatus, name) => {
    setCompaniesList((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, status: newStatus } : c))
    );
    setToastMessage(`Company "${name}" is now marked as ${newStatus}!`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filteredCompanies = companiesList.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.recruiterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const pendingCount = companiesList.filter((c) => c.status === "Pending").length;
  const approvedCount = companiesList.filter((c) => c.status === "Approved").length;
  const rejectedCount = companiesList.filter((c) => c.status === "Rejected").length;

  if (isPending || !user) {
    return (
      <PageLoader
        message="Loading Company Registrations..."
        subMessage="Reviewing corporate verification requests"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content matching Figma Screenshot 5 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
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
              placeholder="Search companies, recruiters, or industries..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 space-y-8 max-w-7xl">
          {/* Toast Alert */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Title & Actions matching Figma Screenshot 5 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Company Registrations</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Review and manage corporate entity access requests for the HireLoop ecosystem.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-[#141217] hover:bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                <span>≡</span>
                <span>Filter</span>
              </button>

              <button
                onClick={() => {
                  const compName = prompt("Enter new company name to register:");
                  if (compName) {
                    const newComp = {
                      id: `c-${Date.now()}`,
                      name: compName,
                      recruiterEmail: "admin@" + compName.toLowerCase().replace(/\s+/g, "") + ".io",
                      industry: "Technology",
                      status: "Pending",
                      dateSubmitted: "Just now",
                    };
                    setCompaniesList([newComp, ...companiesList]);
                    setToastMessage(`Company "${compName}" registered for review.`);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>+</span>
                <span>Register New</span>
              </button>
            </div>
          </div>

          {/* Companies Table matching Figma Screenshot 5 */}
          <div className="p-7 rounded-3xl bg-[#141217] border border-white/5 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
                    <th className="pb-4 pl-2">Company Name</th>
                    <th className="pb-4">Recruiter Email</th>
                    <th className="pb-4">Industry</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Date Submitted</th>
                    <th className="pb-4 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCompanies.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Initials */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{c.name}</span>
                        </div>
                      </td>

                      {/* Recruiter Email */}
                      <td className="py-4 text-zinc-400 font-mono text-[11px]">{c.recruiterEmail}</td>

                      {/* Industry Pill */}
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-300">
                          {c.industry}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === "Approved"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : c.status === "Pending"
                              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                              : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.status === "Approved"
                                ? "bg-emerald-400"
                                : c.status === "Pending"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span>{c.status}</span>
                        </span>
                      </td>

                      {/* Date Submitted */}
                      <td className="py-4 text-zinc-400">{c.dateSubmitted}</td>

                      {/* Actions matching Figma Screenshot 5 */}
                      <td className="py-4 text-right pr-2">
                        <div className="flex items-center justify-end gap-2 text-xs">
                          {c.status !== "Approved" && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(c.id, "Approved", c.name)}
                              className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-semibold cursor-pointer"
                            >
                              Approve
                            </button>
                          )}

                          {c.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(c.id, "Rejected", c.name)}
                              className="px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Showing 1-5 of 124 companies</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">‹</button>
                <button className="w-7 h-7 rounded-lg bg-white text-black font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">3</button>
                <button className="w-7 h-7 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center">›</button>
              </div>
            </div>
          </div>

          {/* Bottom 3 Summary Metric Cards matching Figma Screenshot 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">PENDING REVIEW</span>
                <span className="text-[10px] font-bold text-emerald-400">+12% vs last week</span>
              </div>
              <h3 className="text-3xl font-extrabold text-amber-400">{pendingCount + 12}</h3>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">APPROVED PARTNERS</span>
                <span className="text-[10px] font-bold text-emerald-400">+5% vs last week</span>
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-400">{approvedCount + 890}</h3>
            </div>

            <div className="p-6 rounded-3xl bg-[#141217] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">TOTAL REJECTIONS</span>
                <span className="text-[10px] font-bold text-zinc-500">Stable</span>
              </div>
              <h3 className="text-3xl font-extrabold text-rose-400">{rejectedCount + 39}</h3>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
