"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import MainNavLinks from "./main-nav-links";
import ThemeToggleMode from "./nav/theme-toggle-mode";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

const MENU_ANIMATION_DURATION = 220; // ms – must match CSS

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { data: session, isPending } = useSession();

  const openMenu = () => {
    setIsMenuOpen(true);
    setIsClosing(false);
  };

  const startCloseMenu = () => {
    setIsClosing(true);
    // Wait for animation to finish, then unmount
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, MENU_ANIMATION_DURATION);
  };

  const handleLinkClick = () => {
    startCloseMenu();
  };

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
    <header>
      <nav
        className="
    w-full
    border-b border-slate-200/70 dark:border-slate-800
    bg-white/80 dark:bg-slate-950/70 backdrop-blur
  "
        aria-label="Global"
      >
        <div
          className="
      page-container flex h-14 items-center justify-between gap-3
    "
        >
          {/* LOGO */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Dev Toolkit</span>

              {/* Light mode logo */}
              <Image
                src="/logos/logo.png"
                alt="DevToolkit"
                className="block dark:hidden h-8 w-auto"
                width={200}
                height={32}
              />

              {/* Dark mode logo */}
              <Image
                src="/logos/logo-dark.png"
                alt="DevToolkit (dark)"
                className="hidden dark:block h-8 w-auto"
                width={200}
                height={32}
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-6">
            <MainNavLinks />

            {/* Profile / Sign-in avatar */}
            <Link href={profileHref} className="flex items-center">
              <Avatar>
                {/* If you later have user images: */}
                {/* <AvatarImage src={session?.user?.image ?? undefined} /> */}
                <AvatarFallback className="bg-amber-100 font-medium">
                  {isPending ? "…" : initials}
                </AvatarFallback>
              </Avatar>
            </Link>

            <ThemeToggleMode />
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggleMode />
            <button
              type="button"
              onClick={openMenu}
              className="-m-2.5 inline-flex items-center justify-center rounded-full p-2.5 border border-slate-200/70 dark:border-slate-700/70 bg-white/80 dark:bg-slate-900/80 shadow-sm text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label="Open main menu"
            >
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h10"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop + Mobile panel */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <button
            onClick={startCloseMenu}
            aria-hidden="true"
            className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Slide panel */}
          <div
            className={`absolute right-0 top-0 h-full w-72 sm:w-80
              bg-white/95 dark:bg-slate-900/95
              shadow-xl border-l border-slate-200/80 dark:border-slate-800
              flex flex-col
              ${isClosing ? "menu-slide-out" : "menu-slide-in"}`}
          >
            {/* Top bar with logo + close */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-200/70 dark:border-slate-800">
              <Link
                href="/"
                onClick={handleLinkClick}
                className="flex items-center gap-2"
              >
                <span className="sr-only">DevToolkit</span>
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

              <button
                onClick={startCloseMenu}
                className="inline-flex items-center justify-center rounded-full p-2 text-slate-600 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition"
                aria-label="Close main menu"
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.6"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav className="space-y-3 text-base font-medium">
                <MainNavLinks onClickLink={handleLinkClick} variant="mobile" />
              </nav>
            </div>

            {/* Bottom area: profile / sign-in */}
            <div className="border-t border-slate-200/70 dark:border-slate-800 px-5 py-4 flex items-center justify-between gap-4">
              <Link
                href={profileHref}
                onClick={handleLinkClick}
                className="flex items-center gap-3"
              >
                <Avatar>
                  {/* <AvatarImage src={session?.user?.image ?? undefined} /> */}
                  <AvatarFallback className="bg-amber-100 font-medium">
                    {isPending ? "…" : initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {profileLabel}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isLoggedIn
                      ? displayName
                      : "Access your DevToolkit account"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
