import { cn } from "@/lib/utils";
import Link from "next/link"
import { usePathname } from "next/navigation";

const MainNavLinks = () => {
     const pathname = usePathname();
     const links = [
        { href: "/resources", label: "Resources" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" }  ]
  return (
    <ul className="flex flex-row items-center gap-8">
      {links.map((link) => (
        
          <Link
          key={link.href}
            href={link.href}
            className={cn(
              "text-base cursor-pointer capitalize font-medium text-muted-foreground transition hover:text-[var(--soft-amber)]",
              `${pathname === link.href && "cursor-default text-primary/70 hover:text-var[--fuchsia-gem]"}`
            )}
          >
            {link.label}
          </Link>
     
      ))}
    </ul>
  )
}
export default MainNavLinks
