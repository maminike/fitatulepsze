import { formatTime, getCurrentTime, getMinutesDifference } from "@/lib/date-time-utils";

describe("formatTime", () => {
  it("dobrze zamienia na HH:mm", () => {
    const date = new Date(2026, 2, 5, 7, 3);
    expect(formatTime(date)).toBe("07:03");
  });

  it("formatuje polnoc", () => {
    const date = new Date(2026, 2, 5, 0, 0);
    expect(formatTime(date)).toBe("00:00");
  });
});

describe("getCurrentTime", () => {
  it("zwraca HH:mm", () => {
    const now = new Date(2026, 2, 5, 22, 45);
    expect(getCurrentTime(now)).toBe("22:45");
  });

  it("ma identyczny format jak formatTime", () => {
    const now = new Date(2026, 2, 5, 9, 5);
    expect(getCurrentTime(now)).toBe(formatTime(now));
  });
});

describe("getMinutesDifference", () => {
  it("zwraca dodatnia roznice minut dla czasow z tego samego dnia", () => {
    expect(getMinutesDifference("07:30", "09:00")).toBe(90);
  });

  it("nie zwraca ujemnej roznicy minut", () => {
    expect(getMinutesDifference("09:00", "07:30")).toBe(1350);
  });

  it("zwraca 0 dla identycznych czasow", () => {
    expect(getMinutesDifference("12:00", "12:00")).toBe(0);
  });

  it("zwraca 1 dla różnicy jednej minuty przez północ", () => {
    expect(getMinutesDifference("23:59", "00:00")).toBe(1);
  });

  it("nie zwraca 1 dla różnicy jednej minuty przez północ w drugą stronę", () => {
    expect(getMinutesDifference("00:00", "23:59")).toBe(1439);
  });

  it("wyrzuca blad przy a mniejszym niz b", () => {
    expect(() => getMinutesDifference("7:30", "09:00")).toThrow(
      "Invalid time format: 7:30. Expected HH:mm.",
    );
  });

  it("wyrzuca blad przy end time o nieprawidlowym formacie", () => {
    expect(() => getMinutesDifference("07:30", "24:00")).toThrow(
      "Invalid time format: 24:00. Expected HH:mm.",
    );
  });
});
