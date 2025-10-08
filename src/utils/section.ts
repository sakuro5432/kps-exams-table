import { $Enums } from "@/lib/generated/prisma";

export const sectionTypeTranslator = (
  code: $Enums.SectionType,
  isExam?: boolean
) => {
  if (isExam) {
    if (code === "LECT") {
      return "ทั่วไป";
    }
    if (code === "LAB") {
      return "ปฏิบัติ";
    }
  }
  if (code === "LECT") {
    return "บรรยาย";
  }
  if (code === "LAB") {
    return "ปฏิบัติ";
  }
  return "ไม่ทราบ";
};
