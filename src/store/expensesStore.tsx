import { api } from "@/utils/apiHelper";
import { create } from "zustand";

interface Expenses {
  id?: number;
  amount: string;
  expensesType: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ExpensesResponse {
  data: Expenses[];
  totalAmount: number;
}

interface ExpensesStoreState {
  expenses: Expenses;
  expensesFetch: ExpensesResponse;
  expensesLocal: Expenses[];
  setExpenses: (newExpenses: Partial<Expenses>) => void;
  getExpenses: () => void;
  expensesLocalSave: (newExpenses: Expenses[]) => void;
  saveExpense: (newExpenses: Expenses[]) => Promise<void>;
  clear: () => void;
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
  setExpenses: (newExpenses) =>
    set((state) => ({ expenses: { ...state.expenses, ...newExpenses } })),

  getExpenses: async () => {
    console.log("Expenses Get");
    try {
      const result = await api.get("/expenses/get-expenses/" + 1);
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
}));
