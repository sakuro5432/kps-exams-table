import { $Enums } from "@/lib/generated/prisma";

export type RegisteredCourseType = {
  sectionId: number;
  // groupHeader: string;
  // weekStartDay: Date;
  // weekEndDay: Date;
  subjectCode: string;
  subjectNameTh: string;
  sectionCode: string;
  teacherName: string | null;
  timeFrom: number;
  timeTo: number;
  dayW: string;
  roomNameTh: string;
  sectionType: $Enums.SectionType;
  stdCode: string;
};

export type ExamScheduleDataType = {
  id: string;
  room: string;
  subjectCode: string;
  subjectNameTh: string;
  sectionType: $Enums.SectionType;
  date: Date;
  timeFrom: number;
  timeTo: number;
  sectionCode: string;
  sectionId: number;
  // studentIdRange: string | null;
  note?: string | null;
};

export type GroupedExamSchedules = {
  date: string; // e.g. "2025-10-20"
  exams: (ExamScheduleDataType & {
    isOverlap: boolean;
    groupId: number | null;
  })[];
};
export type MatchedExamType = ExamScheduleDataType & { subjectNameTh: string };
