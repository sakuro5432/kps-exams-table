import { GroupCourseResponseInterface } from "../../interfaces/GroupCourseResponseInterface";
import { LoginProfile } from "../../types/signIn.types";

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

export interface GetMyCourseResponseInterface {
  code: string;
  results: GroupCourseResponseInterface[];
  cache: boolean;
}
