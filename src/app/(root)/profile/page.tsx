import ChangePasswordForm from "@/components/admin/forms/change-password-form";
import UpdateUserForm from "@/components/admin/forms/update-user-form";
import SignOut from "@/components/auth/sign-out";
import ReturnButton from "@/components/return-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) redirect("/signin");

  const FULL_RESOURCE_ACCESS = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      permissions: {
        resources: ["update", "delete"],
      },
    },
  });

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1>Profile</h1>
      </div>
      <div className="flex items-center gap-2">
        {session.user.role === "ADMIN" && (
          <Button size="sm" asChild>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        )}
        <SignOut />
      </div>

      <div className="text-2xl font-bold">Permissions</div>
      <div className="space-x-2">
        <Button size="sm">MANAGE OWN POSTS</Button>
        <Button size="sm" disabled={!FULL_RESOURCE_ACCESS.success}>
          MANAGE ALL POSTS
        </Button>
      </div>

      {session.user.image ? (
        <img
          src={session.user.image}
          alt="Profile Image"
          className="w-16 h-16 border border-primary rounded-md object-cover"
        />
      ) : (
        <div className="size-24 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center">
          <span className="uppercase text-lg font-bold">
            {session.user.name.slice(0, 2)}
          </span>
        </div>
      )}

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-secondary-600">
        <h3>Update User</h3>
        <UpdateUserForm
          name={session.user.name}
          image={session.user.image ?? ""}
        />
      </div>
      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-secondary-600">
        <h3>Change Password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
