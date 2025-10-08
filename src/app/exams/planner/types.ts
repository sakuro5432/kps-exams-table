import { UserExamPlannerData } from "@/types/userExamPlanner.types";

type ResponseFetcherCode =
  | "UNAUTHORIZED"
  | "SUCCESS"
  | "NOT_FOUND"
  | "INVALID_FORMAT";
export interface ResponseFetcherData {
  message: string;
  code: ResponseFetcherCode | string;
  data?: UserExamPlannerData[] | null;
}
