import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { PatchStatus } from "@/lib/generated/prisma";
import { version } from "../../package.json";

// ตรวจสอบว่าเป็น patch ไฟล์จริง
const isPatchFile = (file: string) =>
  file.endsWith(".ts") && !file.endsWith("index.ts") && !file.startsWith("_");

// เดินอ่านทุกไฟล์ patch (รวม subfolder)
const walkDir = (dir: string): string[] => {
  return fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) return walkDir(fullPath);
    return isPatchFile(file) ? [fullPath] : [];
  });
};

async function main() {
  const scriptsDir = path.join(__dirname, "scripts");
  if (!fs.existsSync(scriptsDir)) {
    console.error("❌ scripts directory not found:", scriptsDir);
    process.exit(1);
  }

  const patchFiles = walkDir(scriptsDir).sort();
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  console.log(`🚀 Running patches for version ${version}`);
  console.log(`📅 Date: ${today}`);
  console.log(`🧩 Found ${patchFiles.length} scripts\n`);

  let index = 0;

  for (const file of patchFiles) {
    index++;
    const prefix = `[${today}/${index}]`;
    const fileName = path.basename(file);
    let start = 0; // ✅ ต้องประกาศข้างนอก try เพื่อใช้ใน catch ได้

    try {
      const mod = await import(file);
      const meta = mod.meta || {};
      const fn = mod.default || mod.main;

      if (meta.requiredVersion && meta.requiredVersion !== version) {
        console.log(
          `${prefix} ⏭️ Skip ${meta.name || fileName} (requires ${
            meta.requiredVersion
          }, current ${version})`
        );
        continue;
      }

      console.log(`${prefix} ▶️  Running ${meta.name || fileName}`);

      start = performance.now(); // ✅ เริ่มจับเวลา

      if (typeof fn === "function") {
        // ให้ prefix กับ log ภายใน patch
        const originalLog = console.log;
        console.log = (...args) => originalLog(prefix, ...args);

        await fn();

        console.log = originalLog; // คืนค่า log เดิม

        const end = performance.now();
        const duration = Math.round(end - start);

        console.log(
          `${prefix} ✅ Done ${meta.name || fileName} (${duration} ms)\n`
        );

        await prisma.patchLog.create({
          data: {
            patchName: meta.name || fileName,
            version,
            status: PatchStatus.SUCCESS,
            durationMs: duration,
          },
        });
      } else {
        console.log(`${prefix} ⚠️ Skip ${fileName} (no default export)\n`);
      }
    } catch (err) {
      const end = performance.now();
      const duration = Math.round(end - start);

      console.error(`${prefix} ❌ Failed ${file}:`, err, "\n");

      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }

      await prisma.patchLog.create({
        data: {
          patchName: fileName,
          version,
          status: PatchStatus.FAILED,
          message,
          durationMs: duration,
        },
      });
    }
  }

  console.log("🏁 All patches completed.\n");
}

main();
