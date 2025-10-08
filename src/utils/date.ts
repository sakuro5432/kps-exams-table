export function formatThaiDate(date: Date | string): string {
  const thaiDate = new Date(date);

  const weekday = thaiDate.toLocaleDateString("th-TH", { weekday: "long" });
  const day = thaiDate.getDate();
  const month = thaiDate.toLocaleDateString("th-TH", { month: "long" });
  return weekday.concat("ที่ ", day.toString(), " ", month);
}

export function timeStringToMinutes(str: string) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + (m || 0);
}

/**
 * ⏱️ Convert minutes (e.g. 540) to "HH:MM" string (e.g. "09:00")
 */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
/**
 * ⏱️ Convert "HH:MM - HH:MM" string to minutes object
 * Example: "09:00 - 12:00" → { from: 540, to: 720 }
 */
export function timeRangeToMinutes(range: string): {
  from: number;
  to: number;
} {
  const [start, end] = range.split("-").map((t) => t.trim());
  const parse = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  return { from: parse(start), to: parse(end) };
}

/**
 * ⏱️ Convert minutes object to "HH:MM" strings
 * Example: { from: 540, to: 720 } → { from: "09:00", to: "12:00" }
 */
export function minutesRangeToTimeStrings(
  from?: number,
  to?: number
): { from: string; to: string } {
  if (from == null || to == null) return { from: "", to: "" };
  return { from: minutesToTimeString(from), to: minutesToTimeString(to) };
}

/**
 * ⏱️ Merge minute range into single "HH:MM - HH:MM" string
 * Example: (540, 720) → "09:00 - 12:00"
 */
export function formatTimeRange(from: number, to: number): string {
  return `${minutesToTimeString(from)} - ${minutesToTimeString(to)}`;
}

enum DayW {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN",
}

export function toDayW(value: string): DayW {
  const v = value.trim().toUpperCase();

  // English and Thai mapping
  const map: Record<string, DayW> = {
    MON: DayW.MON,
    MONDAY: DayW.MON,
    จันทร์: DayW.MON,

    TUE: DayW.TUE,
    TUES: DayW.TUE,
    TUESDAY: DayW.TUE,
    อังคาร: DayW.TUE,

    WED: DayW.WED,
    WEDNESDAY: DayW.WED,
    พุธ: DayW.WED,

    THU: DayW.THU,
    THUR: DayW.THU,
    THURS: DayW.THU,
    THURSDAY: DayW.THU,
    พฤหัสบดี: DayW.THU,

    FRI: DayW.FRI,
    FRIDAY: DayW.FRI,
    ศุกร์: DayW.FRI,

    SAT: DayW.SAT,
    SATURDAY: DayW.SAT,
    เสาร์: DayW.SAT,

    SUN: DayW.SUN,
    SUNDAY: DayW.SUN,
    อาทิตย์: DayW.SUN,
  };

  return map[v];
}

export function normalizeToMidnight(date: Date): Date {
  const localMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return new Date(
    localMidnight.getTime() - localMidnight.getTimezoneOffset() * 60000
  );
}
