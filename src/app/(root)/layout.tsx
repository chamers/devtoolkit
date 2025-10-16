import Header from "@/components/Header";
import { FaCheckCircle } from "react-icons/fa";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { eq } from "drizzle-orm";
import { users } from "../../../database/schema";
import db from "../../../database/drizzle";
import { and, ne } from "drizzle-orm";

const LandingPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  // after(async () => {
  //   if (!session?.user?.id) return;

  //   const user = await db
  //     .select()
  //     .from(users)
  //     .where(eq(users.id, session?.user?.id))
  //     .limit(1);

  //   if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
  //     return;

  //   await db
  //     .update(users)
  //     .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
  //     .where(eq(users.id, session?.user?.id));
  // });

  after(async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) return;

      const today = new Date().toISOString().slice(0, 10);

      await db
        .update(users)
        .set({ lastActivityDate: today })
        .where(and(eq(users.id, userId), ne(users.lastActivityDate, today)));
    } catch (err) {
      console.error("after() lastActivityDate conditional update failed:", err);
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
      {/* Glow Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[40%] right-[10%] w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[1500ms]"></div>
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[3000ms]"></div>
      </div>

      <div className="flex flex-col w-[90%] max-w-screen-2xl">
        <Header session={session} />
        <div className="px-10 md:px-16 mx-auto mt-10 pb-10">{children}</div>
      </div>

      <div className="hidden md:block absolute bottom-8 left-8 lg:bottom-10 lg:left-10 animate-bounce">
        <div className="bg-neutral-900 text-white px-2.5 py-1.5 rounded-lg text-xs lg:text-sm flex items-center shadow-lg">
          <FaCheckCircle className="mr-1.5" />
          Responsive
        </div>
      </div>
      <div className="hidden md:block absolute top-16 right-[15%] lg:top-20 animate-bounce delay-300">
        <div className="bg-indigo-950 text-white px-2.5 py-1.5 rounded-lg text-xs lg:text-sm flex items-center shadow-lg">
          <FaCheckCircle className="mr-1.5" />
          Accessible
        </div>
      </div>
    </main>
  );
};
export default LandingPageLayout;
