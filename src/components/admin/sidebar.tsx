"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/resources",
    text: "All Resources",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/",
    text: "Resource Requests",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/",
    text: "Account Requests",
  },
];

type AdminUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

const Sidebar = ({ user }: { user: AdminUser }) => {
  const pathname = usePathname();

  const initialsSource = user?.name ?? user?.email ?? "User";

  return (
    <div className="sticky left-0 top-0 flex h-dvh flex-col justify-between bg-white px-5 pb-5 pt-10">
      <div>
        <div className="flex items-center justify-center border-b border-r border-gray-200 shadow-md py-6 px-2">
          <Image src="/logos/logo.png" alt="logo" height={200} width={200} />
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "flex flex-row items-center w-full gap-2 rounded-lg px-5 py-3.5 max-md:justify-center",
                    isSelected && "bg-blue-900 shadow-sm"
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={cn(
                        "object-contain",
                        isSelected && "brightness-0 invert"
                      )}
                    />
                  </div>

                  <p className={cn(isSelected ? "text-white" : "text-dark")}>
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="my-8 flex w-full flex-row gap-2 rounded-full border border-light-400 px-6 py-2 shadow-sm max-md:px-2">
        <Avatar>
          <AvatarFallback className="bg-amber-100 font-medium">
            {getInitials(initialsSource)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{user?.name ?? "Admin"}</p>
          <p className="text-xs text-light-500">{user?.email ?? ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
