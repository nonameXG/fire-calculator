import { useMemo, useState } from "react";
import {
  calculateFire,
  DEFAULT_INPUTS,
  formatCurrency,
  formatCurrencyFull,
  type FireInputs,
} from "@/lib/fire";
import Slider from "@/components/Slider";
import WealthChart from "@/components/WealthChart";
import {
  Flame,
  TrendingUp,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  Info,
  Target,
  Calendar,
  Wallet,
} from "lucide-react";

const AFFILIATE_URL = "#"; // Replace with your affiliate link

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-obsidian-850/60 border border-obsidian-750 p-4 backdrop-blur-sm transition-colors hover:border-obsidian-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-jade-400">{icon}</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      </div>
      <div className="text-xl font-bold text-zinc-100 tabular-nums">{value}</div>
      {sub && <div className="text-[11px] text-zinc-600 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function App() {
  const [inputs, setInputs] = useState<FireInputs>(DEFAULT_INPUTS);

  const result = useMemo(() => calculateFire(inputs), [inputs]);

  const update = (key: keyof FireInputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const savingsRate =
    inputs.monthlyIncome > 0
      ? Math.round((result.monthlySavings / inputs.monthlyIncome) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-obsidian-950 text-zinc-100 font-sans antialiased relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-jade-600/5 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-jade-500/4 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-obsidian-800 bg-obsidian-950/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-[1180px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-obsidian-850 border border-obsidian-700 text-jade-400">
              <Flame size={18} />
            </span>
            <div>
              <h1 className="text-[15px] font-semibold leading-tight text-zinc-100">FIRE Timeline</h1>
              <p className="text-[11px] text-zinc-500 leading-tight">Financial Independence Calculator</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-500 px-3 py-1.5 rounded-full bg-obsidian-850/60 border border-obsidian-800">
            <Sparkles size={13} className="text-jade-400" />
            <span>4% rule · 7% real return</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1180px] mx-auto px-6 py-10">
        {/* Asymmetrical layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-7 items-start">
          {/* LEFT: Inputs + conversion card */}
          <section className="space-y-5 animate-fade-in">
            {/* Inputs panel */}
            <div className="rounded-2xl bg-obsidian-900/60 border border-obsidian-800 backdrop-blur-md p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 mb-1">
                Your Finances
              </h2>
              <p className="text-[12px] text-zinc-600 mb-5">Drag the indicators to model your path.</p>
              <div className="divide-y divide-obsidian-800">
                <Slider
                  label="Monthly Income"
                  value={inputs.monthlyIncome}
                  min={0}
                  max={30000}
                  step={100}
                  onChange={update("monthlyIncome")}
                  format={(v) => formatCurrencyFull(v)}
                  badge={(v) => `${formatCurrency(v * 12, true)}/yr`}
                />
                <Slider
                  label="Monthly Expenses"
                  value={inputs.monthlyExpenses}
                  min={0}
                  max={30000}
                  step={100}
                  onChange={update("monthlyExpenses")}
                  format={(v) => formatCurrencyFull(v)}
                  badge={(v) =>
                    v < inputs.monthlyIncome
                      ? `Save ${formatCurrency(inputs.monthlyIncome - v, true)}/mo`
                      : "Over budget"
                  }
                />
                <Slider
                  label="Current Age"
                  value={inputs.currentAge}
                  min={16}
                  max={75}
                  step={1}
                  onChange={update("currentAge")}
                  format={(v) => `${v}`}
                  suffix="yrs"
                  badge={(v) => `Born ${new Date().getFullYear() - v}`}
                />
                <Slider
                  label="Current Net Worth"
                  value={inputs.currentNetWorth}
                  min={-500000}
                  max={2000000}
                  step={1000}
                  onChange={update("currentNetWorth")}
                  format={(v) => formatCurrencyFull(v)}
                  badge={(v) =>
                    v >= 0
                      ? `${formatCurrency(v, true)} today`
                      : `${formatCurrency(Math.abs(v), true)} debt`
                  }
                />
              </div>
            </div>

            {/* Premium conversion card — integrated, not ad-like */}
            <div className="relative rounded-2xl bg-obsidian-900/80 border border-obsidian-800 backdrop-blur-md p-6 overflow-hidden group">
              {/* Subtle border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 0 1px rgba(52, 211, 153, 0.12), 0 0 40px -8px rgba(16, 185, 129, 0.25)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-obsidian-850 border border-obsidian-700 text-jade-400">
                    <PiggyBank size={16} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">Accelerate your timeline</h3>
                    <p className="text-[11px] text-zinc-500">High-yield cash reserve</p>
                  </div>
                </div>
                <p className="text-[13px] text-zinc-400 mb-5 leading-relaxed">
                  Park your emergency fund in a high-yield savings account. Today's top rates run
                  well above the national average — every basis point compounds.
                </p>
                <a
                  href={AFFILIATE_URL}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="relative inline-flex items-center gap-2 bg-jade-500 text-obsidian-950 font-semibold text-[13px] px-5 py-2.5 rounded-full hover:bg-jade-400 transition-all duration-200"
                  style={{ boxShadow: "0 8px 24px -6px rgba(16, 185, 129, 0.5)" }}
                >
                  View top savings rates
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </section>

          {/* RIGHT: Results */}
          <section className="space-y-5 animate-fade-in">
            {/* Hero result */}
            <div className="relative rounded-2xl bg-obsidian-900/60 border border-obsidian-800 backdrop-blur-md p-7 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-jade-500/8 blur-[80px]" />
              <div className="relative">
                {result.monthlySavings <= 0 ? (
                  <>
                    <p className="text-jade-400 text-[11px] font-medium uppercase tracking-[0.16em] mb-2">
                      Action needed
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                      You're spending more than you earn
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                      Lower your expenses or raise your income to begin building toward financial
                      independence.
                    </p>
                  </>
                ) : !result.reached ? (
                  <>
                    <p className="text-jade-400 text-[11px] font-medium uppercase tracking-[0.16em] mb-2">
                      Projection beyond 60 years
                    </p>
                    <h2 className="text-2xl font-bold text-zinc-100 mb-2">FIRE is far off — keep going</h2>
                    <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                      At your current savings rate you wouldn't reach your FIRE number within 60
                      years. Increasing income or cutting expenses shortens the timeline dramatically.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-jade-400 text-[11px] font-medium uppercase tracking-[0.16em] mb-1.5">
                      You'll reach FIRE in
                    </p>
                    <div className="flex items-baseline gap-3 mb-3">
                      <h2 className="text-6xl font-bold tabular-nums text-zinc-100 tracking-tight">
                        {result.yearsToFire}
                      </h2>
                      <span className="text-xl font-medium text-zinc-500">years</span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-zinc-600" />
                        Target age{" "}
                        <span className="font-semibold text-zinc-100">{result.retirementAge}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Target size={14} className="text-zinc-600" />
                        Projected year{" "}
                        <span className="font-semibold text-zinc-100">{result.retirementYear}</span>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="FIRE Number"
                value={formatCurrency(result.fireNumber, true)}
                sub="25× annual expenses"
                icon={<Target size={15} />}
              />
              <StatCard
                label="Monthly Savings"
                value={formatCurrency(result.monthlySavings, true)}
                sub={`${savingsRate}% savings rate`}
                icon={<Wallet size={15} />}
              />
              <StatCard
                label="Annual Savings"
                value={formatCurrency(result.annualSavings, true)}
                sub="invested each year"
                icon={<TrendingUp size={15} />}
              />
              <StatCard
                label="Retirement Age"
                value={result.reached ? String(result.retirementAge) : "—"}
                sub={result.reached ? `in ${result.yearsToFire} yrs` : "out of range"}
                icon={<Sparkles size={15} />}
              />
            </div>

            {/* Chart — dark canvas */}
            <div className="rounded-2xl bg-obsidian-900/60 border border-obsidian-800 backdrop-blur-md p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-zinc-200">Wealth Over Time</h3>
                <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-[2px] rounded-full bg-gradient-to-r from-jade-600 to-jade-400" />
                    Net worth
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-px bg-jade-300 opacity-60" />
                    FIRE target
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-600 mb-4">
                Assumes a 7% inflation-adjusted annual return and constant savings. The dashed line
                marks your FIRE number — where 4% withdrawals cover your expenses.
              </p>
              <WealthChart
                series={result.series}
                fireNumber={result.fireNumber}
                reached={result.reached}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Disclaimer */}
      <footer className="relative z-10 border-t border-obsidian-800 bg-obsidian-950/70 backdrop-blur-sm">
        <div className="max-w-[1180px] mx-auto px-6 py-6">
          <div className="flex gap-3 text-[12px] text-zinc-600 leading-relaxed">
            <Info size={16} className="shrink-0 mt-0.5 text-zinc-700" />
            <p>
              <span className="font-semibold text-zinc-500">Educational purposes only.</span> This
              calculator is not financial, investment, tax, or legal advice. Projections are
              simplified estimates based on constant returns, savings, and expenses, and do not
              account for taxes, inflation variations, market volatility, emergencies, or major life
              changes. Real-world results will differ. Always consult a qualified, licensed financial
              advisor before making decisions about your money. Affiliate links may earn this site a
              commission at no extra cost to you.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
