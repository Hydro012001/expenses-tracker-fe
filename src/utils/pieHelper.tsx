import { ExpensesResponse, Expenses } from "@/store/expensesStore";

type CategoryBreakdown = { name: string; value: number };

interface CategoryBreakdownResult {
  filteredExpenses: Expenses[];
  breakdown: CategoryBreakdown[];
  paddedMax: number;
}

export function getCategoryBreakdown(
  expenses: ExpensesResponse,
  selectedMonth: string
): CategoryBreakdownResult {
  // filter by month
  const filteredExpenses = expenses.data.filter(
    (expense) =>
      new Date(String(expense.createdAt)).toLocaleString("default", {
        month: "long",
      }) === selectedMonth
  );

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
