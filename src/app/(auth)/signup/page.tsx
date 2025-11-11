"use client";
import useMounted from "@/hooks/useMounted";
import SignUp from "@/components/auth/sign-up";
import ReturnButton from "@/components/return-button";

const Page = () => {
  const mounted = useMounted();
  if (!mounted) return null; // or a skeleton spinner
  return (
    <>
      <ReturnButton href="/" label="Home" />
      <SignUp />
    </>
  );
};
export default Page;
