import { budgetStore } from "@/store/budgetStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { format } from "date-fns";
export default function BudgetDropwdown() {
  const { getBudget, budgetFetch, selectBudgetID, selectBudgetIDData } =
    budgetStore();
  useEffect(() => {
    getBudget();
  }, [getBudget]);
  return (
    <div className="flex flex-col space-y-1.5">
      <Select
        onValueChange={(value) => selectBudgetID(Number(value))}
        value={selectBudgetIDData ? String(selectBudgetIDData) : undefined}
        disabled={budgetFetch.data.length === 0}
      >
        <SelectTrigger id="expenses">
          <SelectValue
            placeholder={
              budgetFetch.data.length > 0 ? "Select budget" : "No Budget"
            }
          />
        </SelectTrigger>

        {budgetFetch.data.length > 0 && (
          <SelectContent position="popper">
            {budgetFetch.data.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.budgetType} | {format(item.startDate, "MMM d, yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>
    </div>
  );
}
