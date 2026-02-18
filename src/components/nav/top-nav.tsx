"use client";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import Image from "next/image";
import ThemeToggleMode from "./theme-toggle-mode";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import MainNavLinks from "../main-nav-links";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

const TopNav = () => {
  const { data: session, isPending } = useSession();

  const isLoggedIn = !!session;
  const role = session?.user?.role;

  // Route + label depending on role
  const profileHref = !isLoggedIn
    ? "/signin"
    : role === "ADMIN"
      ? "/admin/dashboard"
      : "/my-profile";

  const profileLabel = !isLoggedIn
    ? "Sign in"
    : role === "ADMIN"
      ? "Admin dashboard"
      : "My profile";

  const displayName =
    session?.user?.name ??
    session?.user?.email ??
    (isLoggedIn ? "User" : "Guest");

  const initials = getInitials(displayName);

  return (
    <Menubar>
      <div className="flex-none">
        <MenubarMenu>
          {/* LOGO */}

          <Link href="/">
            <span className="sr-only">DevToolkit</span>

            {/* Light mode logo */}
            <Image
              src="/logos/logo.png"
              alt="DevToolkit"
              className="block dark:hidden h-auto w-auto"
              width={70}
              height={70}
            />

            {/* Dark mode logo */}
            <Image
              src="/logos/logo-dark.png"
              alt="DevToolkit (dark)"
              className="hidden dark:block h-auto w-auto"
              width={70}
              height={70}
            />
          </Link>
        </MenubarMenu>
      </div>
      <div className="flex grow items-center justify-end gap-1">
        <MenubarMenu>
          <MainNavLinks />
        </MenubarMenu>

        <MenubarMenu>
          <Link href={profileHref} className="flex items-center">
            <Avatar>
              {/* If you later have user images: */}
              {/* <AvatarImage src={session?.user?.image ?? undefined} /> */}
              <AvatarFallback className="bg-amber-100 font-medium">
                {isPending ? "…" : initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </MenubarMenu>

        <MenubarMenu>
          <ThemeToggleMode />
        </MenubarMenu>
      </div>
      {/* Right: mobile hamburger */}
      <div className="ml-auto flex md:hidden items-center gap-2">
        <ThemeToggleMode />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logos/logo.png"
                    alt="DevToolkit"
                    className="block dark:hidden h-8 w-auto"
                    width={200}
                    height={40}
                  />
                  <Image
                    src="/logos/logo-dark.png"
                    alt="DevToolkit (dark)"
                    className="hidden dark:block h-8 w-auto"
                    width={200}
                    height={40}
                  />
                </Link>
              </div>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-3">
              <Link className="text-base" href="/resources">
                Resources
              </Link>
              <Link className="text-base" href="/about">
                About
              </Link>
              <Link className="text-base" href="/contact">
                Contact
              </Link>

              <div className="mt-4 border-t pt-4">
                <Link href={profileHref} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-amber-100 font-medium">
                      {isPending ? "…" : initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profileLabel}</span>
                    <span className="text-xs opacity-70">
                      {isLoggedIn ? displayName : "Access your account"}
                    </span>
                  </div>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </Menubar>
  );
};
export default TopNav;
