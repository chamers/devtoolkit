import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);

//this route.ts file will now handle all authentication-related requests
// such as login, logout, registration, etc., using the better-auth library
// /api/auth/sign-in
// /api/auth/sign-out
// /api/auth/get-session
// and more, depending on your auth configuration.
