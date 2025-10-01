import Sidebar from "@/components/admin/Sidebar";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Header from "@/components/admin/Header";
import db from "../../../database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "../../../database/schema";
// import styles from "./admin.module.css";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  if (!isAdmin) redirect("/");

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />
      <div className="flex w-[calc(100%-264px)] flex-1 flex-col bg-slate-100 p-5 xs:p-10">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};
export default layout;
