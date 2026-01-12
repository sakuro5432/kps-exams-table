import { prisma } from "@/lib/db";
import { ExamSchedule } from "@/lib/generated/prisma";
import { timeRangeToMinutes } from "@/utils/date";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import UserExamModel from "../src/mongoose/model/UserExam";
import UserExamPlannerModel from "../src/mongoose/model/UserExamPlanner";
import { env } from "@/env";

async function resetCache() {
  const connection = await mongoose.connect(env.MONGODB_URI, {
    dbName: env.NODE_ENV === "production" ? "exams" : "exams_development",
  });

  console.time("🧹 Clear Mongo Cache");
  await Promise.all([
    UserExamModel.collection.drop().catch(() => UserExamModel.deleteMany()),
    UserExamPlannerModel.collection
      .drop()
      .catch(() => UserExamPlannerModel.deleteMany()),
  ]);
  console.timeEnd("🧹 Clear Mongo Cache");
  connection.disconnect();
}

async function seed() {
  console.log("\nEnvironment:", env.NODE_ENV, "\n");

  await resetCache();

  const filePath = path.resolve(
    "prisma/data/2025_second_semester/mid/base.csv"
  );
  console.log("🌱 Reading CSV:", filePath);
  // Read CSV file
  const csvText = fs.readFileSync(filePath, "utf-8");
  const lines = csvText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("Date")); // Skip header & blanks

  const countExamSchedule = await prisma.examSchedule.count({
    where: { deletedAt: null },
  });

  if (countExamSchedule === 0) {
    console.log(`📦 Found ${lines.length} data rows`);

    // Convert CSV lines into objects
    const records = lines
      .map((line) => {
        const [DateStr, Time, SubjectCode, Group, Room, StudentIDRange] = line
          .split(",")
          .map((v) => v.trim());

        if (!DateStr || isNaN(Date.parse(DateStr))) return null;

        const date = new Date(DateStr);
        const { from: timeFrom, to: timeTo } = timeRangeToMinutes(Time);
        return {
          date,
          timeFrom,
          timeTo,
          subjectCode: SubjectCode.replace(/\s*\(.*\)$/, ""),
          sectionCode: Group,
          room: Room,
          studentIdRange: StudentIDRange || null,
          reportBy: "SEED",
          sectionType: SubjectCode.split(" ")[1]?.includes("LAB")
            ? "LAB"
            : "LECT",
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
    return;
  }
  console.log(
    "✅ Database already contains all exam schedules. Skipping seeding."
  );
}

seed().catch((err) => {
  console.error("🚨 Seeding failed:", err);
  process.exit(1);
});
