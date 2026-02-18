import Header from "@/components/header";
import prisma from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { after } from "next/server";

const LandingPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  // Only schedule the update when logged in (but still render the layout either way)
  if (session?.user?.id) {
    after(async () => {
      try {
        const userId = session.user.id;

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        await prisma.user.updateMany({
          where: {
            id: userId,
            lastActivityDate: { lt: today },
          },
          data: { lastActivityDate: today },
        });
      } catch (err) {
        console.error(
          "after() lastActivityDate conditional update failed:",
          err,
        );
      }
    });
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="page-container">{children}</main>
    </div>
  );
};

export default LandingPageLayout;
