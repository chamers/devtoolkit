import GetStartedButton from "@/components/get-started-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const LandingPage = async () => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  return (
    <section className="py-16 flex justify-center h-screen">
      {JSON.stringify(session, null, 2)}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          Welcome to DevToolkit
        </h1>

        <div className="mt-6 flex justify-center">
          <GetStartedButton />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
