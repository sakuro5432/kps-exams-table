import { $Enums, CourseSchedule } from "./generated/prisma";

type Course = Omit<CourseSchedule, "createdAt" | "updatedAt" | "deletedAt"> & {
  stdCode: string;
};

type SubjectCodeResult = {
  sectionCode: string;
  subjectCodes: string;
  sectionType: $Enums.SectionType;
};

export function getSubjectCodesFromCourses(
  myCourse: Course[]
): SubjectCodeResult[] {
  return myCourse.map((x) => ({
    sectionCode: x.sectionCode,
    subjectCodes: x.subjectCode.replace(/-.*/, ""),
    sectionType: x.sectionType,
  }));
}
