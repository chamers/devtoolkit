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

const TopNav = () => {
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
            Dashboard
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <ThemeToggleMode />
        </MenubarMenu>
      </div>
    </Menubar>
  );
};
export default TopNav;
