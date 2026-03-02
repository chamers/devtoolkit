import ChangePasswordForm from "@/components/admin/forms/change-password-form";
import UpdateUserForm from "@/components/admin/forms/update-user-form";
import SignOut from "@/components/auth/sign-out";
import ReturnButton from "@/components/return-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { requireApproved } from "@/lib/require-approved";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Page() {
  const session = await requireApproved();
  const headersList = await headers();

  const FULL_RESOURCE_ACCESS = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      permissions: {
        resources: ["update", "delete"],
      },
    },
  });

  const initials = (session.user.name ?? session.user.email).slice(0, 2);

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-8 py-16">
      <div className="space-y-4">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-4xl font-bold">Profile</h1>
      </div>

      <div className="flex items-center gap-2">
        {session.user.role === "ADMIN" && (
          <Button size="sm" asChild>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        )}
        <SignOut />
      </div>

      <hr />

      <div className="space-y-4">
        <div className="text-2xl font-bold">Permissions</div>
        <div className="flex gap-2">
          <Button size="sm">MANAGE OWN RESOURCES</Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!FULL_RESOURCE_ACCESS.success}
          >
            MANAGE ALL RESOURCES
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-xl font-semibold">Profile Picture</div>
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="Profile Image"
            className="h-24 w-24 rounded-md border border-primary object-cover"
          />
        ) : (
          <div className="flex size-24 items-center justify-center rounded-md border border-primary bg-primary text-primary-foreground">
            <span className="text-2xl font-bold uppercase">{initials}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="h-full space-y-4 rounded-md border border-t-8 border-secondary-600 p-4 shadow-sm">
          <h3 className="text-lg font-bold">Update User Details</h3>
          <UpdateUserForm
            name={session.user.name}
            image={session.user.image ?? ""}
          />
        </div>

        <div className="h-full space-y-4 rounded-md border border-t-8 border-secondary-600 p-4 shadow-sm">
          <h3 className="text-lg font-bold">Security</h3>
          <ChangePasswordForm />
        </div>
      </div>

      {process.env.NODE_ENV !== "production" && (
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500">
            Session Debug Information
          </h3>
          <div className="max-h-96 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-emerald-400">
            <pre className="text-xs font-mono">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
