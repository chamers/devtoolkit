"use client"
import Link from "next/link"
import Image from "next/image";

import MainNavLinks from "./MainNavLinks";
import ThemeToggleMode from "./ThemeToggleMode";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from "next-auth";
import { getInitials } from "@/utils/stringHelpers";
const Header = ({ session }:{session:Session}) => {
 

  return (
    <header >
      <nav className="mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* LOGO */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Dev Toolkit</span>

          {/* Light mode logo */}
          <Image
            src="/logos/logo.png"
            alt="DevToolkit"
            className="block dark:hidden h-auto w-auto"
            width={520}
            height={80}
          />

          {/* Dark mode logo */}
          <Image
            src="/logos/logo-dark.png"
            alt="DevToolkit (dark)"
            className="hidden dark:block h-auto w-auto"
            width={520}
            height={80}
          />
          </Link>
        </div>

        {/* Hamburger menu on small screens */}
        <div className="flex lg:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <span className="sr-only">Open main menu</span>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"  data-slot="icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

       {/* Navigation Links + ThemeSwitch */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-6">
          <MainNavLinks />
         
          <Link href="/my-profile"><Avatar>
  {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
  <AvatarFallback className="bg-amber-100 font-medium">
    {getInitials(session?.user?.name ?? session?.user?.email ?? "User")}
  </AvatarFallback>
</Avatar></Link>
 <ThemeToggleMode />
        </div>
       
      </nav>
    </header>
  )
}
export default Header