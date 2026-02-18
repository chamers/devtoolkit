type AdminUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export default function Header({ user }: { user: AdminUser }) {
  const displayName = user?.name ?? user?.email ?? "Admin";

  return (
    <header className="mb-2 sm:mb-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 px-4 lg:px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome, {displayName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor all of your users and resources here
          </p>
        </div>

        <div className="text-sm text-slate-500">Search</div>
      </div>
    </header>
  );
}
