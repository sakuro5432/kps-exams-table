import "server-only";
import { headers } from "./utils";
import { GetStudentEnrollSubject, RefreshCourseDataInterface } from "./types";
import { apiWithAuth } from "@/utils/api";
import { SearchSubjectDetailInterface } from "@/interfaces/SearchSubjectDetail.interface";

export class MyKuQueryInstance {
  private stdId: string;
  constructor(stdId: string) {
    if (!stdId) throw new Error("stdId is required!");
    this.stdId = stdId;
  }
  getEnrollSubject(
    semester: string,
    academicYear: string,
    accessToken?: string
  ) {
    if (!semester || !academicYear) {
      throw new Error("stdId | semester | academicYear is required!");
    }
    return apiWithAuth.post<GetStudentEnrollSubject>(
      "/enroll/searchEnrollResult",
      JSON.stringify({ stdId: this.stdId, semester, academicYear }),
      {
        headers: headers(undefined, accessToken),
      }
    );
  }
  getSubjectDetail(sectionId: string, accessToken?: string) {
    if (!sectionId) throw new Error("sectionId is required!");
    return apiWithAuth.get<SearchSubjectDetailInterface>(
      `/enroll/searchSectionDetail?sectionId=${sectionId}&stdId=${this.stdId}`,
      {
        headers: headers(undefined, accessToken),
      }
    );
  }
  refreshCourseData() {
    return apiWithAuth.post<RefreshCourseDataInterface>(
      "/common/publicCBP",
      JSON.stringify({ keys: [["gcd", this.stdId]] })
    );
  }
}
