import Header from "@/components/header";
import { FaCheckCircle } from "react-icons/fa";

const LandingPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="flex flex-col items-center w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-screen w-[90%] max-w-screen-2xl flex flex-col">
        {/* Glow Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[40%] right-[10%] w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[1500ms]"></div>
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[3000ms]"></div>
        </div>

        {/* Header */}
        <Header />

        {/* Hero Content */}
        <div className="px-10 md:px-16 mx-auto mt-10 pb-10">{children}</div>

        {/* Badge: Responsive */}
        <div className="hidden md:block absolute bottom-8 left-8 lg:bottom-10 lg:left-10 animate-subtle-bounce">
          <div className="bg-deep-cove text-white px-2.5 py-1.5 rounded-2xl text-xs lg:text-sm flex items-center shadow-lg">
            <FaCheckCircle className="mr-1.5" />
            Responsive
          </div>
        </div>

        {/* Badge: Inspiring */}
        <div className="hidden md:block absolute top-16 right-[15%] lg:top-20 animate-subtle-bounce delay-300">
          <div className="bg-fuchsia-gem text-white px-2.5 py-1.5 rounded-2xl text-xs lg:text-sm flex items-center shadow-lg">
            <FaCheckCircle className="mr-1.5" />
            Inspiring
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPageLayout;
