import GetStartedButton from "@/components/get-started-button";

const LandingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1>Welcome to DevToolkit</h1>
        <GetStartedButton />
      </div>
    </div>
  );
};
export default LandingPage;
