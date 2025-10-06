import { prisma } from "@/lib/db";
import { ExamSchedule } from "@/lib/generated/prisma";
import fs from "fs";
import path from "path";

async function seed() {
  const filePath = path.resolve(
    "prisma/data/2025_first_semester/final/base.csv"
  );
  console.log("🌱 Reading CSV:", filePath);

  // Read CSV file
  const csvText = fs.readFileSync(filePath, "utf-8");
  const lines = csvText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("Date")); // Skip header & blanks

  console.log(`📦 Found ${lines.length} data rows`);

  // Convert CSV lines into objects
  const records = lines
    .map((line) => {
      const [DateStr, Time, SubjectCode, Group, Room, StudentIDRange] = line
        .split(",")
        .map((v) => v.trim());

      if (!DateStr || isNaN(Date.parse(DateStr))) return null;

      const date = new Date(DateStr);

      // 🗓️ Generate Thai date string (e.g. "20 ตุลาคม 2568")
      const thaiMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      const day = date.getDate();
      const month = thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543;
      const dateTh = `${day} ${month} ${year}`;

      return {
        date,
        dateTh,
        time: Time,
        subjectCode: SubjectCode,
        sectionCode: Group,
        room: Room,
        studentIdRange: StudentIDRange || null,
        reportBy: "SYSTEM",
      } as ExamSchedule;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  console.log(`🧾 Preparing to insert ${records.length} records...`);

  // ✅ Batch insert (fast & safe)
  const result = await prisma.examSchedule.createMany({
    data: records,
    skipDuplicates: true, // prevent duplicates if re-seeding
  });

  console.log(`✅ Done! Inserted ${result.count} rows.`);
}

seed()
  .catch((err) => {
    console.error("🚨 Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
