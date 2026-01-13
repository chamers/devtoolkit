- remove files from `public/*`
- clear `globals.css`
- clear `page.tsx`
- install `npx shadcn@latest init`
- install components `npx shadcn@latest add button label input sonner`
- show button and test `dev` server

== PART 1 ==

- install Better Auth `npm install better-auth`
- create `.env` and set Environment Variables
- create `lib/auth.ts`
- setup `postgres` database with `neon.tech`
- install prisma `npm install prisma --save-dev`
- initialise prisma `npx prisma init`
- create **Post** Model
- push database changes `npx prisma db push`
- add `generated` to `.gitignore`
- adjust **scripts** in package.json

- create single Prisma Client in `lib/prisma.ts`
- setup prisma adapter with better-auth
- generate aut tables `npx @better-auth/cli generate --output=auth.schema.prisma`
- make tweaks to `schema.prisma`
- quick walkthrough the models:
  - `User`
  - `Session`
  - `Account`
  - `Verification`
- push database changes `npx prisma db push`
- better use `npx prisma migrate dev --name init_full_auth_schema`
- create Mount Handler in `app/api/auth/[...all]/route.ts`
- adjust `eslist.config.mjs` to ignore `/src/generated/**/*`
- create Client instance in `lib/auth-client.ts`
- Enable Email & Password Authentication
- Create Sign UP Page PT1
  - Create Form `components/register-form.tsx`
  - Log Form Values
- Setup Sonner
- Create Sign Up Page PT2
  - Add Form Validation
  - Destructure SignUP Function
  - Showcase `OnError`
- OPTIONS - **minPasswordLenghts**
- Create Sign Uppage PT3
  - Sign Up _default automatically signs in the user_
- Show Session on Profile Page
- Show Data in Neon Dashboard
- Sign Out User
- Show Data in Neon Dashboard
  - Destructure SignOut Function
  - Show Removed Cookies
- Create Sign In Page PT1
  - Create Form `components/login-form.tsx`
  - Log Form Values
  - Destructure SignIn Function
- Show Unauthorized on Profile Page
- Create Sign In Page PT2
  - Showcas `onError`
  - Sign In User
- Finish PART 1

== PART 2 ==

- Showcase `onRequest` and `onResponse`
- Showcase Full Cycle Again
- Add Convenience Links for Auth pages
- OPTIONS - **autoSignIn**
  - Showcase
- OPTIONS - **advanced.database.generateId**
  - Table IDs (change `schema.prisma` and push)
  - Showcase
  - Truncate Tables
- OPTIONS - **emailAndPassword.password**
  - Create User
  - Argon2 `npm install @node-rs/argon2`
  - Add to `next.config.ts`
  - Create Utilities `lib/argon2.ts`
  - Add to `lib/auth.ts`
  - Showcase
  - Truncate Tables
- Create User
- Sign Up User via SERVER ACTIONS
  - create Action
  - Log Form Values
  - Sign Up User on Server
- Sign In User via SERVER ACTIONS PT1 **HERE HERE HERE**
  - Create Action
  - Log Form Values
  - Sign IN User on Server
  - Showcase - No Cookies
  - Manually Set Cookies
  - Showcase- Cookies
- Get Additional Session Properties
- PLUGINS - **nextCookies()**
- FINISH PART2

== PART 3 ==

- Get Session on Client
  - Create Get Started Button
  - destructure useSession
  - Showcase
- OPTIONS - **session.expiresIn**
  - Change to 15 seconds
  - Showcase
  - Change to 30 days
- Middleware
  - Check for existence of a session cookie
  - Showcase on auth routes
- Error Handling
- Hooks
  - Validate Email's domain
  - Transform Name
- FINISH PART3

== PART 4 ==

- Roles (Custom Method)
- Prisma
  - Add UserRole Enum
  - Push changes `npx prisma db push`
- User
  - Show filed is added because of `@default`
  - Truncate Tables
  - Create new User
- Profile PT1
  - Show role is not typed in `session.user`
- OPTIONS - **user.additionalFields**
  - Showcase `input` option
- Profile PT2
  - Show role is now typed and added to `session.user`
- ISSUE: Client Session has no Context of the Role
  - Cute circle on `get-started-button.tsx`
  - InferAdditionalFields plugin on Client
- Admin Panel
  - Create Page / Link
  - Manually Change Role
  - Update Middleware
  - Guard `/admin/dashboard`
  - List Users With Prisma Query
  - Delete User With Prisma Query
- Database Hooks

== PART 5 ==

- Google OAuth
  - Create Buttons
- Github OAuth
- Account Linking
- Error Handling
  - `/auth/login/error`

== PART 6 ==

- Nodemailer
  - Create Template
- Verify Email
  - `emailAndPassword.requireEmailVerification`
  - `emailVerification`
  - Handle Error / Expired `/auth/verify`
  - Destructure sendVerificationEmail
  - Handle Signin Page Not Verified
- Create Resource Sing Up Page
  - Show case
- Forgot Password
  - Page / Form / Success
- Reset Password
  - Page / Form / Success
  - Showcase
- FINISH PART 6

== PART 6 ==

- Show the image
- Updating user
  - Change name / image
  - Update hook
- Custom sessions
  - Type inference for plugins workaround
- PLUGINS - **Magic Link**
  - Add to client instance
  - Create UI
  - Adjust hooks
- Cookie Cache
- FINISH PART 7
