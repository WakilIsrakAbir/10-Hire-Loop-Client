"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import RecruiterSettings from "@/components/recruiter/RecruiterSettings";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function RecruiterSettingsRoute() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

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
        message="Loading Recruiter Settings..."
        subMessage="Preparing your company profile and account preferences"
        fullScreen={true}
      />
    );
  }

  return <RecruiterSettings user={user} refetch={refetch} />;
}
