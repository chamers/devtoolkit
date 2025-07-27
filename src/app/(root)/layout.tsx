import Header from "@/components/Header"


const LandingPageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
       {/* Glow Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[40%] right-[10%] w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[1500ms]"></div>
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[3000ms]"></div>
      </div>
     
        <div className="flex flex-col w-[90%] max-w-screen-2xl">
               <Header />
          <div className="px-10 md:px-16 mx-auto mt-10 pb-10">
            {children}
          </div>
        </div>

    </main>)}
    export default LandingPageLayout