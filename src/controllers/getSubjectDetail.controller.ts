import "server-only";
import { GetStudentEnrollSubject } from "@/lib/myku/types";
import { app } from "@/lib/myku";
import { EnrollSubject } from "@/interfaces/EnrollData.interface";

export async function getSubjectDetail(stdId: string, subject: EnrollSubject) {
  return await app.query(stdId).getSubjectDetail(subject.sectionId.toString());
}
