import z from "zod";

export const signInSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "โปรดกรอกรหัสนิสิต")
    .regex(
      /^b\d{10}$/,
      "รหัสนิสิตไม่ถูกต้อง (ต้องขึ้นต้นด้วย b และตัวเลข 10 หลัก)"
    ),
  password: z.string().trim().min(1, "โปรดกรอกรหัสผ่าน"),
});
export { z };
