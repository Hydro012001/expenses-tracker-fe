import { api } from "@/utils/apiHelper";
import { format } from "date-fns";
import { create } from "zustand";
import { useAlertStore } from "./alertStore";
import { handleAxiosError } from "@/utils/axiosErrorHelper";

export interface Expenses {
  id?: number;
  amount: string;
  expensesType: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ExpensesDateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface ExpensesResponse {
  expenses: Expenses[];
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
    expenses: [],
  },
  expensesLocal: [],
  expenses: {
    amount: "",
    expensesType: "",
    userId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
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
      const selectedEnd = new Date(endDate);
      selectedEnd.setHours(23, 59, 59, 999);

      const formattedEnd = format(selectedEnd, "yyyy-MM-dd'T'HH:mm:ssXXX");
      const result = await api.post("/expenses/get-expenses", {
        budgetId,
        endDate: formattedEnd,
        startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      });
      set({ expensesFetch: result.data });
    } catch (error) {
      console.error("Error:", error);
    }
  },

  saveExpense: async (expensesLocal: Expenses[]): Promise<void> => {
    try {
      await api.post("/expenses/add", expensesLocal);
      const { showAlert } = useAlertStore.getState();
      showAlert(`Budget has been added successfully!`, "success", "Success");
    } catch (error) {
      handleAxiosError(error);
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })),
  clearLocal: () =>
    set(() => ({
      expensesLocal: [],
    })),
}));
