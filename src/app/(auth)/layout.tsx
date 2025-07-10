
import Image from "next/image" 
const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className="relative flex flex-col-reverse sm:flex-row bg-linear-135 from-comet via-waterloo to-santas-gray p-8">
        <section className="my-auto flex h-full min-h-screen flex-1 items-center px-5 py-10"><div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[1500ms]"></div>
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow delay-[3000ms]"></div>

      </div>
      <div className="@container max-w-md w-full p-8 bg-blue-950/30 rounded-2xl shadow-[0_20px_50px_rgba(0,_29,_61,_0.7)] backdrop-blur-xl border border-blue-800/50 relative animate-fade-in">
      <div className="absolute inset-0 bg-gradient-t-br from-blue-800/20 to-transparent rounded-2xl"></div>
      <div className="relative">
        <Image src="/logos/logo.png" alt="Logo" width={150} height={100} />
        {children}
     </div>
      </div>
      </section>
      <section className="auth-illustration">
        <Image
          src="/images/bookImg1.png"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  )
}
export default layout