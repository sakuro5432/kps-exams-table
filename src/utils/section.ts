export const sectionTypeTranslator = (int: string, isExam?: boolean) => {
  if (isExam) {
    if (int === "16901") {
      return "ทั่วไป";
    }
    if (int === "16902") {
      return "ปฏิบัติ";
    }
  }
  if (int === "16901") {
    return "บรรยาย";
  }
  if (int === "16902") {
    return "ปฏิบัติ";
  }
  return "ไม่ทราบ";
};
