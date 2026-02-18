import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, FolderOpenDot, Mail } from "lucide-react";

type MainNavLinksProps = {
  onClickLink?: () => void;
  variant?: "desktop" | "mobile";
};

const MainNavLinks = ({
  onClickLink,
  variant = "desktop",
}: MainNavLinksProps) => {
  const pathname = usePathname();
  const links = [
    { href: "/resources", label: "Resources", icon: FolderOpenDot },
    { href: "/about", label: "About", icon: Sparkles },
    { href: "/contact", label: "Contact", icon: Mail },
  ];
  const baseClasses =
    variant === "desktop"
      ? "text-base capitalize font-medium text-muted-foreground transition hover:text-[var(--soft-amber)]"
      : "block w-full rounded-lg px-3 py-2 text-base capitalize font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition";

  const activeClasses =
    variant === "desktop"
      ? "cursor-default text-primary/70"
      : "bg-slate-100/80 dark:bg-slate-800/80";

  const iconBase = "shrink-0 transition-colors duration-200";

  const iconHover = "group-hover:text-[var(--soft-amber)]";

  const iconActive = "text-[var(--soft-amber)]";

  return (
    <ul
      className={cn(
        variant === "desktop"
          ? "flex flex-row items-center gap-8"
          : "flex flex-col gap-2",
      )}
    >
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClickLink}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                baseClasses,
                "group flex items-center gap-2", // ✅ group so icon reacts
                isActive && activeClasses,
              )}
            >
              <link.icon
                size={18}
                strokeWidth={1.8}
                className={cn(
                  iconBase,
                  iconHover,
                  isActive && [
                    iconActive,
                    "transform transition-transform duration-200",
                    "scale-[1.06] -translate-y-[0.5px]",
                  ],
                )}
              />
              <span className="relative">
                {link.label}

                {/* subtle active underline that animates in */}
                <span
                  className={cn(
                    "pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-[var(--soft-amber)] transition-transform duration-200",
                    isActive && "scale-x-100",
                  )}
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
export default MainNavLinks;
