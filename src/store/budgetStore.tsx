import { api } from "@/utils/apiHelper";
import { create } from "zustand";

interface Budget {
  id?: number;
  amount: string;
  budgetType: string;
  startDate: Date;
  endDate: Date;
}

interface BudgetExpense {
  budget: Budget;
  remaining: number;
  totalExpenses: number;
}

interface BudgetResponse {
  data: Budget[];
  totalAmount: number;
}

interface BudgetStoreState {
  budget: Budget;
  totalBudgetExpenses: BudgetExpense;
  budgetFetch: BudgetResponse;
  setBudget: (newBudget: Partial<Budget>) => void;
  getBudgetByID: (budgetId: string) => void;
  saveBudget: (newBudget: Budget) => Promise<void>;
  getBudgetByDateRange: () => Promise<void>;
  getBudgetDate: (currentDate: string) => void;
}

export const budgetStore = create<BudgetStoreState>()((set) => ({
  budgetFetch: {
    data: [],
    totalAmount: 0,
  },
  budget: {
    amount: "",
    budgetType: "",
    startDate: new Date(),
    endDate: new Date(),
  },
  totalBudgetExpenses: {
    budget: {
      id: 0,
      amount: "",
      budgetType: "",
      startDate: new Date(),
      endDate: new Date(),
    },
    remaining: 0,
    totalExpenses: 0,
  },
  setBudget: (newBudget) =>
    set((state) => ({ budget: { ...state.budget, ...newBudget } })),

  getBudgetByID: async (budgetId: string) => {
    console.log("Budget Get");
    try {
      const result = await api.get("/budget/get-budget/" + budgetId);
      set({ budget: result.data });
    } catch (error) {
      console.error("Error:", error);
    }
  },
  getBudgetByDateRange: async () => {
    try {
      const result = await api.get("/budget/get-budget");

      set({ totalBudgetExpenses: result.data });
    } catch (error) {
      console.error("Error:", error);
    }
  },

  getBudgetDate: async (currentDate: string) => {
    try {
      const result = await api.post("/budget/get-budget-date", {
        currentDate: currentDate,
      });
      set({ budget: result.data });
    } catch (error) {
      console.error("Error:", error);
    }
  },

  saveBudget: async (budgetLocal: Budget): Promise<void> => {
    try {
      const result = await api.post("/budget/add", budgetLocal);
      console.log(result.data);
    } catch (error) {
      console.error("Error:", error);
    }
  },
}));
