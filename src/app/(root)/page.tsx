import GetStartedButton from "@/components/get-started-button";

const LandingPage = () => {
  return (
    <section className="py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          Welcome to DevToolkit
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          Your all-in-one hub for web development tools and resources.
        </p>
        <div className="mt-6">
          <GetStartedButton />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
