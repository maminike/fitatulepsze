"use client";

import { macroToPieAngle } from "@/lib/progress-utils";
import type { MacroPercent } from "@/lib/progress-utils";

const COLORS = {
  Białko: "#22c55e",
  Węgle: "#3b82f6",
  Tłuszcze: "#f59e0b",
} as const;

type Props = {
  macroPercents: MacroPercent[];
  size?: number;
};

export function MacroPieChart({ macroPercents, size = 80 }: Props) {
  const total = macroPercents.reduce((acc, m) => acc + m.percent, 0);
  if (total <= 0) {
    return (
      <div
        className="rounded-full bg-muted"
        style={{ width: size, height: size }}
      />
    );
  }

  let startAngle = 0;
  const segments = macroPercents.map((m) => {
    const angle = macroToPieAngle(m.percent);
    const segment = { ...m, startAngle, angle };
    startAngle += angle;
    return segment;
  });

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pathFor = (start: number, angle: number) => {
    if (angle <= 0) return "";
    const r = 50;
    const x1 = 50 + r * Math.cos(toRad(start - 90));
    const y1 = 50 + r * Math.sin(toRad(start - 90));
    const x2 = 50 + r * Math.cos(toRad(start + angle - 90));
    const y2 = 50 + r * Math.sin(toRad(start + angle - 90));
    const large = angle > 180 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className="rounded-full"
      style={{ width: size, height: size }}
    >
      {segments.map((s) => (
        <path
          key={s.label}
          d={pathFor(s.startAngle, s.angle)}
          fill={COLORS[s.label]}
          opacity={0.9}
        />
      ))}
    </svg>
  );
}
