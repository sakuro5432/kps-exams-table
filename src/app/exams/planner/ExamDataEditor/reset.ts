"use server";
import { envServer } from "@/env/server.mjs";
import { Auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidateMultiPath } from "@/lib/revalidateMultiPath";
import { TableSource } from "@/mongoose/enum/TableSource";
import LogModel, { LogAction } from "@/mongoose/model/Log";
import UserExamModel from "@/mongoose/model/UserExam";
import UserExamPlannerModel from "@/mongoose/model/UserExamPlanner";

type ResponseCode =
  | "UNAUTHORIZED"
  | "SUCCESS"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR";
interface ResponseData {
  message: string;
  code: ResponseCode;
}
const todoRevalidate = ["/exams/planner", "/exams"];
export async function resetUpdate(id: string): Promise<ResponseData> {
  try {
    if (!id) {
      return { message: "Missing ID", code: "UNAUTHORIZED" };
    }

    const isAuth = await Auth();
    if (!isAuth) {
      return { message: "โปรดเข้าสู่ระบบ", code: "UNAUTHORIZED" };
    }
    const { id: stdCode } = isAuth.session;
    return await prisma.$transaction(async (tx) => {
      const validCourse = await tx.registeredCourse.findUnique({
        where: { id, deletedAt: null, stdCode },
        include: { CourseSchedule: true },
      });
      if (!validCourse) {
        revalidateMultiPath(todoRevalidate);
        return { message: "ไม่พบสิ่งที่ต้องการลบ", code: "NOT_FOUND" };
      }
      const isExistExamSchedule = await tx.examSchedule.findFirst({
        where: {
          stdCode,
          subjectCode: { startsWith: validCourse.CourseSchedule.subjectCode },
          deletedAt: null,
          reportBy: "STUDENT",
        },
        include: { UserExamSchedule: { include: { UserExamNote: true } } },
      });
      if (!isExistExamSchedule) {
        revalidateMultiPath(todoRevalidate);
        return { message: "ไม่พบสิ่งที่ต้องการลบ", code: "NOT_FOUND" };
      }

      const userExamId = isExistExamSchedule.UserExamSchedule.find(
        (x) => x.examScheduleId === isExistExamSchedule.id
      );
      if (!userExamId) {
        revalidateMultiPath(todoRevalidate);
        return { message: "ไม่พบสิ่งที่ต้องการลบ", code: "NOT_FOUND" };
      }
      await tx.examSchedule.update({
        where: { id: isExistExamSchedule.id },
        data: {
          deletedAt: new Date(),
        },
      });
      await tx.userExamSchedule.update({
        where: { id: userExamId.id },
        data: {
          deletedAt: new Date(),
        },
      });
      if (userExamId.UserExamNote.length > 0) {
        await tx.userExamNote.update({
          where: { userExamId: userExamId.id },
          data: { deletedAt: new Date() },
        });
      }

      if (envServer.NODE_ENV === "production") {
        const userExamModelCache = await UserExamModel.findOne({ stdCode });
        if (userExamModelCache) {
          const s = userExamModelCache.exams.findIndex(
            (x) => x.id === userExamId.id
          );
          if (s !== -1) {
            userExamModelCache.exams.splice(s, 1); // ลบออกจาก array
            userExamModelCache.markModified("exams");
            await userExamModelCache.save();
          }
        }
        await UserExamPlannerModel.findOneAndDelete({ stdCode });
      }

      await LogModel.create({
        stdCode,
        action: LogAction.DELETE_EXAM,
        tableSource: TableSource.EXAM_SCHEDULE,
        pkid: isExistExamSchedule.id,
      });

      revalidateMultiPath(todoRevalidate);
      return { message: "รีเซ็ตสำเร็จ", code: "SUCCESS" };
    });
  } catch (error) {
    console.log(error);
    return { message: "เกิดข้อผิดพลาด", code: "INTERNAL_SERVER_ERROR" };
  }
}
