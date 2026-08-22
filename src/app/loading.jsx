import PageLoader from "@/components/ui/loading/PageLoader";

export default function RootLoading() {
  return (
    <PageLoader
      message="Loading HireLoop..."
      subMessage="Connecting to platform services..."
      fullScreen={true}
    />
  );
}
