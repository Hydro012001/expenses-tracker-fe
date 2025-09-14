import { api } from "@/utils/apiHelper";
import { create } from "zustand";

export interface Expenses {
  id?: number;
  amount: string;
  expensesType: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExpensesDateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface ExpensesResponse {
  data: Expenses[];
  totalAmount: number;
}

interface ExpensesStoreState {
  expensesDate: ExpensesDateRange;
  expenses: Expenses;
  expensesFetch: ExpensesResponse;
  expensesLocal: Expenses[];
  setExpenses: (newExpenses: Partial<Expenses>) => void;
  setExpensesDate: (expensesDate: ExpensesDateRange) => void;
  getExpenses: (
    budgteId: number,
    endData: Date,
    startDate: Date
  ) => Promise<void>;
  expensesLocalSave: (newExpenses: Expenses[]) => void;
  saveExpense: (newExpenses: Expenses[]) => Promise<void>;
  clear: () => void;
  clearLocal: () => void;
}

export const expensesStore = create<ExpensesStoreState>()((set) => ({
  expensesFetch: {
    data: [],
    totalAmount: 0,
  },
  expensesLocal: [],
  expenses: {
    amount: "",
    expensesType: "",
    userId: 0,
  },
  expensesDate: {
    startDate: new Date(),
    endDate: new Date(),
  },
  setExpenses: (newExpenses) =>
    set((state) => ({ expenses: { ...state.expenses, ...newExpenses } })),
  setExpensesDate: (expensesDate: ExpensesDateRange) =>
    set(() => ({
      expensesDate: expensesDate,
    })),
  getExpenses: async (budgetId: number, endDate: Date, startDate: Date) => {
    try {
      const result = await api.post("/expenses/get-expenses", {
        budgetId,
        endDate,
        startDate,
      });
      set({ expensesFetch: result.data });
    } catch (error) {
      console.error("Error:", error);
    }
  },

  saveExpense: async (expensesLocal: Expenses[]): Promise<void> => {
    try {
      const result = await api.post("/expenses/add", expensesLocal);
      console.log(result.data);
    } catch (error) {
      console.error("Error:", error);
    }
  },
  expensesLocalSave: (newExpense) =>
    set((state) => ({
      expensesLocal: [...newExpense, ...state.expensesLocal],
    })),

  clear: () =>
    set(() => ({
      expenses: {
        amount: "",
        expensesType: "",
        userId: 0,
      },
    })),
  clearLocal: () =>
    set(() => ({
      expensesLocal: [],
    })),
}));
