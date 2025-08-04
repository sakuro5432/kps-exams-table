export type UserPlannerData = {
  id: string;
  sectionCode: string;
  sectionId: number;
  subjectNameTh: string;
  sectionType: string;
  teacherName: string | null;
  subjectCode: string;
  schedule: {
    date: Date;
    room: string;
    dateTh: string;
    time: string;
  } | null;
};
