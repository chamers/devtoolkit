
// import Image from "next/image" 
// const layout = ({children}:{children: React.ReactNode}) => {
//   return (
//     <main className="relative flex flex-col-reverse sm:flex-row bg-linear-135 from-comet via-waterloo to-santas-gray p-8">
//         <section className="my-auto flex h-full min-h-screen flex-1 items-center px-5 py-10"><div className="absolute top-0 left-0 w-full h-full">
//         <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow"></div>
//         <div className="absolute bottom-[20%] right-[10%] w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[1500ms]"></div>
//         <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[3000ms]"></div>

//       </div>
//       <div className="@container max-w-md w-full p-8 bg-blue-950/30 rounded-2xl shadow-[0_20px_50px_rgba(0,_29,_61,_0.7)] backdrop-blur-xl border border-blue-800/50 relative animate-fade-in">
//       <div className="absolute inset-0 bg-gradient-t-br from-blue-800/20 to-transparent rounded-2xl"></div>
//       <div className="relative">
//         <Image src="/logos/logo.png" alt="Logo" width={150} height={100} />
//         {children}
//      </div>
//       </div>
//       </section>
//       <section className="auth-illustration">
//         <Image
//           src="/undraw/login.svg"
//           alt="auth illustration"
//           height={1000}
//           width={1000}
//           className="size-full object-cover"
//         />
//       </section>
//     </main>
//   )
// }
// export default layout


import Image from "next/image";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session) redirect("/");
  return (
    <main className="relative flex min-h-screen items-center justify-center flex-col-reverse sm:flex-row bg-gradient-to-br from-comet via-waterloo to-santas-gray p-6 sm:p-10 gap-6">
      {/* Glow Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[1500ms]"></div>
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[3000ms]"></div>
      </div>

      {/* Auth Form Section */}
      <section className="relative z-10 w-full max-w-md flex-1 p-8 bg-blue-950/30 rounded-2xl shadow-[0_20px_50px_rgba(0,_29,_61,_0.7)] backdrop-blur-xl border border-blue-800/50 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 to-transparent rounded-2xl" />
        <div className="relative">
          <div className="flex justify-center mb-6">
  {/* Light Logo (default theme) */}
  <Image
    src="/logos/logo.png"
    alt="Logo"
    width={200}
    height={150}
    className="w-32 sm:w-40 md:w-48 h-auto block dark:hidden"
    priority
  />

  {/* Dark Logo (dark theme) */}
  <Image
    src="/logos/logo-dark.png"
    alt="Logo (Dark Mode)"
    width={200}
    height={150}
    className="w-32 sm:w-40 md:w-48 h-auto hidden dark:block"
    priority
  />
</div>
          {children}
        </div>
      </section>

      {/* Illustration Section */}
      <section className="relative z-10 flex-1 max-w-md w-full hidden sm:block">
        <Image
          src="/undraw/login.svg"
          alt="auth illustration"
          width={500}
          height={500}
          className="w-full h-auto object-contain"
        />
      </section>
    </main>
  );
};

export default layout;
