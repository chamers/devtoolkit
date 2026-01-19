import ReturnButton from "@/components/return-button";

export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="w-full flex justify-start">
          <ReturnButton href="/profile" label="Profile" />
        </div>

        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">
            ACCESS GRANTED
          </p>
        </div>
      </div>
    </div>
  );
}
