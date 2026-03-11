import { formatTime, getCurrentTime, getMinutesDifference } from "@/lib/date-time-utils";

describe("date-time-utils cases", () => {
  test("formatTime pads single digit hour and minute", () => {
    const d = new Date(2026, 0, 1, 4, 5);
    expect(formatTime(d)).toBe("04:05");
  });

  test("getCurrentTime without argument returns a string matching HH:mm", () => {
    const s = getCurrentTime();
    expect(typeof s).toBe("string");
    expect(s).toMatch(/^\d{2}:\d{2}$/);
  });

  test("getMinutesDifference longer overnight span", () => {
    expect(getMinutesDifference("22:00", "02:00")).toBe(240);
  });

  test("formatTime does not throw for invalid date object type", () => {
    expect(() => formatTime(new Date(NaN))).not.toThrow();
  });

  test("formatTime midnight returns 00:00", () => {
    const d = new Date(2026, 0, 1, 0, 0);
    expect(formatTime(d)).toBe("00:00");
  });

  test("getMinutesDifference across midnight by one minute", () => {
    expect(getMinutesDifference("23:59", "00:00")).toBe(1);
  });

  test("getMinutesDifference throws for malformed time format", () => {
    expect(() => getMinutesDifference("7:30", "09:00")).toThrow();
  });
});
