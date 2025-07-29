export type RegisteredCourseType = {
  sectionId: number;
  groupHeader: string;
  weekStartDay: Date;
  weekEndDay: Date;
  subjectCode: string;
  subjectNameTh: string;
  sectionCode: string;
  sectionTypeTh: string;
  stdStatusTh: string;
  teacherName: string | null;
  timeFrom: string;
  timeTo: string;
  dayW: string;
  roomNameTh: string;
  sectionType: string;
  stdCode: string;
};

export type ExamScheduleType = {
  id: string;
  room: string;
  subjectCode: string;
  subjectNameTh: string;
  dateTh: string;
  date: Date;
  time: string;
  sectionCode: string;
  sectionId: number;
  studentIdRange: string | null;
  isTimeDuplicate?: boolean;
};
export type MatchedExamType = ExamScheduleType & { subjectNameTh: string };
export type CompleteExamScheduleDataType = {
  stdCode: string;
  data: MatchedExamType[];
};
