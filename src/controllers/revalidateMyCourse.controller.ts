import "server-only";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import { getMyCourse } from "./getMyCourse.controller";
import { uniqueBy } from "@/lib/utils";
import { getSubjectCodesFromCourses } from "@/lib/subjectCode";
import { filterExamScheduleByStudent } from "@/lib/filter";
import { envServer } from "@/env/server.mjs";
import UserExamModel from "@/mongoose/model/UserExam";

export async function revalidateMyCourse(stdCode: string, token: string) {
  try {
    let myCourse = await getMyCourse(stdCode, token);

    if (!myCourse || myCourse.length === 0) {
      throw new Error("No course data available to save.");
    }
    // กรองข้อมูลซ้ำ
    myCourse = uniqueBy(myCourse, (x) => x.sectionId);

    const sectionIds = myCourse.map((x) => x.sectionId);

    const existing = await prisma.courseSchedule.findMany({
      where: { sectionId: { in: sectionIds } },
      select: { sectionId: true },
    });

    const existingSectionIds = new Set(existing.map((x) => x.sectionId));

    const newCourseSchedules = myCourse
      .filter((x) => !existingSectionIds.has(x.sectionId))
      .map(({ stdCode, ...rest }) => rest);

    // ดึง registeredCourse ที่มีอยู่แล้ว
    const existingRegistered = await prisma.registeredCourse.findMany({
      where: {
        stdCode,
        sectionId: { in: sectionIds },
        deletedAt: null,
      },
      select: { sectionId: true },
    });

    const existingRegisteredIds = new Set(
      existingRegistered.map((x) => x.sectionId)
    );

    // กรองเฉพาะ sectionId ที่ยังไม่เคยลงทะเบียน
    const newRegisteredCourses = myCourse
      .filter((x) => !existingRegisteredIds.has(x.sectionId))
      .map((x) => ({
        stdCode,
        sectionId: x.sectionId,
      }));

    const operations: Prisma.PrismaPromise<any>[] = [];

    if (newCourseSchedules.length > 0) {
      operations.push(
        prisma.courseSchedule.createMany({
          data: newCourseSchedules,
          skipDuplicates: true,
        })
      );
    }

    operations.push(
      prisma.registeredCourse.createMany({
        data: newRegisteredCourses,
        skipDuplicates: true,
      })
    );

    await prisma.$transaction(operations);

    // STEP 2: ดึงข้อมูลใหม่อีกครั้ง (อาจลบ step นี้หากไม่จำเป็น)
    myCourse = await getMyCourse(stdCode, token);
    if (!myCourse || myCourse.length === 0) {
      throw new Error("No course data available to save.");
    }

    // กรองข้อมูลซ้ำ
    myCourse = uniqueBy(myCourse, (x) => x.sectionId);

    const subjectCodes = getSubjectCodesFromCourses(myCourse);
    // console.log(subjectCodes)
    const examSchedules = await prisma.examSchedule.findMany({
      where: {
        OR: subjectCodes.map((code) => ({
          subjectCode: {
            startsWith: code.subjectCodes,
          },
          sectionType: code.sectionType,
          sectionCode: { contains: code.sectionCode },
          deletedAt: null,
        })),
      },
    });

    const matched = filterExamScheduleByStudent(
      examSchedules,
      myCourse,
      stdCode
    );

    const dataToCreate = matched.map((x) => ({
      stdCode,
      examScheduleId: x.id,
      sectionId: x.sectionId,
    }));

    if (dataToCreate.length > 0) {
      await prisma.userExamSchedule.createMany({
        data: dataToCreate,
        skipDuplicates: true, // ป้องกัน insert ซ้ำ (ควรมี unique constraint ด้วย)
      });
      if (envServer.NODE_ENV == "production") {
        const isExists = await UserExamModel.findOne({ stdCode }).lean();
        if (isExists) {
          await UserExamModel.deleteOne({ stdCode });
        }
      }
    }
  } catch (error) {
    console.error("Detailed error in collectAndSaveMyCourse:", error);
    throw new Error("Error collecting and saving courses");
  }
}
