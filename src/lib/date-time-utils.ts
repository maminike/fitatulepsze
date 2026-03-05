const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function toTwoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

function parseTimeToMinutes(time: string): number {
  if (!TIME_PATTERN.test(time)) {
    throw new Error(`Invalid time format: ${time}. Expected HH:mm.`);
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatTime(date: Date): string {
  return `${toTwoDigits(date.getHours())}:${toTwoDigits(date.getMinutes())}`;
}

export function getCurrentTime(now: Date = new Date()): string {
  return formatTime(now);
}

export function getMinutesDifference(startTime: string, endTime: string): number {
  const start = parseTimeToMinutes(startTime);
  let end = parseTimeToMinutes(endTime);

  if (end < start) {
    end += 24 * 60;
  }

  return end - start;
}
