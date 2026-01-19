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
  { img: "/icons/admin/home.svg", route: "/admin/dashboard", text: "Home" },
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
    img: "/icons/admin/user.svg",
    route: "/admin/requests/accounts",
    text: "Account Requests",
  },
];

const Sidebar = ({ user }: { user: AdminUser }) => {
  const pathname = usePathname();
  const initialsSource = user?.name ?? user?.email ?? "User";

  return (
    <aside
      className={cn(
        // layout
        "sticky left-0 top-0 flex h-dvh flex-col justify-between border-r border-gray-200 bg-white shadow-sm",
        // responsive width
        "w-16 px-2 pb-4 pt-6 md:w-72 md:px-5 md:pb-5 md:pt-8"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center md:mb-10">
          {/* On mobile, smaller logo */}
          <Image
            src="/logos/logo.png"
            alt="logo"
            height={120}
            width={120}
            className="hidden object-contain md:block"
            priority
          />
          <Image
            src="/logos/logo.png"
            alt="logo"
            height={32}
            width={32}
            className="block object-contain md:hidden"
            priority
          />
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-2">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.route}
                className="group"
                aria-label={link.text}
                title={link.text} // helpful on desktop + some mobile long-press
              >
                <div
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-200 ease-in-out",
                    // mobile: centered icon button
                    "justify-center px-0 py-3",
                    // desktop: icon + text row
                    "md:justify-start md:gap-3 md:px-4",
                    isSelected
                      ? "bg-blue-900 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-900"
                  )}
                >
                  <div className="relative size-5 shrink-0">
                    <Image
                      src={link.img}
                      alt=""
                      fill
                      className={cn(
                        "object-contain transition-all",
                        isSelected
                          ? "brightness-0 invert"
                          : "opacity-70 group-hover:opacity-100 group-hover:brightness-0 group-hover:sepia group-hover:hue-rotate-[200deg] group-hover:saturate-200"
                      )}
                    />
                  </div>

                  {/* Text: hidden on mobile, visible on md+ */}
                  <p
                    className={cn(
                      "hidden md:block font-medium text-sm whitespace-nowrap transition-colors",
                      isSelected
                        ? "text-white"
                        : "text-slate-600 group-hover:text-blue-900"
                    )}
                  >
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer user */}
      <div
        className={cn(
          "mt-auto flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm",
          "p-2 md:p-3"
        )}
      >
        <Avatar className="size-9 shrink-0 border-2 border-white shadow-sm">
          <AvatarFallback className="bg-blue-100 text-blue-900 font-semibold text-xs">
            {getInitials(initialsSource)}
          </AvatarFallback>
        </Avatar>

        {/* Hide name/email on mobile */}
        <div className="hidden md:flex md:flex-col md:truncate">
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
