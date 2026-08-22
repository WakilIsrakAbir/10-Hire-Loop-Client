"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import RecruiterDashboard from "@/components/recruiter/RecruiterDashboard";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";

import PageLoader from "@/components/ui/loading/PageLoader";

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
      <PageLoader
        message="Loading Recruiter Workspace..."
        subMessage="Preparing your company profile, active job posts, and applicants"
        fullScreen={true}
      />
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
