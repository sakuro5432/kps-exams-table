import { redirect } from "next/navigation";
import { Auth } from "@/lib/auth";
import { ExamScheduleReport } from "@/components/ExamScheduleReport";
import { ForceLogout } from "@/components/ForceLogout";
import { getMyExamSchedule } from "@/controllers/getMyExamSchedule.controller";
import { checkRequestCooldown } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  const isAuth = await Auth();
  if (!isAuth) return redirect("/login");
  if (isAuth.session.forceLogout) {
    return <ForceLogout />;
  }
  const { stdCode } = isAuth.session.studentInfo;
  const { data, requestUpdateAt } = await getMyExamSchedule(stdCode);
  const cooldownStatus = checkRequestCooldown(requestUpdateAt);
  return (
    <div className="space-y-5">
      <ExamScheduleReport
        isRequestable={cooldownStatus}
        metadata={{
          name: isAuth.session.name,
          stdCode: isAuth.session.studentInfo.stdCode,
          facultyNameTh: isAuth.session.studentInfo.facultyNameTh,
          majorNameTh: isAuth.session.studentInfo.majorNameTh,
          studentStatusNameTh: isAuth.session.studentInfo.studentStatusNameTh,
        }}
        data={data}
      />
      <div>
        <Link
          href={
            "https://ead.kps.ku.ac.th/2025/index.php/nisit-m/exam-menu/5-first-exam"
          }
          target="_blank"
          className="underline"
        >
          ตารางกลาง
        </Link>
        ,
      </div>
    </div>
  );
}
