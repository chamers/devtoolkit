import Header from "@/components/admin/header";
import Sidebar from "@/components/admin/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) redirect("/signin");

  // Single source of truth: only admins can access /admin/*
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <main className="flex min-h-screen w-full">
      <Sidebar user={session.user} />
      <div className="flex-1">
        <Header user={session.user} />
        <div className="p-4">{children}</div>
      </div>
    </main>
  );
}
