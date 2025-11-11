import SignIn from "@/components/auth/sign-in";
import ReturnButton from "@/components/return-button";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex">
          <ReturnButton href="/" label="Home" />
        </div>
        <SignIn />
      </div>
    </div>
  );
};
export default Page;
