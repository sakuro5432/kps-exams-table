import { prisma } from "@/lib/db";
import { version } from "../../../package.json";

/**
 * Patch metadata
 */
export const meta = {
  name: "fix-invalid-userExamSchedule",
  requiredVersion: "1.0.1",
  description:
    "Automatically mark invalid userExamSchedule records linked to student-reported exams.",
};

/**
 * Main patch logic
 */
export default async function main() {
  // 🔒 ตรวจสอบ version ก่อนรัน
  if (version !== meta.requiredVersion) {
    console.log(
      `⚠️  Skip patch [${meta.name}] because version mismatch.`,
      `Required: ${meta.requiredVersion}, Current: ${version}`
    );
    return;
  }

  console.log(`🧩 Running patch: ${meta.name} (v${meta.requiredVersion})`);

  try {
    // 🔍 ดึงข้อมูล ExamSchedule ทั้งหมดที่ reportBy = "STUDENT"
    const exams = await prisma.examSchedule.findMany({
      where: { reportBy: "STUDENT", deletedAt: null },
      select: { id: true, stdCode: true },
    });

    if (exams.length === 0) {
      console.log("✅ No student-reported exams found. Nothing to patch.");
      return;
    }

    // ดึง userExamSchedules ที่สัมพันธ์กับ exams เหล่านี้ทั้งหมด
    const userExamSchedules = await prisma.userExamSchedule.findMany({
      where: {
        deletedAt: null,
        examScheduleId: { in: exams.map((e) => e.id) },
      },
      include: { ExamSchedule: true },
    });

    if (userExamSchedules.length === 0) {
      console.log("✅ No active userExamSchedule found. Nothing to patch.");
      return;
    }

    // ✅ เงื่อนไข: ถ้า ExamSchedule.reportBy = "STUDENT"
    //    และ stdCode ไม่ตรงกัน → ถือว่าข้อมูลนี้ไม่ถูกต้อง
    const todoDelete = userExamSchedules.filter(
      (x) =>
        x.ExamSchedule.reportBy === "STUDENT" &&
        x.stdCode !== x.ExamSchedule.stdCode
    );

    if (todoDelete.length === 0) {
      console.log("✅ All userExamSchedule records are valid.");
      return;
    }

    // 🗑️ Soft delete ข้อมูลที่ผิดพลาด
    const processed = await prisma.userExamSchedule.updateMany({
      where: { id: { in: todoDelete.map((x) => x.id) } },
      data: { deletedAt: new Date() },
    });

    console.log(
      `🗑️  Invalid records found: ${todoDelete.length}. Marked deleted: ${processed.count}.`
    );

    // // 🔍 แสดงตัวอย่างเพื่อ debug
    // console.log(
    //   "Example of deleted records:",
    //   todoDelete.map((x) => ({
    //     id: x.id,
    //     stdCode: x.stdCode,
    //     examStd: x.ExamSchedule.stdCode,
    //   }))
    // );

    console.log("✅ Patch completed successfully.");
  } catch (err) {
    console.error("❌ Error occurred while running patch:", err);
  }
}
