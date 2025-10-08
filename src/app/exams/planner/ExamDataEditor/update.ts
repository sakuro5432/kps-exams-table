"use server";

import { Auth } from "@/lib/auth";
import { schema } from "./schema";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { timeStringToMinutes } from "@/utils/date";
import UserExamModel from "@/mongoose/model/UserExam";
import LogModel, { LogAction } from "@/mongoose/model/Log";
import { ExamSchedule } from "@/lib/generated/prisma";
import { TableSource } from "@/mongoose/enum/TableSource";
import UserExamPlannerModel from "@/mongoose/model/UserExamPlanner";
import { envServer } from "@/env/server.mjs";
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
    return { message: valid.error.issues[0].message, code: "INVALID_FORMAT" };
  }

  const { id, subjectCode, room, date, sectionCode } = valid.data;
  const { id: stdCode } = isAuth.session;
  const [timeFrom, timeTo] = [
    timeStringToMinutes(valid.data.timeFrom),
    timeStringToMinutes(valid.data.timeTo),
  ];
  return await prisma.$transaction(async (tx) => {
    const isRegistered = await tx.registeredCourse.findUnique({
      where: { id, deletedAt: null },
      include: { CourseSchedule: true },
    });
    if (!isRegistered || !isRegistered.CourseSchedule) {
      return { message: "ไม่พบว่าคุณมีรายวิชานี้ในตาราง", code: "NOT_FOUND" };
    }
    const isExistExam = await tx.examSchedule.findFirst({
      where: {
        stdCode,
        subjectCode,
        deletedAt: null,
        reportBy: "STUDENT",
        sectionType: isRegistered.CourseSchedule.sectionType,
      },
    });
    let updated: {
      type: keyof typeof LogAction;
      data: ExamSchedule;
    } | null = null;
    if (isExistExam) {
      const r = await tx.examSchedule.update({
        where: {
          id: isExistExam.id,
        },
        data: {
          room,
          date,
          timeFrom,
          timeTo,
        },
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
          timeFrom,
          timeTo,
          reportBy: "STUDENT",
          sectionType: isRegistered.CourseSchedule.sectionType,
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

    if (envServer.NODE_ENV === "production") {
      // Update MongoDB cache
      await UserExamModel.findOneAndDelete({ stdCode });
      await UserExamPlannerModel.findOneAndDelete({ stdCode });
    }

    if (updated) {
      await LogModel.create({
        stdCode,
        action: updated.type,
        tableSource: TableSource.EXAM_SCHEDULE,
        pkid: updated.data.id,
        dataJson: JSON.stringify({
          ...updated.data,
          id: undefined,
          createdAt: undefined,
          deletedAt: undefined,
          studentIdRange: undefined,
          isCorrectCount: undefined,
          isIncorrectCount: undefined,
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
