import "server-only";
import { decodeAccessToken } from "@/lib/auth";
import { app } from "@/lib/myku";
import { prisma } from "@/lib/db";
import { CourseSchedule } from "@/lib/generated/prisma";
import { timeStringToMinutes, toDayW } from "@/utils/date";

const targetPeriod = "23/06/2568-19/10/2568";

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
      return registeredCourse.map(({ ...rest }) => ({
        ...rest.CourseSchedule,
        stdCode,
      }));
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
    const data = res.data.results.filter((c) =>
      c.peroid_date.includes(targetPeriod)
    );
    if (data.length === 0) {
      throw new Error(
        `❌ No term data found for period ${targetPeriod} in API results.`
      );
    }

    if (!data[0].course || data[0].course.length === 0) {
      throw new Error(
        `⚠️ Term ${targetPeriod} found, but it contains no course information.`
      );
    }
    return data[0].course.map((course) => ({
      sectionId: course.section_id, // Ensure this is unique
      subjectCode: course.subject_code,
      subjectNameTh: course.subject_name_th,
      sectionCode: course.section_code,
      teacherName: course.teacher_name || null, // Handle optional field
      timeFrom: timeStringToMinutes(course.time_from),
      timeTo: timeStringToMinutes(course.time_to),
      dayW: toDayW(course.day_w),
      roomNameTh: course.room_name_th,
      sectionType: course.section_type === "16902" ? "LAB" : "LECT",
      stdCode,
    }));
  } catch (error) {
    return null;
  }
}
