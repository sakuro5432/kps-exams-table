export interface SearchSubjectDetailInterface {
  code: string;
  sectionDetail: SectionDetail;
}

interface SectionDetail {
  schedules: Schedule[];
  teacher: Teacher[];
  major: Major[];
  exmajor: any[];
  midterm: Midterm;
  final: Final;
}

interface Schedule {
  day: string;
  timeFrom: number;
  timeTo: number;
  time: string;
  room: string;
}

interface Teacher {
  title: string;
  titleEn: string;
  positionTh: string;
  positionEn: string;
  nameTh: string;
  nameEn: string;
  ownerFlag?: string;
  orderNum: number;
}

interface Major {
  majorCode: string;
}

interface Midterm {
  date: any;
  time: string;
}

interface Final {
  date: any;
  time: string;
}
