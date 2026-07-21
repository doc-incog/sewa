interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = "", count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-lg shimmer-bg ${className}`}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl shimmer-bg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded shimmer-bg" />
          <div className="h-3 w-1/2 rounded shimmer-bg" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded shimmer-bg" />
        <div className="h-3 w-2/3 rounded shimmer-bg" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full shimmer-bg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 rounded shimmer-bg" />
              <div className="h-3 w-1/3 rounded shimmer-bg" />
            </div>
            <div className="h-6 w-16 rounded-full shimmer-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-card animate-pulse">
          <div className="h-3 w-1/2 rounded shimmer-bg mb-3" />
          <div className="h-7 w-1/3 rounded shimmer-bg" />
        </div>
      ))}
    </div>
  );
}
