import { Auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExamDataEditor } from "./ExamDataEditor";
import GoBack from "@/components/GoBack";
import { getUserExamPlanner } from "@/controllers/getUserExamPlanner.controller";

export default async function Page() {
  const isAuth = await Auth();
  if (!isAuth) redirect("/login");

  const { id: stdCode } = isAuth.session;

  const result = await getUserExamPlanner(stdCode);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <GoBack />
        <h1 className="text-2xl font-semibold underline">จัดตารางสอบ</h1>
      </div>
      <h2>
        วิชาจากตารางส่วนกลางจะไม่แสดงที่นี่และจะไม่สามารถแก้ไขได้เอง
        <br />
        <span className="font-medium">ทำได้แค่โน๊ตไว้</span>
      </h2>
      <ExamDataEditor data={result} />
    </div>
  );
}
