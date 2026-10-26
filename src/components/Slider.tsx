import { useState, useCallback } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  prefix?: string;
  format?: (value: number) => string;
  badge?: (value: number) => string;
  suffix?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  badge,
  suffix,
}: SliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const display = format ? format(value) : value.toLocaleString("en-US");

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
  const badgeText = badge ? badge(value) : null;

  return (
    <div className="group py-3">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </label>
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
            className="w-32 text-right text-base font-semibold tabular-nums text-jade-400 bg-obsidian-800 rounded-md px-2 py-1 outline-none ring-1 ring-jade-500/50"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(String(value));
              setIsEditing(true);
            }}
            className="text-base font-semibold tabular-nums text-zinc-100 hover:text-jade-400 transition-colors cursor-text rounded px-1"
            title="Click to type a value"
          >
            {display}
            {suffix && <span className="text-zinc-500 ml-1 text-sm font-normal">{suffix}</span>}
          </button>
        )}
      </div>

      {/* Slim indicator bar with glowing fill */}
      <div className="relative flex items-center h-3">
        <div className="absolute inset-x-0 h-px bg-obsidian-700" />
        <div
          className="absolute h-px bg-gradient-to-r from-jade-600 to-jade-400"
          style={{ width: `${percent}%`, boxShadow: "0 0 8px rgba(52, 211, 153, 0.5)" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="prem-range relative z-10"
          aria-label={label}
        />
        {/* Micro-badge floating above thumb */}
        {badgeText && (
          <div
            className="pointer-events-none absolute -top-7 z-20 -translate-x-1/2 transition-opacity duration-150 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            style={{ left: `${percent}%` }}
          >
            <div className="px-2 py-0.5 rounded-md bg-obsidian-800 border border-obsidian-700 text-[10px] font-medium text-jade-400 whitespace-nowrap shadow-lg">
              {badgeText}
            </div>
            <div className="w-1.5 h-1.5 rotate-45 bg-obsidian-800 border-r border-b border-obsidian-700 mx-auto -mt-[3px]" />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-zinc-600 tabular-nums">{min.toLocaleString("en-US")}</span>
        <span className="text-[10px] text-zinc-600 tabular-nums">{max.toLocaleString("en-US")}</span>
      </div>
    </div>
  );
}
