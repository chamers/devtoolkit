export default function Loading() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>

      <div className="animate-pulse space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded-md bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
