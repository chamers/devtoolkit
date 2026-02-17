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

const TopNav = () => {
  const { data: session, isPending } = useSession();

  const isLoggedIn = !!session;
  const role = session?.user?.role;

  // Route + label depending on role
  const profileHref = !isLoggedIn
    ? "/signin"
    : role === "ADMIN"
      ? "admin/dashboard"
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
          <MenubarTrigger className="text-base font-normal">
            Resources
          </MenubarTrigger>
          <MenubarTrigger className="text-base font-normal">
            About
          </MenubarTrigger>
          <MenubarTrigger className="text-base font-normal">
            Contact
          </MenubarTrigger>
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
    </Menubar>
  );
};
export default TopNav;
