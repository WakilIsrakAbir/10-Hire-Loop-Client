"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import PostJob from "@/components/recruiter/PostJob";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function NewJobRoute() {
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
        message="Loading Job Creator..."
        subMessage="Preparing smart job editor and company posting allowances"
        fullScreen={true}
      />
    );
  }

  return <PostJob user={user} />;
}
