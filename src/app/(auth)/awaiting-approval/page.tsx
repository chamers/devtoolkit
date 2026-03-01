import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AwaitingApprovalPage() {
  return (
    <div className="mx-auto max-w-lg p-8 space-y-4">
      <h1 className="text-2xl font-semibold">
        Your account is pending approval
      </h1>
      <p className="text-muted-foreground">
        You’ve verified your email. An admin still needs to approve your account
        before you can use all features.
      </p>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild>
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
