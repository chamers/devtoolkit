// no "use client" here
//import { auth } from "../../auth";

// import React from "react";
// //import type { Session } from "next-auth";
// import ClientProviders from "./providers.client";

// const Providers = async ({ children }: { children: React.ReactNode }) => {
//   //   const session = (await auth()) as Session | null;
//   return;
//   <ClientProviders session={session}>{children}</ClientProviders>;

// };

// export default Providers;

import React from "react";
import ClientProviders from "./providers.client";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ClientProviders>{children}</ClientProviders>;
};

export default Providers;
