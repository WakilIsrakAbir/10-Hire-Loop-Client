"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import RecruiterDashboard from "@/components/recruiter/RecruiterDashboard";
import { ProfileSettingsForm } from "@/components/seeker/SeekerDashboard";

export default function RecruiterDashboardRoute() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "recruiter") {
        // If a job seeker tries to visit the recruiter route, redirect to seeker dashboard
        router.push("/dashboard/seeker");
      }
    }
  }, [user, isPending, router]);

  if (isPending || !user || user.role !== "recruiter") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709] text-white">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-400 text-sm font-medium">Loading recruiter dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <RecruiterDashboard
      user={user}
      refetch={refetch}
      ProfileSettingsForm={ProfileSettingsForm}
    />
  );
}
