"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

import PageLoader from "@/components/ui/loading/PageLoader";

export default function DashboardRootPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user.role === "recruiter") {
        router.replace("/dashboard/recruiter");
      } else {
        router.replace("/dashboard/seeker");
      }
    }
  }, [user, isPending, router]);

  return (
    <PageLoader
      message="Redirecting to your workspace..."
      subMessage="Setting up your dashboard experience"
      fullScreen={true}
    />
  );
}
