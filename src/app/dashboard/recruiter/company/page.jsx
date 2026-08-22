"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import MyCompany from "@/components/recruiter/MyCompany";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function RecruiterCompanyRoute() {
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
        message="Loading Company Workspace..."
        subMessage="Preparing corporate profile and team verification"
        fullScreen={true}
      />
    );
  }

  return <MyCompany user={user} />;
}
