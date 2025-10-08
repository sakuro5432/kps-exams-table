export interface EnrollSubject {
  enrollId: number;
  sectionId: number;
  subjectCode: string;
  subjectShow: string;
  subjectNameTh: string;
  subjectNameEn: string;
  credit: number;
  creditShow: string;
  sectionCode: string;
  sectionType: string;
  sectionTypeTh: string;
  sectionTypeEn: string;
  enrollStatus: string;
  approveStatus: string;
  approveBy: string | null;
  approveDt: string | null;
  enrollType: string;
  enrollTypeTh: string;
  enrollTypeEn: string;
  subjectType: string;
  isPreRegister: string | null;
  campusCode: string;
  campusNameTh: string;
  campusNameEn: string;
  totalAssessedAssessment: string;
  totalAssessment: string;
  flagEnrollTypeC: string;
  inchangeprocess: string;
}

export interface EnrollData {
  code: string;
  yearTh: string;
  yearEn: string;
  semester: string;
  semesterTh: string;
  semesterEn: string;
  enrollCredit: number;
  enrollSubjects: EnrollSubject[];
  waitApproveCredit: number;
  waitApproveSubjects: any[];
  rejectCredit: number;
  rejectSubjects: any[];
  pendingInvoiceCredit: number;
  pendingInvoiceSubjects: any[];
  patternCredit: number;
  patternSubjects: any[];
  patternFlag: string;
}
