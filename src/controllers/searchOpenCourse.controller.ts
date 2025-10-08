import "server-only";
import { prisma } from "@/lib/db";
import { app } from "@/lib/myku";
import { AxiosError } from "axios";
import { formatTimeRange } from "@/utils/date";

const omit = { omit: { dayW: true } };

interface ResponseData {
  data?:
    | {
        subjectCode: string;
        sectionCode: string;
        sectionId: number;
        subjectNameTh: string;
        sectionType: string;
        roomNameTh: string;
        teacherName: string | null;
        time: string;
      }[]
    | null;
  message: string;
  code: string;
}
export async function searchOpenCourse(
  id: string,
  token: string
): Promise<ResponseData> {
  try {
    const result = await prisma.courseSchedule.findMany({
      where: { subjectCode: id, deletedAt: null },
      ...omit,
    });
    if (!result.length) {
      const res = await app.query(token).getCourseMetadata(id);
      return {
        data: res.data.results.map((x) => ({
          sectionCode: x.sectionCode,
          sectionId: x.sectionId,
          subjectNameTh: x.subjectNameTh,
          sectionType: x.sectionType,
          roomNameTh: x.roomNameTh,
          teacherName: x.teacherName,
          time: x.coursedate.replace(/^\s*\w+\s+/, "").replaceAll(" ", ""),
          subjectCode: x.subjectCode,
          // .replaceAll(":", "."),
        })),
        code: "SUCCESS",
        message: "OK",
      };
    }
    return {
      data: result.map((x) => ({
        sectionCode: x.sectionCode,
        sectionId: x.sectionId,
        subjectNameTh: x.subjectNameTh,
        sectionType: x.sectionType,
        roomNameTh: x.roomNameTh,
        teacherName: x.teacherName,
        time: formatTimeRange(x.timeFrom, x.timeTo),
        subjectCode: x.subjectCode,
      })),
      code: "SUCCESS",
      message: "OK",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data.code === "expired") {
        return {
          message: "โปรดเข้าสู่ระบบใหม่อีกครั้ง",
          code: error.response.data.code,
        };
      }
    }
    return { message: "เกิดข้อผิดพลาด", code: "INTERNAL_SERVER_ERROR" };
  }
}
