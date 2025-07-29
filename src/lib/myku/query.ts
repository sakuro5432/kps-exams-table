import "server-only";
import axios from "axios";
import { headers } from "./utils";
import { GetMyCourseResponseInterface } from "./types";

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
}
