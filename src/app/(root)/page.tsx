import GetStartedButton from "@/components/get-started-button";

const LandingPage = () => {
  return (
    <section className="py-16 flex justify-center h-screen">
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
