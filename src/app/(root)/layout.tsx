import TopNav from "@/components/nav/top-nav";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
};
export default LandingPageLayout;
