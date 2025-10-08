import { $Enums } from "@/lib/generated/prisma";

export type UserExamPlannerData = {
  id: string;
  sectionCode: string;
  sectionId: number;
  subjectNameTh: string;
  sectionType: $Enums.SectionType;
  teacherName: string | null;
  subjectCode: string;
  schedule: {
    date: Date;
    room: string;
    timeFrom: number;
    timeTo: number;
  } | null;
};
