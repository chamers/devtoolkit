export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="h-10 w-32 rounded bg-slate-200 animate-pulse" />

      <div className="flex flex-col gap-2">
        <div className="h-7 w-44 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded bg-slate-200 animate-pulse" />
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <div className="h-6 w-64 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
        <div className="h-10 w-48 rounded bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
