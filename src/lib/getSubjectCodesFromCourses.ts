type Course = {
  sectionCode: string;
  subjectCode: string;
};

type SubjectCodeResult = {
  sectionCode: string;
  subjectCodes: string;
};

export function getSubjectCodesFromCourses(myCourse: Course[]): SubjectCodeResult[] {
  return myCourse.map((x) => ({
    sectionCode: x.sectionCode,
    subjectCodes: x.subjectCode.replace(/-.*/, ""),
  }));
}
