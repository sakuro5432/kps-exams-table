import { redirect } from "next/navigation";
import { Auth } from "@/lib/auth";
import { ExamScheduleReport } from "@/components/ExamScheduleReport";
import { getMyExamSchedule } from "@/controllers/getMyExamSchedule.controller";

export default async function Page() {
  const isAuth = await Auth();
  if (!isAuth) return redirect("/login");

  const { stdCode } = isAuth.session.studentInfo;
  const { data } = await getMyExamSchedule(stdCode);

  return (
    <ExamScheduleReport
      // isRequestable={cooldownStatus}
      metadata={{
        name: isAuth.session.name,
        stdCode: isAuth.session.studentInfo.stdCode,
        facultyNameTh: isAuth.session.studentInfo.facultyNameTh,
        majorNameTh: isAuth.session.studentInfo.majorNameTh,
        studentStatusNameTh: isAuth.session.studentInfo.studentStatusNameTh,
      }}
      data={data}
    />
  );
}
