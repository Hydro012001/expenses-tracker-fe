import { api } from "@/utils/apiHelper";
import { create } from "zustand";
import { useAlertStore } from "./alertStore";
import { useButtonStateStore } from "./uiStateStore";
import { handleAxiosError } from "@/utils/axiosErrorHelper";
import { Expenses } from "./expensesStore";
import { endOfDay } from "date-fns";

interface Budget {
  id?: number;
  amount: string;
  budgetType: string;
  startDate: Date;
  endDate: Date;
}
interface DataBudgetExpense extends Budget {
  expenses: Expenses[];
}

interface ExpensesDateRange {
  startDate?: Date;
  endDate?: Date;
}

interface BudgetExpense {
  budget_expenses: DataBudgetExpense;
  remaining: number;
  totalExpenses: number;
}

interface BudgetResponse {
  data: Budget[];
  totalAmount: number;
}

interface BudgetStoreState {
  expensesDate: ExpensesDateRange;
  budget: Budget;
  totalBudgetExpenses: BudgetExpense;
  budgetFetch: BudgetResponse;
  selectBudgetIDData: number;
  setBudget: (newBudget: Partial<Budget>) => void;
  getBudgetByID: (budgetId: string) => void;
  saveBudget: (newBudget: Budget) => Promise<void>;
  getBudgetExpenses: (
    budgetId: number,
    endDate?: Date,
    startDate?: Date
  ) => Promise<void>;
  getBudgetDate: (currentDate: string) => void;
  getBudget: () => void;
  selectBudgetID: (id: number) => void;
  setExpensesDate: (expensesDate: ExpensesDateRange) => void;
}

export const budgetStore = create<BudgetStoreState>()((set) => ({
  budgetFetch: {
    data: [],
    totalAmount: 0,
  },
  expensesDate: {
    startDate: new Date(),
    endDate: new Date(),
  },
  budget: {
    amount: "",
    budgetType: "",
    startDate: new Date(),
    endDate: new Date(),
  },
  totalBudgetExpenses: {
    budget_expenses: {
      id: 0,
      amount: "",
      budgetType: "",
      startDate: new Date(),
      endDate: new Date(),
      expenses: [],
    },
    remaining: 0,
    totalExpenses: 0,
  },
  selectBudgetIDData: 0,
  selectBudgetID: (id) =>
    set(() => ({
      selectBudgetIDData: id,
    })),
  setBudget: (newBudget) =>
    set((state) => ({ budget: { ...state.budget, ...newBudget } })),
  setExpensesDate: (expensesDate: ExpensesDateRange) =>
    set(() => ({
      expensesDate: expensesDate,
    })),

  getBudgetExpenses: async (
    budgetId: number,
    endDate?: Date,
    startDate?: Date
  ) => {
    try {
      const normalizeToDate = (date?: Date) => {
        if (!date) return null;
        return endOfDay(date);
      };
      const result = await api.post("/budget/get-budget-expenses/", {
        budgetId,
        endDate: normalizeToDate(endDate),
        startDate: normalizeToDate(startDate),
      });

      set({
        totalBudgetExpenses: result.data,
      });
      set({
        expensesDate: {
          startDate: result.data.budget_expenses.startDate,
          endDate: endDate,
        },
      });

      console.log("totalBudgetExpenses", result.data);
    } catch (error) {
      console.error("Error:", error);
    }
  },

  getBudgetByID: async (budgetId: string) => {
    console.log("Budget Get");
    try {
      const result = await api.get("/budget/get-budget/" + budgetId);
      set({ budget: result.data });
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
      await api.post("/budget/add", budgetLocal);
      const { showAlert } = useAlertStore.getState();
      showAlert(`Budget has been added successfully!`, "success", "Success");
    } catch (error) {
      handleAxiosError(error);
    }
  },
  getBudget: async (): Promise<void> => {
    try {
      const result = await api.get("/budget/get-all-budget");

      if (result.data.data.length === 0) {
        const { setDisabled } = useButtonStateStore.getState();
        setDisabled(true);
      }
      set({ budgetFetch: result.data });
      const firstBudgetId = result.data.data?.[0]?.id ?? null;

      if (firstBudgetId !== null) {
        set(() => ({
          selectBudgetIDData: firstBudgetId, // ✅ now this matches type
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  },
}));
