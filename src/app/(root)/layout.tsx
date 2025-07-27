import Header from "@/components/Header"


const LandingPageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="flex min-h-screen flex-col items-center w-full">
     
        <div className="flex flex-col w-[90%] max-w-screen-2xl">
               <Header />
          <div className="px-10 md:px-16 mx-auto mt-10 pb-10">
            {children}
          </div>
        </div>

    </main>)}
    export default LandingPageLayout