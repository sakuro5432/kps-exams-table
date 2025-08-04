"use server";

import { Auth } from "@/lib/auth";
import { schema } from "./schema.z";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import UserExamModel from "@/mongoose/model/UserExam";
import LogModel, { LogAction } from "@/mongoose/model/Log";
import { TableSource } from "@/mongoose/enum/TableSource";

type ResponseCode =
  | "UNAUTHORIZED"
  | "INVALID_FORM"
  | "SUCCESS"
  | "INTERNAL_SERVER_ERROR"
  | "EXAM_NOTFOUND";
interface ResponseData {
  message: string;
  code: ResponseCode;
}

export async function update(
  prevState: any,
  formData: FormData
): Promise<ResponseData> {
  try {
    const isAuth = await Auth();
    if (!isAuth) {
      return { message: "โปรดเข้าสู่ระบบใหม่อีกครั้ง", code: "UNAUTHORIZED" };
    }
    const validForm = schema.safeParse({
      userExamId: formData.get("userExamId"),
      note: formData.get("note"),
    });
    if (!validForm.success) {
      return {
        message: validForm.error.issues[0].message,
        code: "INVALID_FORM",
      };
    }
    const { stdCode } = isAuth;
    const { userExamId, note } = validForm.data;

    const search = await prisma.userExamNote.findUnique({
      where: { userExamId },
    });
    if (search && !search.note?.trim() && !note?.trim()) {
      return { message: "ไม่พบการเปลี่ยนแปลง", code: "INVALID_FORM" };
    }

    return await prisma.$transaction(async (tx) => {
      const schedule = await tx.userExamSchedule.findUnique({
        where: { stdCode, id: userExamId, deletedAt: null },
      });
      if (!schedule) {
        return { message: "ไม่พบวิชาสอบ", code: "EXAM_NOTFOUND" };
      }
      // หา note 1 รายการที่ตรงกับ userExamId และ stdCode และยังไม่ถูกลบ
      const existingNote = await tx.userExamNote.findUnique({
        where: {
          userExamId,
          stdCode,
          deletedAt: null,
        },
      });
      if (!existingNote) {
        const created = await tx.userExamNote.create({
          data: {
            userExamId,
            note: note || null,
            stdCode,
          },
        });
      } else {
        await tx.userExamNote.update({
          where: {
            userExamId,
            stdCode,
          },
          data: {
            note: note || null,
          },
        });
      }

      const cache = await UserExamModel.findOne({ stdCode });
      if (cache) {
        const s = cache.exams.findIndex((x) => x.id === userExamId);
        if (s !== -1) {
          cache.exams[s].note = note || null;
          cache.markModified("exams");
          await cache.save();
        }
      }
      await LogModel.create({
        stdCode,
        action: LogAction.USER_EXAM_NOTE_UPDATE,
        tableSource: TableSource.USER_EXAM_NOTE,
        pkid: userExamId,
        dataJson: JSON.stringify({
          note: note || null,
        }),
      });

      revalidatePath("/exams");
      return { message: "บันทึกสำเร็จ", code: "SUCCESS" };
    });
  } catch (error) {
    return { message: "เกิดข้อผิดพลาด", code: "INTERNAL_SERVER_ERROR" };
  }
}
