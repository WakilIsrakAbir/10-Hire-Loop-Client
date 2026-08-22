import { CompanyCardSkeleton } from "@/components/ui/loading/ShimmerSkeleton";

export default function CompaniesLoading() {
  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="space-y-3">
          <div className="h-8 w-60 bg-white/10 rounded-xl" />
          <div className="h-4 w-80 bg-white/5 rounded-md" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="p-4 rounded-2xl bg-[#141217] border border-white/5 flex gap-3">
          <div className="h-10 flex-1 bg-white/5 rounded-xl" />
          <div className="h-10 w-28 bg-white/5 rounded-xl hidden sm:block" />
        </div>

        {/* Company Cards Skeletons */}
        <CompanyCardSkeleton count={6} />
      </div>
    </div>
  );
}
