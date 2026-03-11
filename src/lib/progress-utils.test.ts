//kacper testuje to jak cos
import {
  computeBarHeight,
  computeMacroPercentages,
  computeStreak,
  computeDayProgress,
  getBarColor,
  computeWeeklyAverage,
  computeWeeklyMax,
  countDaysWithData,
  computeWeightTrend,
  computeWeightAverage,
  computeWeightRange,
  computeWeeklyGoalProgress,
  macroToPieAngle,
  enrichWeeklyWithGoal,
  isDaySuccessful,
  countSuccessfulDays,
} from "@/lib/progress-utils";

describe("progress utils widok postep", () => {
  describe("computeBarHeight wysokosc slupka", () => {
    it("daje procent jak value i max podasz", () => {
      expect(computeBarHeight(100, 200)).toBe(50);
    });

    it("sto procent jak rowne max", () => {
      expect(computeBarHeight(200, 200)).toBe(100);
    });

    it("min 4 jak cos tam wpiszesz", () => {
      expect(computeBarHeight(1, 10000)).toBe(4);
    });

    it("zero jak zero wpiszesz", () => {
      expect(computeBarHeight(0, 100)).toBe(0);
    });

    it("4 jak max zero zeby nie wywalilo", () => {
      expect(computeBarHeight(50, 0)).toBe(4);
    });
  });

  describe("computeMacroPercentages procenty makro", () => {
    it("liczy procenty jak suma wieksza od zera", () => {
      const result = computeMacroPercentages(50, 100, 50);
      expect(result[0].percent).toBe(25);
      expect(result[1].percent).toBe(50);
      expect(result[2].percent).toBe(25);
    });

    it("suma procentow to stowka", () => {
      const result = computeMacroPercentages(30, 40, 30);
      const sum = result.reduce((a, r) => a + r.percent, 0);
      expect(sum).toBeCloseTo(100);
    });
  });

  describe("computeStreak seria dni", () => {
    it("zero jak pusta tablica", () => {
      expect(computeStreak([])).toBe(0);
    });

    it("czworka jak ostatnie 4 dni ok", () => {
      const days = [
        { date: "1", consumed: 2200, goal: 2300 },
        { date: "2", consumed: 2400, goal: 2300 },
        { date: "3", consumed: 2280, goal: 2300 },
        { date: "4", consumed: 2350, goal: 2300 },
      ];
      expect(computeStreak(days, 10)).toBe(4);
    });

  });

  describe("computeDayProgress procent celu", () => {
    it("sto jak zjades dokladnie cel", () => {
      expect(computeDayProgress(2300, 2300)).toBe(100);
    });

    it("polowa jak polowe zjades", () => {
      expect(computeDayProgress(1150, 2300)).toBe(50);
    });

    it("max 150 nie wiecej", () => {
      expect(computeDayProgress(5000, 2300)).toBe(150);
    });

  });

  describe("getBarColor kolor slupka", () => {
    it("good jak w normie plus minus 10 proc", () => {
      expect(getBarColor(2300, 2300)).toBe("good");
      expect(getBarColor(2100, 2300)).toBe("good");
    });

    it("under jak za malo", () => {
      expect(getBarColor(1800, 2300)).toBe("under");
    });

    it("over jak za duzo", () => {
      expect(getBarColor(2600, 2300)).toBe("over");
    });
  });

  describe("computeWeeklyAverage srednia z tygodnia", () => {
    it("liczy srednia z 7 dni", () => {
      const weekly = [
        { day: "Pon", value: 2000 },
        { day: "Wt", value: 2200 },
        { day: "Sr", value: 2400 },
        { day: "Czw", value: 2100 },
        { day: "Pt", value: 2300 },
        { day: "Sob", value: 0 },
        { day: "Ndz", value: 0 },
      ];
      expect(computeWeeklyAverage(weekly)).toBeCloseTo(1571.43, 1);
    });

  });

  describe("computeWeeklyMax max do skali", () => {
    it("daje max z wartosci albo minBase", () => {
      const weekly = [{ day: "Pon", value: 2500 }];
      expect(computeWeeklyMax(weekly, 2300)).toBe(2500);
    });

  });

  describe("countDaysWithData dni z danymi", () => {
    it("liczy ile dni ma value wieksze od zera", () => {
      const weekly = [
        { day: "Pon", value: 2000 },
        { day: "Wt", value: 0 },
        { day: "Sr", value: 1500 },
      ];
      expect(countDaysWithData(weekly)).toBe(2);
    });

  });

  describe("computeWeightTrend trend wagi", () => {
    it("roznica ostatnia minus pierwsza", () => {
      const history = [
        { date: "01.01", weight: 85 },
        { date: "15.01", weight: 83 },
      ];
      expect(computeWeightTrend(history)).toBe(-2);
    });

    it("zero jak mniej niz 2 pomiary", () => {
      expect(computeWeightTrend([])).toBe(0);
      expect(computeWeightTrend([{ date: "01.01", weight: 85 }])).toBe(0);
    });
  });

  describe("computeWeightAverage srednia wagi", () => {
    it("liczy srednia", () => {
      const history = [
        { date: "1", weight: 84 },
        { date: "2", weight: 86 },
      ];
      expect(computeWeightAverage(history)).toBe(85);
    });

  });

  describe("computeWeightRange min max wagi", () => {
    it("daje min i max", () => {
      const history = [
        { date: "1", weight: 84 },
        { date: "2", weight: 86 },
        { date: "3", weight: 82 },
      ];
      expect(computeWeightRange(history)).toEqual({ min: 82, max: 86 });
    });

  });

  describe("computeWeeklyGoalProgress procent celu tygodnia", () => {
    it("liczy procent sumy do 7 razy cel", () => {
      const weekly = [
        { day: "Pon", value: 2300 },
        { day: "Wt", value: 2300 },
        { day: "Sr", value: 0 },
        { day: "Czw", value: 0 },
        { day: "Pt", value: 0 },
        { day: "Sob", value: 0 },
        { day: "Ndz", value: 0 },
      ];
      expect(computeWeeklyGoalProgress(weekly, 2300)).toBeCloseTo(28.57, 0);
    });

  });

  describe("macroToPieAngle kat do wykresu kolowego", () => {
    it("sto proc to 360 stopni", () => {
      expect(macroToPieAngle(100)).toBe(360);
    });

    it("polowa to 180", () => {
      expect(macroToPieAngle(50)).toBe(180);
    });

  });

  describe("enrichWeeklyWithGoal dodaje procent celu", () => {
    it("dodaje percentOfGoal do kazdego dnia", () => {
      const weekly = [
        { day: "Pon", value: 2300 },
        { day: "Wt", value: 1150 },
      ];
      const result = enrichWeeklyWithGoal(weekly, 2300);
      expect(result[0].percentOfGoal).toBe(100);
      expect(result[1].percentOfGoal).toBe(50);
    });

  });

  describe("isDaySuccessful czy dzien ok", () => {
    it("true jak w granicach plus minus 15 proc", () => {
      expect(isDaySuccessful(2300, 2300)).toBe(true);
      expect(isDaySuccessful(2000, 2300, 15)).toBe(true);
    });

    it("false jak za daleko od celu", () => {
      expect(isDaySuccessful(1500, 2300)).toBe(false);
    });

    it("false jak cel zero", () => {
      expect(isDaySuccessful(100, 0)).toBe(false);
    });
  });

  describe("countSuccessfulDays ile dni ok", () => {
    it("liczy dni co sa w normie", () => {
      const weekly = [
        { day: "Pon", value: 2300 },
        { day: "Wt", value: 2000 },
        { day: "Sr", value: 1500 },
      ];
      expect(countSuccessfulDays(weekly, 2300)).toBe(2);
    });
  });
});
