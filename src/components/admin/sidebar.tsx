"use client";

import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

type AdminUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type AdminSidebarLink = {
  img: string;
  route: string;
  text: string;
};

const adminSideBarLinks: AdminSidebarLink[] = [
  { img: "/icons/admin/home.svg", route: "/admin", text: "Home" },
  { img: "/icons/admin/users.svg", route: "/admin/users", text: "All Users" },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/resources",
    text: "All Resources",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/requests/resources",
    text: "Resource Requests",
  },
  {
    img: "/icons/admin.user.svg",
    route: "/admin/requests/accounts",
    text: "Account Requests",
  },
];

const Sidebar = ({ user }: { user: AdminUser }) => {
  const pathname = usePathname();
  const initialsSource = user?.name ?? user?.email ?? "User";

  return (
    <aside className="sticky left-0 top-0 flex h-screen w-72 flex-col justify-between border-r border-gray-200 bg-white px-5 pb-5 pt-8 shadow-sm max-md:hidden">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="mb-10 px-2 flex items-center justify-center">
          <Image
            src="/logos/logo.png"
            alt="logo"
            height={200} // Adjusted for better sidebar fit
            width={200}
            className="object-contain"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-1 flex-col gap-2">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route} className="group">
                <div
                  className={cn(
                    "flex flex-row items-center w-full gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out",
                    isSelected
                      ? "bg-blue-900 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-900"
                  )}
                >
                  <div className="relative size-5 shrink-0">
                    <Image
                      src={link.img}
                      alt={link.text}
                      fill
                      className={cn(
                        "object-contain transition-all",
                        isSelected
                          ? "brightness-0 invert"
                          : "opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:sepia group-hover:hue-rotate-[200deg] group-hover:saturate-200"
                      )}
                    />
                  </div>

                  <p className="font-medium text-sm whitespace-nowrap">
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="mt-auto flex w-full flex-row items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 shadow-sm">
        <Avatar className="size-9 shrink-0 border-2 border-white shadow-sm">
          <AvatarFallback className="bg-blue-100 text-blue-900 font-semibold text-xs">
            {getInitials(initialsSource)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col truncate">
          <p className="text-sm font-bold text-slate-800 truncate">
            {user?.name ?? "Admin"}
          </p>
          <p className="text-[10px] font-medium text-slate-500 truncate">
            {user?.email ?? ""}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
