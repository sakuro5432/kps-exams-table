"use server";

import { Auth } from "@/lib/auth";
import { schema } from "./schema";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getThaiDate } from "@/utils/date";
import mongoConnect from "@/mongoose/connect";
import UserExamModel from "@/mongoose/model/UserExam";
import { envServer } from "@/env/server.mjs";
import LogModel, { LogAction } from "@/mongoose/model/Log";
import { ExamSchedule } from "@/lib/generated/prisma";
import { TableSource } from "@/mongoose/enum/TableSource";
import UserExamPlannerModel from "@/mongoose/model/UserExamPlanner";
type ResponseCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INVALID_FORMAT"
  | "SUCCESS"
  | "EXISTS";
interface ResponseData {
  message: string;
  code: ResponseCode;
}

export async function update(payload: string): Promise<ResponseData> {
  const isAuth = await Auth();
  if (!isAuth) {
    return { message: "โปรดเข้าสู่ระบบ", code: "UNAUTHORIZED" };
  }
  const valid = schema.safeParse(JSON.parse(payload));
  if (!valid.success) {
    console.log(valid.error.issues[0]);
    return { message: valid.error.issues[0].message, code: "INVALID_FORMAT" };
  }

  const { id, subjectCode, room, date, timeFrom, timeTo, sectionCode } =
    valid.data;
  const { stdCode } = isAuth;
  return await prisma.$transaction(async (tx) => {
    const isRegistered = await tx.registeredCourse.findUnique({
      where: { id, deletedAt: null },
      include: { CourseSchedule: true },
    });
    if (!isRegistered || !isRegistered.CourseSchedule) {
      return { message: "ไม่พบข้อมูลรายวิชานี้", code: "NOT_FOUND" };
    }
    const isExistExam = await tx.examSchedule.findFirst({
      where: {
        stdCode,
        subjectCode,
        deletedAt: null,
        reportBy: "STUDENT",
      },
    });
    const formattedTime = `${timeFrom.replace(":", ".")}-${timeTo.replace(
      ":",
      "."
    )}`;
    const dateTh = getThaiDate(date);
    let updated: {
      type: keyof typeof LogAction;
      data: ExamSchedule;
    } | null = null;
    if (isExistExam) {
      const r = await tx.examSchedule.update({
        where: {
          id: isExistExam.id,
        },
        data: { room, date, dateTh, time: formattedTime },
      });
      updated = { type: "UPDATE_EXAM", data: r };
    } else {
      const insertExamSchedule = await tx.examSchedule.create({
        data: {
          stdCode,
          subjectCode,
          sectionCode,
          room,
          date,
          dateTh,
          time: formattedTime,
          reportBy: "STUDENT",
        },
      });

      await tx.userExamSchedule.create({
        data: {
          stdCode,
          examScheduleId: insertExamSchedule.id,
          sectionId: isRegistered.sectionId,
        },
      });

      updated = { type: "CREATE_EXAM", data: insertExamSchedule };
    }

    // Update MongoDB cache
    await UserExamModel.findOneAndDelete({ stdCode });
    await UserExamPlannerModel.findOneAndDelete({ stdCode });

    if (updated) {
      await LogModel.create({
        stdCode,
        action: updated.type,
        tableSource: TableSource.EXAM_SCHEDULE,
        pkid: updated.data.id,
        dataJson: JSON.stringify({
          ...updated.data,
          id: undefined,
          dateTh: undefined,
          createdAt: undefined,
          deletedAt: undefined,
          studentIdRange: undefined,
          isCorrectCount: undefined,
          status: undefined,
          stdCode: undefined,
          reportBy: undefined,
          sectionType: undefined,
          sectionCode: undefined,
          subjectCode: undefined,
        }),
      });
    }

    revalidatePath("/exams/planner");
    revalidatePath("/exams");
    return { message: "แก้ไขสำเร็จ", code: "SUCCESS" };
  });
}
