import {
  ExamScheduleDataType,
  GroupedExamSchedules,
  MatchedExamType,
  RegisteredCourseType,
} from "@/types/schedule.types";
import { ExamSchedule } from "./generated/prisma";

/**
 * Group exam schedules by same date, reorder by time,
 * detect overlaps, and link same-time exams.
 */
export function groupByDate(
  exams: ExamScheduleDataType[]
): GroupedExamSchedules[] {
  const grouped = exams.reduce((acc, exam) => {
    const dateKey = exam.date.toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(exam);
    return acc;
  }, {} as Record<string, ExamScheduleDataType[]>);

  // keep a global counter across all days
  let globalGroupCounter = 1;

  return Object.entries(grouped).map(([date, exams]) => {
    const sorted = [...exams].sort(
      (a, b) => (a.timeFrom ?? 0) - (b.timeFrom ?? 0)
    );

    // pass and receive the next counter value
    const { marked, nextCounter } = groupOverlaps(sorted, globalGroupCounter);
    globalGroupCounter = nextCounter;

    return { date, exams: marked };
  });
}

/**
 * Link exams that overlap or occur in the same time range.
 * Keeps counting groupId from previous day.
 */
function groupOverlaps(
  exams: ExamScheduleDataType[],
  startCounter: number
): {
  marked: (ExamScheduleDataType & { isOverlap: boolean; groupId: number | null })[];
  nextCounter: number;
} {
  const marked = exams.map((e) => ({
    ...e,
    isOverlap: false,
    groupId: null as number | null,
  }));

  let groupCounter = startCounter;

  for (let i = 0; i < marked.length; i++) {
    const a = marked[i];
    if (a.groupId !== null) continue;
    if (typeof a.timeFrom !== "number" || typeof a.timeTo !== "number") continue;

    const groupMembers = [a];
    for (let j = i + 1; j < marked.length; j++) {
      const b = marked[j];
      if (typeof b.timeFrom !== "number" || typeof b.timeTo !== "number") continue;

      const overlap = a.timeFrom < b.timeTo && b.timeFrom < a.timeTo;
      if (overlap) groupMembers.push(b);
    }

    if (groupMembers.length > 1) {
      groupMembers.forEach((m) => {
        m.isOverlap = true;
        m.groupId = groupCounter;
      });
      groupCounter++;
    }
  }

  return { marked, nextCounter: groupCounter };
}


export function filterExamScheduleByStudent(
  examSchedules: ExamSchedule[],
  userRegisteredCourses: RegisteredCourseType[],
  stdCode: string
): MatchedExamType[] {
  if (!userRegisteredCourses) return [];

  const studentId = BigInt(stdCode);

  return examSchedules
    .map((x): MatchedExamType | null => {
      const course = userRegisteredCourses.find((r) => {
        const registeredSubjectCode = r.subjectCode.replace(/–/g, "-");
        const examSubjectCode = x.subjectCode.replace(/–/g, "-");

        const matchedSectionCode = x.sectionCode
          .split(",")
          .map((s) => s.trim())
          .includes(r.sectionCode);

        const matchedSectionType =
          x.sectionType == null || r.sectionType === x.sectionType;

        return (
          registeredSubjectCode.startsWith(examSubjectCode) &&
          matchedSectionCode &&
          matchedSectionType
        );
      });

      if (!course) return null;

      if (!x.studentIdRange) {
        return {
          ...x,
          subjectNameTh: course.subjectNameTh,
          sectionId: course.sectionId,
          sectionType: course.sectionType,
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
          sectionType: course.sectionType,
        };
      }

      return null;
    })
    .filter((x): x is MatchedExamType => x !== null)
    .sort((a, b) => Number(a.date) - Number(b.date));
}
