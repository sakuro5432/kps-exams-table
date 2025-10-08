import { SignInForm } from "@/app/login/SignInForm";
import { redirect } from "next/navigation";
import { Auth } from "@/lib/auth";

export default async function Page() {
  const isAuth = await Auth();
  if (isAuth) redirect("/exams");
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="font-semibold text-2xl ">KPS Exams Table</h1>
        <h2 className="font-medium">เฉพาะวิทยาเขตกำแพงแสนเท่านั้น!</h2>
      </div>
      <SignInForm />
    </div>
  );
}
