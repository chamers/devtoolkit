export default function Loading() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-md bg-slate-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
