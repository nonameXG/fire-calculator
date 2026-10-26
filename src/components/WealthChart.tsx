import { useMemo } from "react";
import { formatCurrency, type FireYear } from "@/lib/fire";

interface WealthChartProps {
  series: FireYear[];
  fireNumber: number;
  reached: boolean;
}

export default function WealthChart({ series, fireNumber, reached }: WealthChartProps) {
  const W = 920;
  const H = 400;
  const pad = { top: 28, right: 32, bottom: 36, left: 76 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  const { areaPath, linePath, points, fireY, fireX, xTicks, yTicks, lastFiIndex } = useMemo(() => {
    const fiIdxFull = series.findIndex((y) => y.isFi);
    const cutoff = reached && fiIdxFull >= 0 ? fiIdxFull + 1 : series.length;
    const displayed = series.slice(0, Math.max(2, cutoff));
    const maxNet = Math.max(fireNumber * 1.18, ...displayed.map((y) => y.netWorth)) * 1.04;

    const xFor = (i: number) => pad.left + (i / (displayed.length - 1)) * iw;
    const yFor = (v: number) => pad.top + ih - (v / maxNet) * ih;

    const pts = displayed.map((y, i) => ({ x: xFor(i), y: yFor(y.netWorth), d: y }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const area =
      `M ${pts[0].x.toFixed(1)} ${(pad.top + ih).toFixed(1)} ` +
      pts.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
      ` L ${pts[pts.length - 1].x.toFixed(1)} ${(pad.top + ih).toFixed(1)} Z`;

    const fy = yFor(fireNumber);
    const fiIdx = displayed.findIndex((y) => y.isFi);
    const fxi = fiIdx >= 0 ? xFor(fiIdx) : pad.left;

    const tickCount = 5;
    const rawTicks = Array.from({ length: tickCount }, (_, i) => (maxNet / (tickCount - 1)) * i);
    const yT = rawTicks.map((v) => ({ v, y: yFor(v) }));

    const step = Math.max(1, Math.round(displayed.length / 7));
    const xT: { label: string; x: number }[] = [];
    for (let i = 0; i < displayed.length; i += step) {
      xT.push({ label: String(displayed[i].year), x: xFor(i) });
    }
    if (xT.length > 0 && xT[xT.length - 1].label !== String(displayed[displayed.length - 1].year)) {
      xT.push({ label: String(displayed[displayed.length - 1].year), x: xFor(displayed.length - 1) });
    }

    return { areaPath: area, linePath: line, points: pts, fireY: fy, fireX: fxi, xTicks: xT, yTicks: yT, lastFiIndex: fiIdx };
  }, [series, fireNumber, reached, iw, ih, pad.left, pad.right, pad.top]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Glowing gradient fill */}
        <linearGradient id="wealthFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#10b981" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wealthLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="60%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <filter id="lineGlow" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft crosshair indicators — only at FI crossover */}
      {reached && lastFiIndex > 0 && (
        <g stroke="#34d399" strokeWidth={1} opacity={0.18}>
          <line x1={fireX} x2={fireX} y1={pad.top} y2={H - pad.bottom} />
          <line x1={pad.left} x2={W - pad.right} y1={fireY} y2={fireY} />
        </g>
      )}

      {/* Minimal y-axis labels (no gridlines) */}
      {yTicks.map((t, i) => (
        <text
          key={`y${i}`}
          x={pad.left - 12}
          y={t.y + 4}
          textAnchor="end"
          fill="#3f4655"
          fontSize="11"
          className="tabular-nums"
        >
          {formatCurrency(t.v, true)}
        </text>
      ))}

      {/* x-axis labels */}
      {xTicks.map((t, i) => (
        <text
          key={`x${i}`}
          x={t.x}
          y={H - pad.bottom + 22}
          textAnchor="middle"
          fill="#3f4655"
          fontSize="11"
          className="tabular-nums"
        >
          {t.label}
        </text>
      ))}

      {/* FIRE target line — subtle dashed */}
      <line
        x1={pad.left}
        x2={W - pad.right}
        y1={fireY}
        y2={fireY}
        stroke="#6ee7b7"
        strokeWidth={1}
        strokeDasharray="2 5"
        opacity={0.45}
      />
      <text
        x={W - pad.right - 4}
        y={fireY - 7}
        textAnchor="end"
        fill="#34d399"
        fontSize="10.5"
        className="font-medium"
      >
        FIRE target · {formatCurrency(fireNumber, true)}
      </text>

      {/* Glowing area + line */}
      <path d={areaPath} fill="url(#wealthFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="url(#wealthLine)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#lineGlow)"
      />

      {/* FI crossover marker */}
      {reached && lastFiIndex > 0 && (
        <g filter="url(#dotGlow)">
          <circle
            cx={points[lastFiIndex].x}
            cy={points[lastFiIndex].y}
            r={5}
            fill="#34d399"
            stroke="#08090c"
            strokeWidth={2}
          />
        </g>
      )}
    </svg>
  );
}
