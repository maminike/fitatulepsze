import { formatTime, getCurrentTime, getMinutesDifference } from "@/lib/date-time-utils";

describe("formatTime", () => {
  it("formats date to HH:mm", () => {
    const date = new Date(2026, 2, 5, 7, 3);
    expect(formatTime(date)).toBe("07:03");
  });

  it("formats midnight correctly", () => {
    const date = new Date(2026, 2, 5, 0, 0);
    expect(formatTime(date)).toBe("00:00");
  });
});

describe("getCurrentTime", () => {
  it("returns HH:mm for provided date", () => {
    const now = new Date(2026, 2, 5, 22, 45);
    expect(getCurrentTime(now)).toBe("22:45");
  });

  it("matches formatTime output for the same date", () => {
    const now = new Date(2026, 2, 5, 9, 5);
    expect(getCurrentTime(now)).toBe(formatTime(now));
  });
});

describe("getMinutesDifference", () => {
  it("returns positive minute difference for same-day times", () => {
    expect(getMinutesDifference("07:30", "09:00")).toBe(90);
  });

  it("handles overnight range", () => {
    expect(getMinutesDifference("23:30", "00:15")).toBe(45);
  });

  it("returns 0 for identical times", () => {
    expect(getMinutesDifference("12:00", "12:00")).toBe(0);
  });

  it("handles one-minute overnight difference", () => {
    expect(getMinutesDifference("23:59", "00:00")).toBe(1);
  });

  it("throws for invalid time format", () => {
    expect(() => getMinutesDifference("7:30", "09:00")).toThrow(
      "Invalid time format: 7:30. Expected HH:mm.",
    );
  });

  it("throws when end time has invalid format", () => {
    expect(() => getMinutesDifference("07:30", "24:00")).toThrow(
      "Invalid time format: 24:00. Expected HH:mm.",
    );
  });
});
