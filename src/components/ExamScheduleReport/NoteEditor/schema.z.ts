import z from "zod";

export const schema = z.object({
  userExamId: z.string().min(1),
  note: z.string().max(50, { message: "จำกัด 50 ตัวอักษร" }).trim().optional(),
});
