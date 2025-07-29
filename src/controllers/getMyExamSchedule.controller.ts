import "server-only";
import { prisma } from "../lib/db";
import { ExamScheduleType } from "@/types/schedule.types";
import { groupByDate } from "../lib/filter";
import UserExamModel from "@/mongoose/model/UserExamSchema";
import mongoConnect from "@/lib/mongoose";
import { envServer } from "@/env/server.mjs";

export async function getMyExamSchedule(stdCode: string): Promise<{
  data: Record<
    string,
    (ExamScheduleType & {
      isTimeDuplicate?: boolean;
    })[]
  >;
  requestUpdateAt: Date | null;
}> {
  await mongoConnect();
  const user = await prisma.user.findUnique({
    where: { stdCode },
    select: { requestUpdateAt: true },
  });
  const requestUpdateAt = user?.requestUpdateAt || null;
  if (envServer.NODE_ENV == "production") {
    const cache = await UserExamModel.findOne({ stdCode }).lean();
    if (cache) {
      return {
        data: groupByDate(JSON.parse(JSON.stringify(cache.exams))),
        requestUpdateAt, // หรือถ้าต้องการดึง requestUpdateAt เพิ่มเติมก็ทำได้
      };
    }
  }

  const data = await getUserExamSchedule(stdCode);
  // อัพเดตหรือสร้าง cache ใน MongoDB
  if (envServer.NODE_ENV == "production") {
    await UserExamModel.findOneAndUpdate(
      { stdCode },
      { stdCode, exams: data },
      { upsert: true, new: true }
    );
  }
  return {
    data: groupByDate(data),
    requestUpdateAt,
  };
}

async function getUserExamSchedule(
  stdCode: string
): Promise<ExamScheduleType[]> {
  return (
    await prisma.userExamSchedule.findMany({
      where: { stdCode },
      include: {
        CourseSchedule: {
          select: {
            subjectCode: true,
            subjectNameTh: true,
            teacherName: true,
          },
        },
        ExamSchedule: {
          select: {
            dateTh: true,
            date: true,
            time: true,
            studentIdRange: true,
            sectionCode: true,
            room: true,
          },
        },
      },
    })
  )
    .map(
      ({
        stdCode,
        examScheduleId,
        createdAt,
        updatedAt,
        deletedAt,
        CourseSchedule,
        ExamSchedule,
        ...rest
      }) =>
        ({
          ...rest,
          ...CourseSchedule,
          ...ExamSchedule,
        } as ExamScheduleType)
    )
    .sort((a, b) => Number(a.date) - Number(b.date));
}
