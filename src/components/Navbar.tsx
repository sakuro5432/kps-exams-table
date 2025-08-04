import { Auth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default async function Navbar() {
  const isAuth = await Auth();
  return (
    <div className="flex items-center justify-between">
      <Link href={"/exams"} className="text-2xl font-semibold">
        KPS Exams Table ✨
      </Link>
      {isAuth && (
        <div className="flex items-center gap-5">
          <div className="hidden xl:block">
            <Link
              href={"/"}
              className="hover:underline hover:underline-offset-2"
            >
              หน้าแรก
            </Link>
          </div>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
