"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import {
  getRecruiterJobsAction,
  deleteJobAction,
  createJobAction,
} from "@/actions/jobActions";

export default function ManageJobs({ user }) {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  // Load recruiter jobs from server / DB
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const res = await getRecruiterJobsAction();
        if (res.success && Array.isArray(res.jobs)) {
          const formatted = res.jobs.map((j) => ({
            id: j._id,
            _id: j._id,
            title: j.title,
            department: j.department || j.category || "Engineering",
            type: j.jobType || "Full-time",
            workplace: j.workplace || (j.isRemote ? "Remote" : "On-site"),
            location: j.location || "Remote",
            salary: j.salaryFormatted || (j.salaryMin && j.salaryMax ? `${j.currency || "$"} ${j.salaryMin} - ${j.salaryMax}` : "Competitive"),
            applicantsCount: j.applicantsCount || 0,
            newApplicants: j.newApplicants || 0,
            status: j.status || "Active",
            postedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
          }));
          setJobs(formatted);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("Failed to load recruiter jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // New Job Form State
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    type: "Full-time",
    workplace: "Remote",
    location: "",
    salary: "",
    status: "Active",
  });

  const departments = ["All", "Engineering", "Design", "Infrastructure", "Marketing", "Data & AI", "Operations"];
  const statuses = ["All", "Active", "Draft", "Closed"];

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    const matchesDept = departmentFilter === "All" || job.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Stats calculation
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const draftJobs = jobs.filter((j) => j.status === "Draft").length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      department: "Engineering",
      type: "Full-time",
      workplace: "Remote",
      location: "",
      salary: "",
      status: "Active",
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      type: job.type,
      workplace: job.workplace,
      location: job.location,
      salary: job.salary,
      status: job.status,
    });
    setIsCreateModalOpen(true);
  };

  const handleDeleteJob = async (id) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showAlert("Job posting deleted successfully!");

      try {
        // If it's a mongo ID (24 hex chars)
        if (typeof id === "string" && id.length === 24) {
          await deleteJobAction(id);
        }
      } catch (err) {
        console.error("Delete action error:", err);
      }
    }
  };

  const handleToggleStatus = (job) => {
    const nextStatus = job.status === "Active" ? "Closed" : job.status === "Closed" ? "Active" : "Active";
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
    );
    showAlert(`Job status updated to ${nextStatus}!`);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingJob) {
      // Update existing
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                ...formData,
                title: formData.title.trim(),
                location: formData.location.trim() || `${formData.workplace}`,
                salary: formData.salary.trim() || "$100,000 - $140,000",
              }
            : j
        )
      );
      showAlert("Job updated successfully!");
    } else {
      // Create new
      const newJobId = `JOB-${jobs.length + 101}`;
      const newJob = {
        id: newJobId,
        title: formData.title.trim(),
        department: formData.department,
        type: formData.type,
        workplace: formData.workplace,
        location: formData.location.trim() || `${formData.workplace}`,
        salary: formData.salary.trim() || "$120,000 - $160,000",
        applicantsCount: 0,
        newApplicants: 0,
        status: formData.status,
        postedDate: "Just now",
      };
      setJobs((prev) => [newJob, ...prev]);
      showAlert("New job published successfully!");

      try {
        await createJobAction({
          title: formData.title,
          category: formData.department,
          department: formData.department,
          jobType: formData.type,
          isRemote: formData.workplace === "Remote",
          location: formData.location,
        });
      } catch (err) {
        console.error("Save job error:", err);
      }
    }

    setIsCreateModalOpen(false);
  };

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex">
      {/* Left Sidebar */}
      <RecruiterSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/recruiter"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Dashboard</span>
              <span>/</span>
            </Link>
            <span className="text-xs font-semibold text-white">Manage Jobs</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/recruiter/jobs/new"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-all duration-200 shadow-lg shadow-white/10 flex items-center gap-2 cursor-pointer"
            >
              <span>+</span>
              <span>Post New Job</span>
            </Link>

            <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">
                  {user?.name || "Alex Sterling"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {user?.companyName || "TechFlow Inc."}
                </p>
              </div>
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="w-9 h-9 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B60F6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">
                  {user?.name ? user.name.charAt(0) : "A"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Toast Alert */}
          {alertMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{alertMessage}</span>
            </div>
          )}

          {/* Page Heading & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Manage Jobs
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                View, publish, edit, and track all your job listings and applicants in one place.
              </p>
            </div>
          </div>

          {/* Plan Usage Indicator Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171720] via-[#14141c] to-[#121217] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">Active Plan Capacity:</span>
                <span className="text-xs font-bold text-indigo-400">{activeJobs} / 10 Active Job Posts Used</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Growth Tier
                </span>
              </div>
              <div className="w-full max-w-md h-2 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min((activeJobs / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
            <Link
              href="/dashboard/recruiter/billing"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors whitespace-nowrap"
            >
              Upgrade Limit →
            </Link>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Total Listings</span>
              <h3 className="text-2xl font-bold text-white mt-1">{totalJobs}</h3>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Active Jobs</span>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{activeJobs}</h3>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Total Applicants</span>
              <h3 className="text-2xl font-bold text-indigo-400 mt-1">{totalApplicants}</h3>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/5">
              <span className="text-xs text-zinc-400 font-medium">Drafts</span>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{draftJobs}</h3>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="p-4 rounded-2xl bg-[#141417] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title, ID, or location..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            {/* Department and Status Filter Pills */}
            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              {/* Department Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span>Dept:</span>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-[#141417] text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Segment Filter */}
              <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === status
                        ? "bg-white text-black font-semibold shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listings Table */}
          <div className="rounded-2xl bg-[#141417] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-5">Job Details</th>
                    <th className="py-4 px-5">Department</th>
                    <th className="py-4 px-5">Workplace & Salary</th>
                    <th className="py-4 px-5 text-center">Applicants</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-zinc-300">
                  {loading ? (
                    // Skeleton Loading State
                    [1, 2, 3].map((i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-5">
                          <div className="h-4 w-48 bg-white/10 rounded mb-1.5" />
                          <div className="h-3 w-28 bg-white/5 rounded" />
                        </td>
                        <td className="py-4 px-5">
                          <div className="h-6 w-20 bg-white/10 rounded-lg" />
                        </td>
                        <td className="py-4 px-5">
                          <div className="h-4 w-32 bg-white/10 rounded mb-1.5" />
                          <div className="h-3 w-24 bg-white/5 rounded" />
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="h-4 w-8 bg-white/10 rounded mx-auto" />
                        </td>
                        <td className="py-4 px-5">
                          <div className="h-6 w-16 bg-white/10 rounded-full" />
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="h-6 w-24 bg-white/10 rounded-lg ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Title & ID */}
                        <td className="py-4 px-5">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white text-sm block">
                              {job.title}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                              <span className="text-indigo-400 font-medium">{job.id}</span>
                              <span>•</span>
                              <span>Posted {job.postedDate}</span>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-zinc-300 font-medium">
                            {job.department}
                          </span>
                        </td>

                        {/* Workplace & Salary */}
                        <td className="py-4 px-5">
                          <div className="space-y-0.5">
                            <span className="text-white font-medium block">
                              {job.salary}
                            </span>
                            <span className="text-[11px] text-zinc-400 block">
                              {job.workplace} • {job.location}
                            </span>
                          </div>
                        </td>

                        {/* Applicants */}
                        <td className="py-4 px-5 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-sm font-bold text-white">
                              {job.applicantsCount}
                            </span>
                            {job.newApplicants > 0 && (
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                +{job.newApplicants} new
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Pill */}
                        <td className="py-4 px-5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(job)}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                              job.status === "Active"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                : job.status === "Draft"
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                job.status === "Active"
                                  ? "bg-emerald-400"
                                  : job.status === "Draft"
                                  ? "bg-amber-400"
                                  : "bg-rose-400"
                              }`}
                            />
                            {job.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Applicants Link */}
                            <Link
                              href={`/dashboard/jobs/${job.id}/applicants`}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 text-[11px] font-medium transition-colors"
                              title="View Applicants"
                            >
                              Applicants
                            </Link>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(job)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                              title="Edit Job"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            {/* Close / Reopen Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(job)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                              title={job.status === "Active" ? "Close Job" : "Reopen Job"}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete Job"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : jobs.length === 0 ? (
                    // Empty State when no jobs posted at all
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-zinc-400">
                            💼
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">No Job Postings Yet</h4>
                            <p className="text-xs text-zinc-400 mt-1">
                              You haven&apos;t posted any jobs yet. Create and publish your first job listing to start receiving applications.
                            </p>
                          </div>
                          <Link
                            href="/dashboard/recruiter/jobs/new"
                            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 inline-flex items-center gap-1.5"
                          >
                            <span>+</span>
                            <span>Post Your First Job</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Empty State when filter/search yields no matches
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500 text-xs">
                        No job postings found matching your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Create or Edit Job */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#141417] border border-white/10 p-6 sm:p-8 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingJob ? "Edit Job Posting" : "Publish New Job Posting"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                />
              </div>

              {/* Department & Workplace */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                  >
                    {departments.filter((d) => d !== "All").map((dept) => (
                      <option key={dept} value={dept} className="bg-[#141417] text-white">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Workplace Type
                  </label>
                  <select
                    value={formData.workplace}
                    onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                  >
                    <option value="Remote" className="bg-[#141417] text-white">Remote</option>
                    <option value="Hybrid" className="bg-[#141417] text-white">Hybrid</option>
                    <option value="On-site" className="bg-[#141417] text-white">On-site</option>
                  </select>
                </div>
              </div>

              {/* Location & Salary */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco / Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $140k - $180k"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1.5">
                  Listing Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-zinc-400 cursor-pointer"
                >
                  <option value="Active" className="bg-[#141417] text-white">Active (Accepting Applicants)</option>
                  <option value="Draft" className="bg-[#141417] text-white">Draft</option>
                  <option value="Closed" className="bg-[#141417] text-white">Closed</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  {editingJob ? "Save Changes" : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
