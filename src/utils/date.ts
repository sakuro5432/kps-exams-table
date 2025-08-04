export function getThaiDate(date: Date): string {
  // Create a new date object in UTC
  const utcDate = new Date(date.toISOString());

  // Set the options for formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Bangkok",
  };

  // Format the date in Thai locale and replace the space
  return utcDate.toLocaleDateString("th-TH", options);
}
export function extractTimeRange(
  input: string
): { from: string; to: string } | null {
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
