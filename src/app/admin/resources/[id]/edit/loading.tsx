export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="h-10 w-24 rounded bg-slate-200 animate-pulse" />

      <div className="flex flex-col gap-2">
        <div className="h-7 w-44 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-72 rounded bg-slate-200 animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="h-12 rounded bg-slate-200 animate-pulse" />
        <div className="h-12 rounded bg-slate-200 animate-pulse" />
        <div className="h-12 rounded bg-slate-200 animate-pulse" />
        <div className="h-40 rounded bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
