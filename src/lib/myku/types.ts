import { OpenSubjectForEnrollInterface } from "@/interfaces/OpenSubjectForEnroll.interface";
import { GroupCourseResponseInterface } from "@/interfaces/GroupCourseResponse.interface";
import { LoginProfile } from "@/types/signIn.types";
import { EnrollData } from "@/interfaces/EnrollData.interface";

export interface SignInServicePropsInterface {
  username: string;
  password: string;
}

export interface SignInServiceResponseInterface {
  code: string;
  message: string;
  accesstoken: string;
  renewtoken: string;
  user: LoginProfile;
  cache: boolean;
}

export interface RenewTokenResponseInterface {
  code: string;
  accesstoken: string;
  username: string;
}

export interface GetStudentEnrollSubject extends EnrollData {}

export interface RefreshCourseDataInterface {
  code: "success" | "expired" | string;
  message: string;
}
