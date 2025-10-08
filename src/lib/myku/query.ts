import "server-only";
import axios from "axios";
import { headers } from "./utils";
import {
  GetStudentEnrollSubject,
  GetMyCourseResponseInterface,
  GetOpenSubjectResponseInterface,
} from "./types";

export class MyKuQueryInstance {
  private token: string;
  constructor(token: string) {
    this.token = token;
  }
  getMyCourse(stdId: string) {
    if (!stdId) throw new Error("stdId is required!");
    return axios.get<GetMyCourseResponseInterface>(
      `https://my.ku.th/myku/api/std-profile/getGroupCourse?academicYear=2568&semester=1&stdId=${stdId}`,
      {
        headers: headers(this.token),
      }
    );
  }
  getProfileImage(stdCode: string) {
    if (!stdCode) throw new Error("stdCode is required!");
    return axios.get(
      `https://my.ku.th/myku/api/std-profile/stdimages?stdcode=${stdCode}`,
      { headers: headers(this.token) }
    );
  }
  getCourseMetadata(subjectCode: string) {
    if (!subjectCode) throw new Error("subjectCode is required!");
    return axios.get<GetOpenSubjectResponseInterface>(
      `https://my.ku.th/myku/api/enroll/openSubjectForEnroll?query=${subjectCode}&academicYear=2568&semester=1&campusCode=K&section=`,
      { headers: headers(this.token) }
    );
  }
  getEnrollSubject(stdId: string, semester: string, academicYear: string) {
    if (!stdId || !semester || !academicYear)
      throw new Error("stdId | semester | academicYear is required!");
    return axios.post<GetStudentEnrollSubject>(
      "https://my.ku.th/myku/api/enroll/searchEnrollResult",
      JSON.stringify({ stdId, semester, academicYear }),
      { headers: headers(this.token) }
    );
  }
}
