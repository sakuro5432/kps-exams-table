import "server-only";
import { decodeAccessToken } from "@/lib/auth";
import { app } from "@/lib/myku";
import { prisma } from "@/lib/db";
import { CourseSchedule } from "@/lib/generated/prisma";

type CourseScheduleWithoutTimestamps = Omit<
  CourseSchedule,
  "createdAt" | "updatedAt" | "deletedAt"
> & { stdCode: string };
export async function getMyCourse(
  stdCode: string,
  token: string
): Promise<CourseScheduleWithoutTimestamps[] | null> {
  try {
    const registeredCourse = await prisma.registeredCourse.findMany({
      where: { stdCode, deletedAt: null },
      include: { CourseSchedule: true },
    });
    if (registeredCourse.length > 0)
      return registeredCourse.map((x) => ({ ...x.CourseSchedule, stdCode }));
    const res = await app
      .query(token)
      .getMyCourse(decodeAccessToken(token).stdid);
    if (res?.data.code !== "success") return null;
    if (
      !res?.data.results ||
      !Array.isArray(res.data.results) ||
      res.data.results.length === 0
    ) {
      throw new Error("No course data available to save.");
    }
    return (
      res.data.results
        .find((x) => x.peroid_date === "23/06/2568-19/10/2568")
        ?.course.map((course) => ({
          sectionId: course.section_id, // Ensure this is unique
          subjectCode: course.subject_code,
          subjectNameTh: course.subject_name_th,
          sectionCode: course.section_code,
          sectionTypeTh: course.section_type_th,
          stdStatusTh: course.std_status_th,
          teacherName: course.teacher_name || null, // Handle optional field
          timeFrom: course.time_from,
          timeTo: course.time_to,
          dayW: course.day_w,
          roomNameTh: course.room_name_th,
          sectionType: course.section_type,
          stdCode,
        })) || null
    );
  } catch (error) {
    return null;
  }
}


