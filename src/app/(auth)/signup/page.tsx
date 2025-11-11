"use client";
import useMounted from "@/hooks/useMounted";
import SignUp from "@/components/auth/sign-up";
import ReturnButton from "@/components/return-button";

const Page = () => {
  const mounted = useMounted();
  if (!mounted) return null; // or a skeleton spinner
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex">
          <ReturnButton href="/" label="Home" />
        </div>
        <SignUp />
      </div>
    </div>
  );
};
export default Page;
