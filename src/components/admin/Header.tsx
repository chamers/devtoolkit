import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="flex lg:items-end items-start justify-between lg:flex-row flex-col gap-5 sm:mb-10 mb-5">
      <div>
        <h2>Welcome, {session?.user?.name}</h2>
        <p className="text-base text-slate-500">Monitor all of your users and resources here</p>
      </div>
      <p>Search</p>
    </header>
  )
}
export default Header