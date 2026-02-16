"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "./ui/button";
import useMounted from "@/hooks/useMounted";

export default function ThemeToggleMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="link"
      size="icon"
      disabled={!mounted}
      onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Theme toggle"
      }
      title={
        mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Theme toggle"
      }
      className="hover:text-primary"
    >
      {isDark ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
    </Button>
  );
}

// "use client";

// import { useTheme } from "next-themes";
// import { FaMoon, FaSun, FaLaptop } from "react-icons/fa";
// import { Button } from "./ui/button";
// import useMounted from "@/hooks/useMounted";

// const ThemeToggleMode = () => {
//   const { theme, resolvedTheme, setTheme } = useTheme();
//   const mounted = useMounted();

//   if (!mounted) {
//     return <Button variant="outline" disabled />;
//   }

//   // Show icon for the *next* theme to apply
//   let icon;
//   let nextTheme;

//   if (theme === "system") {
//     // Use resolvedTheme to know what's currently applied, and suggest the opposite
//     if (resolvedTheme === "dark") {
//       icon = <FaSun className="hover:text-primary" />;
//       nextTheme = "light";
//     } else {
//       icon = <FaMoon className="hover:text-primary" />;
//       nextTheme = "dark";
//     }
//   } else if (theme === "light") {
//     icon = <FaMoon className="hover:text-primary" />;
//     nextTheme = "dark";
//   } else {
//     // theme === "dark"
//     icon = <FaSun className="hover:text-primary" />;
//     nextTheme = "light";
//   }

//   const handleClick = () => {
//     // Rotate through: system → light → dark → system
//     if (theme === "system") {
//       setTheme("light");
//     } else if (theme === "light") {
//       setTheme("dark");
//     } else {
//       setTheme("system");
//     }
//   };

//   return (
//     <Button
//       variant="outline"
//       onClick={handleClick}
//       aria-label={`Toggle theme (next: ${nextTheme})`}
//       title={`Theme: ${theme} | Resolved: ${resolvedTheme}`}
//     >
//       {icon}
//     </Button>
//   );
// };

// export default ThemeToggleMode;

// "use client";

// import { useTheme } from "next-themes";
// import { FaMoon, FaSun } from "react-icons/fa";
// import { Button } from "./ui/button";
// import useMounted from "@/hooks/useMounted"; // Assuming this path is correct
// import { useState, useEffect } from 'react';

// const ThemeToggleMode = () => {
//   const { theme, setTheme } = useTheme();
//   const mounted = useMounted(); // ✅ Prevent hydration mismatch

//   // State to manage icon size dynamically
//   const [iconSize, setIconSize] = useState(20); // Default size for smaller screens

//   useEffect(() => {
//     /**
//      * Handles window resize to adjust icon size based on screen width.
//      * Tailwind's 'lg' breakpoint is typically 1024px.
//      */
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIconSize(24); // Larger size for 'lg' screens
//       } else {
//         setIconSize(20); // Default size for smaller screens
//       }
//     };

//     // Set initial size when component mounts
//     handleResize();

//     // Add event listener for window resize
//     window.addEventListener('resize', handleResize);

//     // Clean up event listener on component unmount
//     return () => window.removeEventListener('resize', handleResize);
//   }, []); // Empty dependency array ensures this effect runs only once on mount

//   // If not mounted, render a disabled button to prevent layout shift
//   // and ensure consistent UI during hydration.
//   if (!mounted) {
//     return (
//       <Button variant="outline" disabled={true}>
//         {/* You might want a placeholder icon here or just an empty span */}
//         <span className="w-5 h-5 lg:w-6 lg:h-6"></span>
//       </Button>
//     );
//   }

//   // Determine if the current theme is dark
//   const isDarkTheme = theme === "dark";

//   return (
//     <Button
//       variant="outline"
//       onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
//       aria-label="Toggle theme" // Add aria-label for accessibility
//     >
//       {isDarkTheme ? (
//         <FaSun
//           size={iconSize} // Apply dynamic size
//           className="hover:cursor-pointer hover:text-primary"
//         />
//       ) : (
//         <FaMoon
//           size={iconSize} // Apply dynamic size
//           className="hover:cursor-pointer hover:text-primary"
//         />
//       )}
//     </Button>
//   );
// };

// export default ThemeToggleMode;

// "use client";

// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import { FaMoon, FaSun } from "react-icons/fa";
// import { Button } from "./ui/button";

// const ThemeToggleMode = () => {
//   const { resolvedTheme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   // Prevent hydration mismatch
//   useEffect(() => setMounted(true), []);

//   if (!mounted) {
//     return <Button variant="outline" disabled />;
//   }

//   const isDark = resolvedTheme === "dark";

//   return (
//     <Button
//       variant="outline"
//       title={`Switch to ${isDark ? "light" : "dark"} mode`}
//       onClick={() => setTheme(isDark ? "light" : "dark")}
//     >
//       {isDark ? (
//         <FaSun className="hover:cursor-pointer hover:text-primary" />
//       ) : (
//         <FaMoon className="hover:cursor-pointer hover:text-primary" />
//       )}
//     </Button>
//   );
// };

// export default ThemeToggleMode;

// "use client";

// import { useTheme } from "next-themes";
// import {useState, useEffect} from "react";
// import { FaMoon, FaSun } from "react-icons/fa";
// import { Button } from "./ui/button";

// const ThemeToggleMode = () => {

// const [darkMode, setDarkMode] = useState(false);

// useEffect(() => {
//     if(darkMode) {
//         document.documentElement.classList.add('dark');
//     } else {
//         document.documentElement.classList.remove('dark');
//     }
// }, [darkMode]);

// const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
// }

//   return (
//     <Button
//       variant="outline"
//       onClick={toggleDarkMode}
//     >

//         {darkMode ? (
//         <FaSun className="hover:cursor-pointer hover:text-primary" />
//       ) : (
//         <FaMoon className="hover:cursor-pointer hover:text-primary" />
//       )}

//     </Button>
//   );
// };

// export default ThemeToggleMode;

// "use client";

// import { useTheme } from "next-themes";
// import { FaMoon, FaSun } from "react-icons/fa";
// import { Button } from "./ui/button";
// import useMounted from "@/hooks/useMounted";

// const ThemeToggleMode = () => {
//   const { theme, setTheme } = useTheme();

// const mounted = useMounted(); // ✅ Prevent hydration mismatch
//   if (!mounted)
//     return <Button variant="outline" disabled={true}></Button>;
//   const dark = theme === "dark";
//   return (
//     <Button
//       variant="outline"
//       onClick={() => setTheme(`${dark ? "light" : "dark"}`)}
//       title={`Switch to ${dark ? "light" : "dark"} mode`}
//     >
//       {dark ? (
//         <FaSun className="hover:cursor-pointer hover:text-primary" />
//       ) : (
//         <FaMoon className="hover:cursor-pointer hover:text-primary" />
//       )}
//     </Button>
//   );
// };

// export default ThemeToggleMode;

// "use client";

// import { useTheme } from "next-themes";
// import { FaMoon, FaSun } from "react-icons/fa";
// import { Moon, Sun } from "lucide-react";
// import { Button } from "./ui/button";
// import useMounted from "@/hooks/useMounted";

// const ThemeToggleMode = () => {
//   const { theme, setTheme } = useTheme();
//   const mounted = useMounted();
//    if (!mounted)
//     return <Button variant="outline" size="icon" disabled={true}></Button>;
//   const dark = theme === "dark";

//   return (
//     <Button
//       variant="outline"
//       size="icon"
//       onClick={() => setTheme(`${dark ? "light" : "dark"}`)}
//     >
//       {dark ? (
//         <Sun className="hover:cursor-pointer hover:text-primary" />
//       ) : (
//         <Moon className="hover:cursor-pointer hover:text-primary" />
//       )}
//     </Button>
//   );
// };

// export default ThemeToggleMode;
