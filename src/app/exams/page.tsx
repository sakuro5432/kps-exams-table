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
  if (isAuth.user.forceLogout) {
    return <ForceLogout />;
  }
  const { stdCode } = isAuth.user.studentInfo;
  const { data, requestUpdateAt } = await getMyExamSchedule(stdCode);
  const cooldownStatus = checkRequestCooldown(requestUpdateAt);
  return (
    <div className="space-y-5">
      <ExamScheduleReport
        isRequestable={cooldownStatus}
        metadata={{
          name: isAuth.user.name,
          stdCode: isAuth.user.studentInfo.stdCode,
          facultyNameTh: isAuth.user.studentInfo.facultyNameTh,
          majorNameTh: isAuth.user.studentInfo.majorNameTh,
          studentStatusNameTh: isAuth.user.studentInfo.studentStatusNameTh,
        }}
        data={data}
      />
      <div>
        <Link
          href={
            "https://ead.kps.ku.ac.th/2025/index.php/nisit-m/exam-menu/5-first-exam?download=60:prakas-mk-kphs-reuxng-tarang-sxb-klang-phakh-praca-phakh-tn-pi-kar-suksa-2568-lng-wan-thi-17-krkdakhm-2568"
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
