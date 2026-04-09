export function getDayOfWeekFromDate(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = utcDate.getUTCDay();

  return dayOfWeek === 0 ? 7 : dayOfWeek;
}