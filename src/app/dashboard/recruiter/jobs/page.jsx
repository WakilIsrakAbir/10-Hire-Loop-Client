"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import ManageJobs from "@/components/recruiter/ManageJobs";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function RecruiterJobsRoute() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "recruiter") {
        router.push("/dashboard/seeker");
      }
    }
  }, [user, isPending, router]);

  if (isPending || !user || user.role !== "recruiter") {
    return (
      <PageLoader
        message="Loading Jobs Manager..."
        subMessage="Fetching your active listings, candidate counts, and job pipeline"
        fullScreen={true}
      />
    );
  }

  return <ManageJobs user={user} />;
}
