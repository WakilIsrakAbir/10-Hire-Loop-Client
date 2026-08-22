"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import ViewApplicants from "@/components/recruiter/ViewApplicants";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function JobApplicantsRoute() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const jobId = params?.jobId || "JOB-101";

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
        message="Loading Candidate Pipeline..."
        subMessage="Retrieving applicant submissions, resumes, and candidate statuses"
        fullScreen={true}
      />
    );
  }

  return <ViewApplicants jobId={jobId} user={user} />;
}
