type AdminUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export default function Header({ user }: { user: AdminUser }) {
  const displayName = user?.name ?? user?.email ?? "Admin";

  return (
    <header className="mb-5 sm:mb-10">
      <div className="flex items-start justify-between gap-5 px-4 lg:px-6 lg:flex-row flex-col lg:items-end">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome, {displayName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor all of your users and resources here
          </p>
        </div>

        {/* Placeholder for future search / actions */}
        <div className="text-sm text-slate-500">Search</div>
      </div>
    </header>
  );
}
