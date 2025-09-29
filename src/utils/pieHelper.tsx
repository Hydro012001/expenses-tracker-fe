import { Expenses } from "@/store/expensesStore";
import { isWithinInterval, parseISO } from "date-fns";

type CategoryBreakdown = { name: string; value: number };

interface CategoryBreakdownResult {
  filteredExpenses: Expenses[];
  breakdown: CategoryBreakdown[];
  paddedMax: number;
}

export function getCategoryBreakdown(
  data: Expenses[],
  startDate: string,
  endDate: string
): CategoryBreakdownResult {
  const filteredExpenses = data.filter((expense) => {
    const expenseDate = parseISO(String(expense.createdAt));
    return isWithinInterval(expenseDate, { start: startDate, end: endDate });
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
