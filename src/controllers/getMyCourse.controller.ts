import "server-only";
import { decodeAccessToken } from "@/lib/auth";
import { app } from "@/lib/myku";
import { prisma } from "@/lib/db";
import { $Enums, CourseSchedule } from "@/lib/generated/prisma";
import { targetSemester, academicYear } from "@/constant";

type CourseScheduleWithoutTimestamps = Omit<
  CourseSchedule,
  "createdAt" | "updatedAt" | "deletedAt"
> & {
  stdCode: string;
};
export async function getMyCourse(
  stdCode: string,
  token: string
): Promise<CourseScheduleWithoutTimestamps[] | null> {
  try {
    const registeredCourse = await prisma.registeredCourse.findMany({
      where: { stdCode, deletedAt: null, CourseSchedule: { deletedAt: null } },
      include: {
        CourseSchedule: {
          omit: { createdAt: true, updatedAt: true, deletedAt: true },
        },
      },
    });
    if (registeredCourse.length > 0)
      return registeredCourse.map(({ ...rest }) => ({
        ...rest.CourseSchedule,
        stdCode,
      }));
    const { stdid: stdId } = decodeAccessToken(token);
    // const isRefresh = await app.query(token, stdId).refreshCourseData(); // refresh data in backend of source app
    // if (env.NODE_ENV === "production") {
    //   await LogModel.create({
    //     stdCode,
    //     action: LogAction.REFRESH_COURSE_DATA,
    //     success: isRefresh.data.code === "success",
    //     ...(isRefresh.data.code !== "success" && {
    //       detail: isRefresh.data.message,
    //     }),
    //   });
    // }
    const res = await app
      .query(stdId)
      .getEnrollSubject(
        targetSemester.toString(),
        academicYear.toString(),
        token
      );
    if (res?.data.code !== "success")
      throw new Error("ไม่สามารถดึงข้อมูลตารางเรียนได้");
    if (
      !res?.data.enrollSubjects ||
      !Array.isArray(res.data.enrollSubjects) ||
      res.data.enrollSubjects.length === 0
    ) {
      throw new Error("ไม่พบการลงทะเบียนเรียนวิชาใดๆ (1)");
    }

    const data = res.data.enrollSubjects.filter(
      (c) => c.approveStatus === "A" && c.enrollStatus === "A"
    );
    if (data.length === 0) {
      throw new Error(`ไม่พบการลงทะเบียนเรียนวิชาใดๆ (2)`);
    }

    // 1. ดึง sectionId ออกมาให้ชัด
    const sectionIdAndSubjectCodes = data.map((x) => x.sectionId);
    // 2. ยิง API พร้อมกัน + ผูก sectionId ไปกับ response
    const sectionDetailMap = new Map<
      number,
      Awaited<
        ReturnType<ReturnType<typeof app.query>["getSubjectDetail"]>
      >["data"]["sectionDetail"]
    >();

    await Promise.all(
      sectionIdAndSubjectCodes.map(async (sectionId) => {
        const res = await app
          .query(stdId)
          .getSubjectDetail(sectionId.toString(), token);

        if (res.data.code === "success" && res.data.sectionDetail) {
          sectionDetailMap.set(sectionId, res.data.sectionDetail);
        }
      })
    );

    // 3. ตรวจว่ามีข้อมูลจริง
    if (sectionDetailMap.size === 0) {
      throw new Error("ไม่พบการลงทะเบียนเรียนวิชาใดๆ (3)");
    }
    const result: CourseScheduleWithoutTimestamps[] = data.flatMap((course) => {
      const detail = sectionDetailMap.get(course.sectionId);
      if (!detail) return [];

      return [
        {
          sectionId: course.sectionId,
          subjectCode: course.subjectCode,
          subjectNameTh: course.subjectNameTh,
          sectionCode: course.sectionCode,
          teacherName: detail.teacher.map((x) => x.nameTh.trim()).join(","),
          sectionType:
            course.sectionType === "16902"
              ? $Enums.SectionType.LAB
              : $Enums.SectionType.LECT,
          stdCode,
        },
      ];
    });
    // console.log(result);
    return result;
  } catch (error) {
    // if (error instanceof AxiosError) {
    //   console.log(error.request);
    // }
    throw error;
  }
}
