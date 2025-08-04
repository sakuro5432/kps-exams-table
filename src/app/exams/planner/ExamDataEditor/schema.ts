import z from "zod";

export const schema = z.object({
  id: z.string().min(1, "Missing RegisteredId"),
  subjectCode: z.string().min(1, "Missing SubjectCode"),
  room: z.string().regex(/^(LH|KH|SC)\s?(Dept|\d{1,2}-\d{3})$/, {
    message:
      "รูปแบบห้องต้องเป็น LH หรือ KH เช่น 'LH 3-305', 'LH3-305' หรือ 'LH Dept'",
  }),
  date: z.coerce.date({ message: "ต้องเลือกวันที่" }),
  timeFrom: z.string().min(1, "ต้องระบุเวลาเริ่ม"),
  timeTo: z.string().min(1, "ต้องระบุเวลาสิ้นสุด"),
  sectionCode: z.string().regex(/^\d{3,3}(,\d{3,3})*$/, {
    message: "หมู่เรียนต้องเป็นตัวเลข 3 ตัวและคั่นด้วย , เช่น 700,821,820",
  }),
});
