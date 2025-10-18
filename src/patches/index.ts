import fs from "fs";
import path from "path";
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
    const prefix = `[${today}/${index}]`; // ← วันที่ + ลำดับ
    const fileName = path.basename(file);

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

      if (typeof fn === "function") {
        // ใส่ prefix ให้ log ภายใน patch
        const originalLog = console.log;
        console.log = (...args) => originalLog(prefix, ...args);

        await fn();

        console.log = originalLog; // คืนค่า log เดิม
        console.log(`${prefix} ✅ Done ${meta.name || fileName}\n`);
      } else {
        console.log(`${prefix} ⚠️ Skip ${fileName} (no default export)\n`);
      }
    } catch (err) {
      console.error(`${prefix} ❌ Failed ${file}:`, err, "\n");
    }
  }

  console.log("🏁 All patches completed.\n");
}

main();
