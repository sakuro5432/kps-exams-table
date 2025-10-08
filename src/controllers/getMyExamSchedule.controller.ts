import "server-only";
import { prisma } from "../lib/db";
import UserExamModel from "@/mongoose/model/UserExam";
import { envServer } from "@/env/server.mjs";
import { ExamScheduleDataType } from "@/types/schedule.types";

export async function getMyExamSchedule(stdCode: string): Promise<{
  data: ExamScheduleDataType[];
  // requestUpdateAt: Date | null;
}> {
  // const user = await prisma.user.findUnique({
  //   where: { stdCode },
  //   select: { requestUpdateAt: true },
  // });
  // const requestUpdateAt = user?.requestUpdateAt || null;
  if (envServer.NODE_ENV == "production") {
    const cache = await UserExamModel.findOne({ stdCode }).lean();
    if (cache) {
      return {
        data: cache.exams,
        // requestUpdateAt, // หรือถ้าต้องการดึง requestUpdateAt เพิ่มเติมก็ทำได้
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
    data: data,
    // requestUpdateAt,
  };
}

async function getUserExamSchedule(
  stdCode: string
): Promise<ExamScheduleDataType[]> {
  const data = await prisma.userExamSchedule.findMany({
    where: { stdCode, deletedAt: null },
    include: {
      UserExamNote: {
        take: 1,
      },
      CourseSchedule: {
        select: {
          sectionType: true,
          subjectCode: true,
          subjectNameTh: true,
          teacherName: true,
        },
      },
      ExamSchedule: {
        select: {
          date: true,
          timeFrom: true,
          timeTo: true,
          studentIdRange: true,
          sectionCode: true,
          room: true,
        },
      },
    },
  });
  return data
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
          sectionType: CourseSchedule.sectionType,
          note: rest.UserExamNote.at(0)?.note || null,
        } as ExamScheduleDataType)
    )
    .sort((a, b) => Number(a.date) - Number(b.date));
}
