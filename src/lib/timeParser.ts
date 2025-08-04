export function parseTimeRange(timeRange: string) {
  const [from, to] = timeRange.split("-");
  const normalize = (t: string) => t.trim().replace(".", ":").padEnd(5, "0");
  return {
    from: normalize(from),
    to: normalize(to),
  };
}
