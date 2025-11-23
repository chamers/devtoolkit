import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    { href: "/resources", label: "Resources" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  const baseClasses =
    variant === "desktop"
      ? "text-base capitalize font-medium text-muted-foreground transition hover:text-[var(--soft-amber)]"
      : "block w-full rounded-lg px-3 py-2 text-base capitalize font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition";

  const activeClasses =
    variant === "desktop"
      ? "cursor-default text-primary/70"
      : "bg-slate-100/80 dark:bg-slate-800/80";

  return (
    <ul
      className={cn(
        variant === "desktop"
          ? "flex flex-row items-center gap-8"
          : "flex flex-col gap-2"
      )}
    >
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClickLink}
              className={cn(baseClasses, isActive && activeClasses)}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
export default MainNavLinks;
