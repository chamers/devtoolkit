import SignOut from "@/components/auth/sign-out";
import GetStartedButton from "@/components/get-started-button";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1>Welcome to DevToolkit</h1>
        <GetStartedButton />
      </div>
    </div>
  );
};
export default Page;
