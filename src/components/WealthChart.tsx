import { useMemo } from "react";
import { formatCurrency, type FireYear } from "@/lib/fire";

interface WealthChartProps {
  series: FireYear[];
  fireNumber: number;
  reached: boolean;
}

export default function WealthChart({ series, fireNumber, reached }: WealthChartProps) {
  const W = 920;
  const H = 380;
  const pad = { top: 24, right: 28, bottom: 36, left: 72 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  const { areaPath, linePath, points, fireY, xTicks, yTicks, lastFiIndex } = useMemo(() => {
    const displayed = series.slice(0, reached ? Math.max(2, series.findIndex((y) => y.isFi) + 1) : series.length);
    const maxNet = Math.max(fireNumber * 1.15, ...displayed.map((y) => y.netWorth)) * 1.05;

    const xFor = (i: number) => pad.left + (i / (displayed.length - 1)) * iw;
    const yFor = (v: number) => pad.top + ih - (v / maxNet) * ih;

    const pts = displayed.map((y, i) => ({ x: xFor(i), y: yFor(y.netWorth), d: y }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const area =
      `M ${pts[0].x.toFixed(1)} ${pad.top + ih} ` +
      pts.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
      ` L ${pts[pts.length - 1].x.toFixed(1)} ${pad.top + ih} Z`;

    const fy = yFor(fireNumber);
    const fiIdx = displayed.findIndex((y) => y.isFi);

    // ~6 y ticks
    const tickCount = 6;
    const rawTicks = Array.from({ length: tickCount }, (_, i) => (maxNet / (tickCount - 1)) * i);
    const yT = rawTicks.map((v) => ({ v, y: yFor(v) }));

    // x ticks every ~5 years
    const step = Math.max(1, Math.round(displayed.length / 8));
    const xT: { label: string; x: number }[] = [];
    for (let i = 0; i < displayed.length; i += step) {
      xT.push({ label: String(displayed[i].year), x: xFor(i) });
    }

    return {
      areaPath: area,
      linePath: line,
      points: pts,
      fireY: fy,
      xTicks: xT,
      yTicks: yT,
      lastFiIndex: fiIdx,
    };
  }, [series, fireNumber, reached, iw, ih, pad.left, pad.right, pad.top]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="wealthFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="wealthLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* y gridlines + labels */}
      {yTicks.map((t, i) => (
        <g key={`y${i}`}>
          <line
            x1={pad.left}
            x2={W - pad.right}
            y1={t.y}
            y2={t.y}
            stroke="#e2e8f0"
            strokeWidth={1}
            strokeDasharray={i === 0 ? undefined : "3 4"}
          />
          <text
            x={pad.left - 10}
            y={t.y + 4}
            textAnchor="end"
            className="fill-slate-400"
            fontSize="11"
          >
            {formatCurrency(t.v, true)}
          </text>
        </g>
      ))}

      {/* x ticks */}
      {xTicks.map((t, i) => (
        <text
          key={`x${i}`}
          x={t.x}
          y={H - pad.bottom + 20}
          textAnchor="middle"
          className="fill-slate-400"
          fontSize="11"
        >
          {t.label}
        </text>
      ))}

      {/* FIRE number line */}
      <line
        x1={pad.left}
        x2={W - pad.right}
        y1={fireY}
        y2={fireY}
        stroke="#f59e0b"
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <text
        x={W - pad.right - 6}
        y={fireY - 6}
        textAnchor="end"
        className="fill-amber-600 font-semibold"
        fontSize="11"
      >
        FIRE target · {formatCurrency(fireNumber, true)}
      </text>

      {/* area + line */}
      <path d={areaPath} fill="url(#wealthFill)" />
      <path d={linePath} fill="none" stroke="url(#wealthLine)" strokeWidth={3} strokeLinejoin="round" />

      {/* FI crossover marker */}
      {reached && lastFiIndex > 0 && (
        <g>
          <circle
            cx={points[lastFiIndex].x}
            cy={points[lastFiIndex].y}
            r={6}
            fill="#10b981"
            stroke="white"
            strokeWidth={2.5}
          />
          <text
            x={points[lastFiIndex].x}
            y={points[lastFiIndex].y - 14}
            textAnchor="middle"
            className="fill-emerald-700 font-bold"
            fontSize="12"
          >
            {formatCurrency(points[lastFiIndex].d.netWorth, true)}
          </text>
        </g>
      )}

      {/* axis labels */}
      <text
        x={pad.left}
        y={H - 6}
        className="fill-slate-400"
        fontSize="11"
      >
        Year
      </text>
    </svg>
  );
}
