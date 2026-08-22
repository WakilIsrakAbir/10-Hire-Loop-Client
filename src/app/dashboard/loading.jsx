import PageLoader from "@/components/ui/loading/PageLoader";

export default function DashboardLoading() {
  return (
    <PageLoader
      message="Opening Dashboard..."
      subMessage="Loading your role workspace and real-time metrics"
      fullScreen={true}
    />
  );
}
