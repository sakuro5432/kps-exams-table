import { Auth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const isAuth = await Auth();
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">KPS Exams Table ✨</h1>
      {isAuth?.user && <SignOutButton />}
    </div>
  );
}
