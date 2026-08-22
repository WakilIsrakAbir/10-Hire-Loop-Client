"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import SeekerDashboard from "@/components/seeker/SeekerDashboard";

import PageLoader from "@/components/ui/loading/PageLoader";

export default function SeekerDashboardRoute() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "recruiter") {
        // If a recruiter tries to visit the seeker route, redirect to recruiter dashboard
        router.push("/dashboard/recruiter");
      }
    }
  }, [user, isPending, router]);

  if (isPending || !user || user.role === "recruiter") {
    return (
      <PageLoader
        message="Loading Seeker Portal..."
        subMessage="Preparing your jobs, applications, and saved roles"
        fullScreen={true}
      />
    );
  }

  return <SeekerDashboard user={user} refetch={refetch} />;
}
