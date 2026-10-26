import { useRef, useState, useCallback } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  prefix?: string;
  format?: (value: number) => string;
  hint?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix,
  format,
  hint,
}: SliderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const display = format ? format(value) : `${prefix ?? ""}${value.toLocaleString("en-US")}`;

  const commit = useCallback(
    (raw: string) => {
      const parsed = Number(raw.replace(/[^0-9.-]/g, ""));
      if (!Number.isNaN(parsed)) {
        const clamped = Math.min(max, Math.max(min, parsed));
        const snapped = Math.round(clamped / step) * step;
        onChange(snapped);
      }
      setDraft(String(value));
    },
    [max, min, onChange, step, value]
  );

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="group">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              commit(draft);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commit(draft);
                setIsEditing(false);
              }
              if (e.key === "Escape") {
                setDraft(String(value));
                setIsEditing(false);
              }
            }}
            className="w-28 text-right text-lg font-semibold tabular-nums text-emerald-700 bg-emerald-50 rounded px-2 py-0.5 outline-none ring-2 ring-emerald-300"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(String(value));
              setIsEditing(true);
            }}
            className="text-lg font-semibold tabular-nums text-emerald-700 hover:text-emerald-800 transition-colors cursor-text rounded px-1"
            title="Click to type a value"
          >
            {display}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="fire-range w-full"
        style={
          {
            "--pct": `${percent}%`,
          } as React.CSSProperties
        }
      />
      <div className="flex justify-between mt-1">
        <span className="text-[11px] text-slate-400">
          {prefix ?? ""}{min.toLocaleString("en-US")}
        </span>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
        <span className="text-[11px] text-slate-400">
          {prefix ?? ""}{max.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}
