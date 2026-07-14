export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="h-36 skeleton" />
      <div className="p-4 pt-8 space-y-3">
        <div className="h-5 w-2/3 skeleton" />
        <div className="h-3 w-1/3 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-4/5 skeleton" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-3 skeleton" />
          <div className="h-3 skeleton" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-3">
          <div className="h-4 w-1/4 skeleton" />
          <div className="h-4 w-1/3 skeleton" />
          <div className="h-4 w-1/5 skeleton" />
          <div className="h-4 w-1/6 skeleton" />
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="h-3 w-1/2 skeleton mb-3" />
      <div className="h-8 w-1/3 skeleton" />
    </div>
  );
}
