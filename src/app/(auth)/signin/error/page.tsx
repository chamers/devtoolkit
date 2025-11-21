import ReturnButton from "@/components/return-button";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/signin" label="Sign in" />

        <h1> Sign-in Error</h1>
      </div>
      <p className="text-destructive">
        {sp.error === "account_not_linked"
          ? "This account is already linked to another sign-in method"
          : "Oops! Something went wrong. Please try again."}
      </p>
    </div>
    // <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
    //   <div className="w-full max-w-md space-y-6">
    //     <div className="self-start">
    //       <ReturnButton href="/signin" label="Sign in" />
    //     </div>

    //     <h1> Sign-in Error</h1>
    //   </div>
    //   <p className="text-destructive">
    //     {sp.error === "account_not_linked"
    //       ? "This account is already linked to another sign-in method"
    //       : "Oops! Something went wrong. Please try again."}
    //   </p>
    // </div>
  );
}
