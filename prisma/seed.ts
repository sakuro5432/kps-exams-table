import { ExamSchedule } from "@/lib/generated/prisma";
import baseData from "./data/base.json" assert { type: "json" };
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

const folderPath = path.join(__dirname, "data");
async function main() {
  const count = await prisma.examSchedule.count();
  if (count === 0) {
    const data: Omit<
      ExamSchedule,
      "id" | "deletedAt" | "isCorrectCount" | "status" | "createdAt"
    >[] = baseData.map((x) => ({
      ...x,
      date: new Date(x.date),
    }));
    const files = fs.readdirSync(folderPath).filter((x) => x !== "base.json");
    files.forEach((file) => {
      const r = fs.readFileSync(folderPath.concat("/", file), {
        encoding: "utf-8",
      });
      (JSON.parse(r) as (ExamSchedule & { date: number })[]).forEach((x) => {
        data.push(x);
      });
    });
    await prisma.examSchedule.createMany({ data, skipDuplicates: true });
  } else {
    console.log("\n- Exam schedules already seeded.");
  }
}
main();
