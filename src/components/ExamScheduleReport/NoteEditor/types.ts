import { ExamScheduleDataType } from "@/types/schedule.types";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { schema } from "./schema.z";

export interface Props {
  data: ExamScheduleDataType;
  form: UseFormReturn<z.infer<typeof schema>>;
  onSubmit: (value: z.infer<typeof schema>) => void;
  isDisabled: boolean;
  isSubmit: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
}
