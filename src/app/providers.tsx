// "use client" // This must be a Client Component
// import { ThemeProvider } from "@/components/ThemeProvider"
// import { ImageKitProvider } from "@imagekit/next"
// import { SessionProvider } from "next-auth/react";
// import React from "react" // Import React for React.ReactNode
// import { Toaster } from "sonner"
// import { auth } from "../../auth";

// export function Providers({ children }: { children: React.ReactNode }) {
//   const session = await auth(); // Get the session from the auth function
//   return (
//     <ThemeProvider>
//       <SessionProvider session={session}> {/* 👈 wrap your app here */}
//         <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}>
//           {children}
//           <Toaster richColors position="top-right" />
//         </ImageKitProvider>
//       </SessionProvider>
//     </ThemeProvider>
//   )
// }

// const Providers = async ({ children }: { children: React.ReactNode }) => {
//   const session = await auth(); // fetch session server-side

//   return (
//     <ThemeProvider>
//       {/* 👇 Client Component wrapped with server-fetched session */}
//       <SessionProvider session={session}>
//         <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}>
//           {children}
//           <Toaster richColors position="top-right" />
//         </ImageKitProvider>
//       </SessionProvider>
//     </ThemeProvider>
//   );
// };

// export default Providers;

// no "use client" here
import { auth } from "../../auth";

import React from "react";
import type { Session } from "next-auth";
import ClientProviders from "./providers.client";

const Providers = async ({ children }: { children: React.ReactNode }) => {
  const session = (await auth()) as Session | null;
  return <ClientProviders session={session}>{children}</ClientProviders>;
};

export default Providers;
