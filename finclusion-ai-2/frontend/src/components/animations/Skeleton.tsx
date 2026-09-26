import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
}

export function Skeleton({ className = '', height = 'h-4', width = 'w-full', rounded = 'rounded-lg' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${height} ${width} ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card-lg p-6 space-y-4 ${className}`} aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton height="h-9" width="w-9" rounded="rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-3" width="w-2/3" />
          <Skeleton height="h-2" width="w-1/3" />
        </div>
      </div>
      <Skeleton height="h-12" width="w-1/2" />
      <Skeleton height="h-2" width="w-full" />
      <Skeleton height="h-2" width="w-4/5" />
    </div>
  );
}

export function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b" style={{ borderColor: 'var(--border-card)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-3">
          <Skeleton height="h-3" width={i === 0 ? 'w-24' : 'w-16'} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonChart({ height = 'h-40' }: { height?: string }) {
  return (
    <div className={`${height} w-full rounded-xl overflow-hidden`} aria-hidden="true">
      <div className="w-full h-full animate-shimmer" />
    </div>
  );
}
