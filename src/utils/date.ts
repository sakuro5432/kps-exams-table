export function getThaiDate(date: Date): string {
  const thaiDate = new Date(date);

  const weekday = thaiDate.toLocaleDateString("th-TH", { weekday: "long" });
  const day = thaiDate.getDate();
  const month = thaiDate.toLocaleDateString("th-TH", { month: "long" });
  return weekday.concat("ที่ ", day.toString(), " ", month);
}
export function extractTimeRange(input: string): { from: string; to: string } | null {
  // เปลี่ยน . เป็น :
  const cleaned = input.replace(/\./g, ":");

  // ใช้ regex แยกช่วงเวลา
  const match = cleaned.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
  if (!match) return null;

  return {
    from: match[1],
    to: match[2],
  };
}
