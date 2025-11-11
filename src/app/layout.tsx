import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Thin.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Poppins-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "./fonts/Poppins-ExtraLight.ttf", weight: "200", style: "normal" },
    {
      path: "./fonts/Poppins-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    { path: "./fonts/Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Poppins-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    {
      path: "./fonts/Poppins-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    {
      path: "./fonts/Poppins-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Poppins-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
    {
      path: "./fonts/Poppins-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    { path: "./fonts/Poppins-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/Poppins-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-sans",
});

const crimsonPro = localFont({
  src: [{ path: "./fonts/CrimsonPro-VariableFont_wght.ttf", style: "normal" }],
  display: "swap",
  variable: "--serif-regular",
});

const robotMono = localFont({
  src: [{ path: "./fonts/RobotoMono-VariableFont_wght.ttf", style: "normal" }],
  display: "swap",
  variable: "--font-mono",
});

const robotoCondensed = localFont({
  src: [
    { path: "./fonts/RobotoCondensed-VariableFont_wght.ttf", style: "normal" },
  ],
  display: "swap",
  variable: "--font-condensed",
});

const GaramondItalic = localFont({
  src: [
    {
      path: "./fonts/EBGaramond-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--serif-italic",
});

const caveat = localFont({
  src: [{ path: "./fonts/Caveat-VariableFont_wght.ttf", style: "normal" }],
  display: "swap",
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "DevToolkit: Your All-in-One Web Dev Resources Hub",
  description:
    "DevToolkit empowers developers of all levels to build web applications faster and easier. It provides a comprehensive suite of tools for front-end development, back-end development, digital design and code management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${poppins.className} ${crimsonPro.variable} ${robotMono.variable} ${robotoCondensed.variable} ${GaramondItalic.variable} ${caveat.variable} bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
