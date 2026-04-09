export function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function minutesToTime(minutes: number): string {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");

  return `${hour}:${minute}`;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes = 60
): string[] {
  const slots: string[] = [];

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  for (let current = start; current < end; current += intervalMinutes) {
    slots.push(minutesToTime(current));
  }

  return slots;
}

export function isTimeWithinRange(
  time: string,
  startTime: string,
  endTime: string
): boolean {
  const current = timeToMinutes(time);
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  return current >= start && current < end;
}