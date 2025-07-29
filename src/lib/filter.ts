import { RegisteredCourseType, MatchedExamType } from "@/types/schedule.types";
import { ExamSchedule } from "@/lib/generated/prisma";

export function groupByDate<T extends { dateTh: string; time: string }>(
  items: T[]
): Record<string, (T & { isTimeDuplicate?: boolean })[]> {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.dateTh]) {
      acc[item.dateTh] = [];
    }
    acc[item.dateTh].push(item);
    return acc;
  }, {} as Record<string, (T & { isTimeDuplicate?: boolean })[]>);

  // ฟังก์ชันแปลงเวลาเริ่มต้นเป็นนาที
  const getStartEnd = (time: string) => {
    const [start, end] = time.split("-").map((t) => t.trim());
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    return {
      start: toMinutes(start.replace(".", ":")),
      end: toMinutes(end.replace(".", ":")),
    };
  };

  for (const date in grouped) {
    const exams = grouped[date];

    // เรียงตามเวลาเริ่มต้น
    exams.sort((a, b) => getStartEnd(a.time).start - getStartEnd(b.time).start);

    // ตรวจสอบเวลาทับซ้อน: ตั้ง isTimeDuplicate เฉพาะตัวถัดไปที่ทับกับก่อนหน้า
    for (let i = 1; i < exams.length; i++) {
      const current = getStartEnd(exams[i].time);
      for (let j = 0; j < i; j++) {
        const prev = getStartEnd(exams[j].time);
        const isOverlap =
          Math.max(current.start, prev.start) < Math.min(current.end, prev.end);
        if (isOverlap) {
          exams[i].isTimeDuplicate = true;
          break;
        }
      }
    }
  }

  return grouped;
}

export function filterExamScheduleByStudent(
  todo: ExamSchedule[],
  data: RegisteredCourseType[] | null,
  stdCode: string
): MatchedExamType[] {
  if (!data) return [];

  const studentId = BigInt(stdCode);

  return todo
    .map((x): MatchedExamType | null => {
      const course = data.find((course) => {
        const registeredSubjectCode = course.subjectCode.replace(/–/g, "-");
        const examSubjectCode = x.subjectCode.replace(/–/g, "-");

        return (
          registeredSubjectCode.startsWith(examSubjectCode) &&
          x.sectionCode
            .split(",")
            .map((s) => s.trim())
            .includes(course.sectionCode)
        );
      });

      if (!course) return null;

      if (!x.studentIdRange) {
        return {
          ...x,
          subjectNameTh: course.subjectNameTh,
          sectionId: course.sectionId,
        };
      }

      const [start, end] = x.studentIdRange
        .split("-")
        .map((v) => BigInt(v.trim()));

      if (studentId >= start && studentId <= end) {
        return {
          ...x,
          subjectNameTh: course.subjectNameTh,
          sectionId: course.sectionId,
        };
      }

      return null;
    })
    .filter((x): x is MatchedExamType => x !== null)
    .sort((a, b) => Number(a.date) - Number(b.date));
}
