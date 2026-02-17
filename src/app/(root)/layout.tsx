import Header from "@/components/header";
import prisma from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { after } from "next/server";
import { FaCheckCircle } from "react-icons/fa";

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
    <main className="flex flex-col items-center w-full">
      {/* HERO SECTION */}
      <section>
        {/* Header */}
        <Header />

        {/* Hero Content */}
        {children}
      </section>
    </main>
  );
};

export default LandingPageLayout;
