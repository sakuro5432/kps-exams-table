import { ExamSchedule } from "@/lib/generated/prisma";
import baseData from "./data/base.json" assert { type: "json" };
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

const folderPath = path.join(__dirname, "data");
async function main() {
  const count = await prisma.examSchedule.count();
  if (count === 0) {
    type ExpactedData = Omit<
      ExamSchedule,
      "id" | "deletedAt" | "isCorrectCount" | "status" | "createdAt" | "stdCode"
    >;
    const data: ExpactedData[] = baseData.map(
      (x) =>
        ({
          ...x,
          date: new Date(x.date),
          reportBy: "SYSTEM",
        } as ExpactedData)
    );
    const files = fs.readdirSync(folderPath).filter((x) => x !== "base.json");
    files.forEach((file) => {
      const r = fs.readFileSync(folderPath.concat("/", file), {
        encoding: "utf-8",
      });
      (JSON.parse(r) as (ExamSchedule & { date: number })[]).forEach((x) => {
        data.push({ ...x, reportBy: "SYSTEM" });
      });
    });
    await prisma.examSchedule.createMany({ data, skipDuplicates: true });
  } else {
    console.log("\n- Exam schedules already seeded.");
  }
}
main();
