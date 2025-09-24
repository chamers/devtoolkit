import Sidebar from "@/components/admin/Sidebar";
import { auth } from "../../../auth"
import { redirect } from "next/navigation";
import Header from "@/components/admin/Header";
// import styles from "./admin.module.css";


const layout = async ({children}: {children: React.ReactNode}) => {
    const session = await auth();
    if(!session?.user?.id) redirect('/signin')

  return (
    <main className="flex min-h-screen w-full flex-row">
        <Sidebar session={session} />
        <div className="flex w-[calc(100%-264px)] flex-1 flex-col bg-slate-100 p-5 xs:p-10">
            <Header session={session} />
            {children}
        </div>
    </main>
  )
}
export default layout