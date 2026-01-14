import MagicLinkLoginForm from "@/components/admin/forms/magic-link-login-form";
import SignIn from "@/components/auth/sign-in";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <MagicLinkLoginForm />
        <SignIn />
      </div>
    </div>
  );
};
export default Page;
