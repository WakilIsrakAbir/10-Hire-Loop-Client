"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import SubscriptionBilling from "@/components/recruiter/SubscriptionBilling";
import PageLoader from "@/components/ui/loading/PageLoader";

export default function RecruiterBillingRoute() {
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
        message="Loading Recruiter Billing..."
        subMessage="Fetching your active posting limits and invoice records"
        fullScreen={true}
      />
    );
  }

  return <SubscriptionBilling user={user} />;
}
