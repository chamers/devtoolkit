// src/app/admin/users/loading.tsx
export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="h-9 w-32 rounded-md bg-slate-200 animate-pulse" />

      <div className="space-y-2">
        <div className="h-7 w-24 rounded-md bg-slate-200 animate-pulse" />
        <div className="h-4 w-64 rounded-md bg-slate-200 animate-pulse" />
      </div>

      <div className="animate-pulse space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded-md bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
