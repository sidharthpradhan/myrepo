export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-raised ${className}`} />;
}

export function SkeletonTable({ rows = 6 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function PageLoader() {
  return (
    <div className="flex h-full min-h-48 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}
