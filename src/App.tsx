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
import { Flame, TrendingUp, PiggyBank, Sparkles, ExternalLink, Info } from "lucide-react";

const AFFILIATE_URL = "#"; // Replace with your affiliate link

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${accent}`}>
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white shadow-sm">
              <Flame size={20} />
            </span>
            <div>
              <h1 className="text-lg font-bold leading-tight">FIRE Timeline</h1>
              <p className="text-[11px] text-slate-500 leading-tight">Financial Independence Calculator</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles size={14} className="text-amber-500" />
            <span>4% rule · 7% real return</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        {/* Inputs panel */}
        <section className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-5">
              Your Finances
            </h2>
            <div className="space-y-7">
              <Slider
                label="Monthly Income"
                value={inputs.monthlyIncome}
                min={0}
                max={30000}
                step={100}
                onChange={update("monthlyIncome")}
                prefix="$"
                format={(v) => formatCurrencyFull(v)}
              />
              <Slider
                label="Monthly Expenses"
                value={inputs.monthlyExpenses}
                min={0}
                max={30000}
                step={100}
                onChange={update("monthlyExpenses")}
                prefix="$"
                format={(v) => formatCurrencyFull(v)}
                hint={`${savingsRate}% savings rate`}
              />
              <Slider
                label="Current Age"
                value={inputs.currentAge}
                min={16}
                max={75}
                step={1}
                onChange={update("currentAge")}
                format={(v) => `${v} yrs`}
              />
              <Slider
                label="Current Net Worth"
                value={inputs.currentNetWorth}
                min={-500000}
                max={2000000}
                step={1000}
                onChange={update("currentNetWorth")}
                prefix="$"
                format={(v) => formatCurrencyFull(v)}
              />
            </div>
          </div>

          {/* Affiliate slot */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -right-10 bottom-2 w-16 h-16 rounded-full bg-white/10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank size={20} />
                <h3 className="font-bold">Grow your savings faster</h3>
              </div>
              <p className="text-sm text-emerald-50/90 mb-4 leading-relaxed">
                Park your emergency fund in a high-yield savings account and watch compound
                interest do the work. Today's top accounts offer well above the national average.
              </p>
              <a
                href={AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 bg-white text-emerald-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Compare top savings rates <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* Results panel */}
        <section className="space-y-6">
          {/* Hero result */}
          <div className="rounded-3xl bg-slate-900 text-white p-7 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative">
              {result.monthlySavings <= 0 ? (
                <>
                  <p className="text-emerald-300 text-sm font-medium mb-1">Action needed</p>
                  <h2 className="text-2xl font-bold mb-2">You're spending more than you earn</h2>
                  <p className="text-slate-300 text-sm max-w-md leading-relaxed">
                    Lower your expenses or raise your income to start building toward financial
                    independence.
                  </p>
                </>
              ) : !result.reached ? (
                <>
                  <p className="text-emerald-300 text-sm font-medium mb-1">Projection beyond 60 years</p>
                  <h2 className="text-2xl font-bold mb-2">FIRE is far off — keep going</h2>
                  <p className="text-slate-300 text-sm max-w-md leading-relaxed">
                    At your current savings rate you wouldn't reach your FIRE number within 60 years.
                    Increasing income or cutting expenses will shorten the timeline dramatically.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-emerald-300 text-sm font-medium mb-1">You'll reach FIRE in</p>
                  <div className="flex items-baseline gap-3 mb-2">
                    <h2 className="text-5xl font-bold tabular-nums">
                      {result.yearsToFire}
                      <span className="text-2xl font-semibold text-slate-300 ml-2">years</span>
                    </h2>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Target age{" "}
                    <span className="font-semibold text-white">{result.retirementAge}</span> ·
                    projected year{" "}
                    <span className="font-semibold text-white">{result.retirementYear}</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="FIRE Number"
              value={formatCurrency(result.fireNumber, true)}
              sub="25× annual expenses"
              icon={<Flame size={16} className="text-amber-600" />}
              accent="bg-amber-100"
            />
            <StatCard
              label="Monthly Savings"
              value={formatCurrency(result.monthlySavings, true)}
              sub={`${savingsRate}% savings rate`}
              icon={<PiggyBank size={16} className="text-emerald-600" />}
              accent="bg-emerald-100"
            />
            <StatCard
              label="Annual Savings"
              value={formatCurrency(result.annualSavings, true)}
              sub="invested each year"
              icon={<TrendingUp size={16} className="text-teal-600" />}
              accent="bg-teal-100"
            />
            <StatCard
              label="Retirement Age"
              value={result.reached ? String(result.retirementAge) : "—"}
              sub={result.reached ? `in ${result.yearsToFire} yrs` : "out of range"}
              icon={<Sparkles size={16} className="text-sky-600" />}
              accent="bg-sky-100"
            />
          </div>

          {/* Chart */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-800">Wealth Over Time</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  Net worth
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-0.5 bg-amber-500" />
                  FIRE target
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Assumes a 7% inflation-adjusted annual return and constant savings. The dotted line is
              your FIRE number — the point where 4% withdrawals cover your expenses.
            </p>
            <WealthChart
              series={result.series}
              fireNumber={result.fireNumber}
              reached={result.reached}
            />
          </div>
        </section>
      </main>

      {/* Disclaimer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-5 py-6">
          <div className="flex gap-3 text-sm text-slate-500 leading-relaxed">
            <Info size={18} className="shrink-0 mt-0.5 text-slate-400" />
            <p>
              <span className="font-semibold text-slate-600">Educational purposes only.</span> This
              calculator is not financial, investment, tax, or legal advice. Projections are
              simplified estimates based on constant returns, savings, and expenses, and do not
              account for taxes, inflation variations, market volatility, emergencies, or major life
              changes. Real-world results will differ. Always consult a qualified, licensed
              financial advisor before making decisions about your money. Affiliate links may earn
              this site a commission at no extra cost to you.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
