import "server-only";
import { prisma } from "@/lib/db";
import { UserPlannerData } from "@/types/userExamPlanner.types";
import UserExamPlannerModel from "@/mongoose/model/UserExamPlanner";

interface Props {
  stdCode: string;
}
async function getPlannerData({ stdCode }: Props): Promise<UserPlannerData[]> {
  const exceptIDs = await prisma.userExamSchedule.findMany({
    where: {
      stdCode,
      deletedAt: null,
      NOT: { ExamSchedule: { reportBy: "STUDENT" } },
    },
    select: { sectionId: true },
  });

  const registeredCourse = await prisma.registeredCourse.findMany({
    where: {
      stdCode,
      NOT: { sectionId: { in: exceptIDs.map((x) => x.sectionId) } },
      deletedAt: null,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      stdCode: true,
    },
    include: {
      CourseSchedule: true,
    },
  });

  const planByUser = await prisma.userExamSchedule.findMany({
    where: {
      stdCode,
      deletedAt: null,
      ExamSchedule: { NOT: { reportBy: "SYSTEM" } },
    },
    include: {
      ExamSchedule: {
        select: { date: true, dateTh: true, room: true, time: true },
      },
    },
  });

  const result: UserPlannerData[] = registeredCourse.map((x) => {
    let schedule: UserPlannerData["schedule"] = null;
    const s = planByUser.find((y) => y.sectionId === x.sectionId);
    if (s) {
      schedule = {
        date: s.ExamSchedule.date,
        dateTh: s.ExamSchedule.dateTh,
        room: s.ExamSchedule.room,
        time: s.ExamSchedule.time,
      };
    }
    return {
      id: x.id,
      sectionCode: x.CourseSchedule.sectionCode,
      sectionId: x.sectionId,
      subjectNameTh: x.CourseSchedule.subjectNameTh,
      teacherName: x.CourseSchedule.teacherName,
      subjectCode: x.CourseSchedule.subjectCode,
      sectionType: x.CourseSchedule.sectionType,
      schedule,
    };
  });

  return result;
}
export async function getUserExamPlanner(stdCode: string) {
  const cached = await UserExamPlannerModel.findOne({ stdCode }).lean();
  if (cached) return cached.exams;
  // fallback ไป query จาก SQL + สร้าง cache
  const exams = await getPlannerData({ stdCode });
  await UserExamPlannerModel.create({ stdCode, exams });
  return exams;
}
