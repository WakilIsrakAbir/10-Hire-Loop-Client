"use client";

import React from "react";

/**
 * Metric Cards Skeleton (Row of 3 to 5 KPI cards)
 */
export function MetricCardsSkeleton({ count = 4 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4 sm:gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-3xl bg-[#141217]/70 border border-white/5 space-y-3 animate-shimmer"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-white/10 rounded-full" />
            <div className="h-4 w-10 bg-white/5 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-white/10 rounded-xl" />
          <div className="h-2.5 w-20 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Table Rows Skeleton (Used in Users, Jobs, Applications, Transactions, Companies)
 */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="rounded-3xl bg-[#141217]/70 border border-white/5 overflow-hidden p-6 space-y-4 animate-shimmer">
      {/* Table Header Placeholder */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="h-4 w-32 bg-white/10 rounded-lg" />
        <div className="h-7 w-20 bg-white/5 rounded-xl" />
      </div>

      {/* Table Rows Placeholder */}
      <div className="space-y-4 pt-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="flex items-center justify-between py-3 border-b border-white/[0.03] gap-4"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/10 shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-3.5 w-3/5 bg-white/10 rounded" />
                <div className="h-2.5 w-2/5 bg-white/5 rounded" />
              </div>
            </div>
            <div className="h-3 w-20 bg-white/5 rounded hidden sm:block" />
            <div className="h-5 w-16 bg-white/10 rounded-full" />
            <div className="h-3 w-14 bg-white/5 rounded hidden md:block" />
            <div className="h-7 w-16 bg-white/5 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Job Card Skeleton
 */
export function JobCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-7 rounded-3xl bg-[#141217]/60 border border-white/5 min-h-[260px] flex flex-col justify-between animate-shimmer space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 shrink-0" />
              <div className="h-6 w-20 bg-white/5 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-white/10 rounded-lg" />
              <div className="h-3.5 w-1/2 bg-white/5 rounded-md" />
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-4/5 bg-white/5 rounded" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="h-4 w-20 bg-white/10 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Company Card Skeleton
 */
export function CompanyCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-3xl bg-[#141217]/60 border border-white/5 min-h-[220px] flex flex-col justify-between animate-shimmer space-y-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl" />
            <div className="h-5 w-1/2 bg-white/10 rounded-lg" />
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-2/3 bg-white/5 rounded" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="h-3 w-16 bg-white/5 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Chart Widget Skeleton
 */
export function ChartSkeleton() {
  return (
    <div className="p-7 rounded-3xl bg-[#141217]/70 border border-white/5 space-y-6 animate-shimmer">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-white/10 rounded-md" />
        <div className="h-4 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="h-48 flex items-end justify-between gap-4 pt-6 px-2">
        {[40, 75, 55, 90, 60, 80].map((h, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-t-xl bg-white/5"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-2.5 w-8 bg-white/5 rounded" />
        <div className="h-2.5 w-8 bg-white/5 rounded" />
        <div className="h-2.5 w-8 bg-white/5 rounded" />
      </div>
    </div>
  );
}
