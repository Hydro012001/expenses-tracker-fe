import { Expenses } from "@/store/expensesStore";
import { isWithinInterval } from "date-fns";
import { normalizeToDate } from "./helpers";

type CategoryBreakdown = { name: string; value: number };

interface CategoryBreakdownResult {
  filteredExpenses: Expenses[];
  breakdown: CategoryBreakdown[];
  paddedMax: number;
}

export function getCategoryBreakdown(
  data: Expenses[],
  startDate: string | Date,
  endDate: Date | string
): CategoryBreakdownResult {
  const filteredExpenses = data.filter((expense) => {
    const expenseDate = normalizeToDate(expense.createdAt);
    if (!expenseDate) return false;
    const start = normalizeToDate(startDate);
    const end = normalizeToDate(endDate);

    if (!start || !end) return false;

    return isWithinInterval(expenseDate, {
      start,
      end,
    });
  });

  // reduce by category
  const breakdownMap = filteredExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      acc[expense.expensesType] =
        (acc[expense.expensesType] || 0) + Number(expense.amount);
      return acc;
    },
    {}
  );

  const maxAmount = Math.max(...filteredExpenses.map((e) => Number(e.amount)));
  const paddedMax = maxAmount + 100;

  const breakdown = Object.entries(breakdownMap).map(([name, value]) => ({
    name,
    value,
  }));

  return { filteredExpenses, breakdown, paddedMax };
}
