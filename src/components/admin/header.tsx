type AdminUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export default function Header({ user }: { user: AdminUser }) {
  const displayName = user?.name ?? user?.email ?? "Admin";

  return (
    <header className="flex items-start justify-between gap-5 sm:mb-10 mb-5 lg:flex-row flex-col lg:items-end">
      <div>
        <h2 className="text-xl font-semibold">Welcome, {displayName}</h2>
        <p className="text-base text-slate-500">
          Monitor all of your users and resources here
        </p>
      </div>

      {/* Placeholder: swap with a real search input later */}
      <p className="text-sm text-slate-500">Search</p>
    </header>
  );
}
