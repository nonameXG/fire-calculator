export interface FireInputs {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentAge: number;
  currentNetWorth: number;
}

export interface FireYear {
  year: number;
  age: number;
  netWorth: number;
  isFi: boolean;
}

export interface FireResult {
  monthlySavings: number;
  annualSavings: number;
  annualExpenses: number;
  fireNumber: number;
  yearsToFire: number | null;
  retirementAge: number | null;
  retirementYear: number | null;
  reached: boolean;
  series: FireYear[];
}

export const DEFAULT_INPUTS: FireInputs = {
  monthlyIncome: 8000,
  monthlyExpenses: 4000,
  currentAge: 30,
  currentNetWorth: 50000,
};

// Conservative long-term real return assumption (after inflation).
export const REAL_RETURN_RATE = 0.07;
export const WITHDRAWAL_RATE = 0.04;

export function calculateFire(inputs: FireInputs, maxYears = 60): FireResult {
  const { monthlyIncome, monthlyExpenses, currentAge, currentNetWorth } = inputs;

  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const annualSavings = monthlySavings * 12;
  const annualExpenses = monthlyExpenses * 12;
  const fireNumber = annualExpenses / WITHDRAWAL_RATE;

  const currentYear = new Date().getFullYear();
  const series: FireYear[] = [];

  let netWorth = currentNetWorth;
  let yearsToFire: number | null = null;

  for (let y = 0; y <= maxYears; y++) {
    const isFi = netWorth >= fireNumber;
    series.push({
      year: currentYear + y,
      age: currentAge + y,
      netWorth: Math.round(netWorth),
      isFi,
    });

    if (isFi && yearsToFire === null) {
      yearsToFire = y;
    }

    if (y < maxYears) {
      netWorth = netWorth * (1 + REAL_RETURN_RATE) + annualSavings;
    }
  }

  const reached = yearsToFire !== null;
  const retirementAge = reached ? currentAge + yearsToFire! : null;
  const retirementYear = reached ? currentYear + yearsToFire! : null;

  return {
    monthlySavings,
    annualSavings,
    annualExpenses,
    fireNumber,
    yearsToFire,
    retirementAge,
    retirementYear,
    reached,
    series,
  };
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatCurrencyFull(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
