import "server-only";
import { prisma } from "@/lib/db";
import { UserExamPlannerData } from "@/types/userExamPlanner.types";
import UserExamPlannerModel from "@/mongoose/model/UserExamPlanner";
import { $Enums } from "@/lib/generated/prisma";
import { envServer } from "@/env/server.mjs";

interface Props {
  stdCode: string;
}
async function getPlannerData({ stdCode }: Props): Promise<UserExamPlannerData[]> {
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
      ExamSchedule: {
        reportBy: { notIn: ["ADMIN", "SEED"] },
      },
    },
    include: {
      ExamSchedule: {
        select: { date: true, room: true, timeFrom: true, timeTo: true },
      },
    },
  });

  const result: UserExamPlannerData[] = registeredCourse.map((x) => {
    let schedule: UserExamPlannerData["schedule"] = null;
    const s = planByUser.find((y) => y.sectionId === x.sectionId);
    if (s) {
      schedule = {
        date: s.ExamSchedule.date,
        room: s.ExamSchedule.room,
        timeFrom: s.ExamSchedule.timeFrom,
        timeTo: s.ExamSchedule.timeTo,
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
  if (envServer.NODE_ENV === "production") {
    const cached = await UserExamPlannerModel.findOne({ stdCode }).lean();
    if (cached) {
      return cached.exams.map((x) => ({
        ...x,
        sectionType: x.sectionType as $Enums.SectionType,
      }));
    }
  }
  // fallback ไป query จาก SQL + สร้าง cache
  const exams = await getPlannerData({ stdCode });
  if (envServer.NODE_ENV === "production") {
    await UserExamPlannerModel.create({ stdCode, exams });
  }
  return exams;
}
