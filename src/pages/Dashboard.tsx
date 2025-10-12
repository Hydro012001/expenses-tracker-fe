import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PieChart,
  LineChart,
  Line,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { expensesStore } from "@/store/expensesStore";
import { Plus, ReceiptText } from "lucide-react";
import { budgetStore } from "@/store/budgetStore";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/custom/daterange";
import { DatePickerWithRangePopover } from "@/components/custom/daterangepopover";
import { getCategoryBreakdown } from "@/utils/pieHelper";
import BudgetDropwdown from "@/components/services/budget_dropdown";
import { useButtonStateStore } from "@/store/uiStateStore";
import {
  TooltipProvider,
  Tooltip as ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function Dashboard() {
  const { disabled, setDisabled } = useButtonStateStore();
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
  ];
  const {
    setExpenses,
    expenses,
    expensesLocal,
    expensesLocalSave,
    saveExpense,
    clearLocal,
    clear,
  } = expensesStore();
  const {
    getBudgetExpenses,
    totalBudgetExpenses,
    setBudget,
    budget,
    saveBudget,
    selectBudgetIDData,
    getBudget,
    expensesDate,
    setExpensesDate,
  } = budgetStore();

  const { filteredExpenses, breakdown, paddedMax } = getCategoryBreakdown(
    totalBudgetExpenses.budget_expenses.expenses,
    String(expensesDate?.startDate),
    String(expensesDate?.endDate)
  );

  useEffect(() => {
    if (!selectBudgetIDData || !totalBudgetExpenses.budget_expenses.startDate)
      return;
    getBudgetExpenses(
      selectBudgetIDData,
      expensesDate?.endDate,
      expensesDate?.startDate
    );
  }, [
    setExpensesDate,
    selectBudgetIDData,
    getBudgetExpenses,
    totalBudgetExpenses.budget_expenses.startDate,
    expensesDate.endDate,
    expensesDate.startDate,
  ]);

  const handlePartialSave = () => {
    const data = {
      budgetId: totalBudgetExpenses.budget_expenses.id,
      ...expenses,
    };
    expensesLocalSave([data]);
    clear();
  };

  const handleSave = async () => {
    await saveExpense(expensesLocal);
    getBudgetExpenses(
      selectBudgetIDData,
      expensesDate?.endDate,
      totalBudgetExpenses.budget_expenses.startDate
    );
    clearLocal();
  };
  const handleSaveBudget = async () => {
    await saveBudget(budget);
    getBudget();

    window.location.reload();
    // getBudgetExpenses(
    //   selectBudgetIDData,
    //   expensesDate?.endDate,
    //   totalBudgetExpenses.budget_expenses.startDate
    // );

    setDisabled(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex w-full justify-between gap-2 ">
        <div className="flex flex-col items-start ">
          <Label className=" text-sm mb-1 flex items-center gap-1">
            <ReceiptText className="" />
            Total Expenses
          </Label>
          <p
            className={`text-4xl font-bold ${
              totalBudgetExpenses.remaining < 0 ? "text-red-600" : ""
            }`}
          >
            ₱ {totalBudgetExpenses.totalExpenses}
          </p>
        </div>
        <div className="flex gap-2">
          <BudgetDropwdown />
          <DatePickerWithRangePopover
            disabled={disabled}
            value={{
              from: expensesDate.startDate,
              to: expensesDate.endDate,
            }}
            onChange={(daterange) => {
              setExpensesDate({
                startDate: daterange?.from,
                endDate: daterange?.to,
              });
            }}
          />
        </div>
      </div>

      <div className={`grid grid-cols-12 gap-4 `}>
        {/* Budget Tracking */}
        <Card
          className={`col-span-8 border border-foreground  ${
            totalBudgetExpenses.remaining < 0
              ? "text-red-500 border-red-500"
              : ""
          }`}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Budget Tracking </CardTitle>

              {totalBudgetExpenses ? (
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className={`border-foreground disabled:cursor-not-allowed  ${
                          totalBudgetExpenses.remaining < 0
                            ? "text-red-500 border-red-500"
                            : ""
                        }`}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="p-5 pr-5">
                      <DialogHeader>
                        <DialogTitle>Budget</DialogTitle>
                      </DialogHeader>

                      <Label>Budget Range</Label>
                      <DatePickerWithRange
                        onChange={(daterange) =>
                          setBudget({
                            startDate: daterange?.from,
                            endDate: daterange?.to,
                          })
                        }
                      />
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Budget</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter your budget"
                          onChange={(e) =>
                            setBudget({ amount: e.target.value })
                          }
                          value={budget.amount}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Budget Type</Label>
                        <Input
                          id="budgettype"
                          placeholder="Enter the budget type"
                          onChange={(e) =>
                            setBudget({ budgetType: e.target.value })
                          }
                          value={budget.budgetType}
                        />
                      </div>
                      <DialogClose asChild>
                        <Button
                          className="cursor-pointer mt-3 w-[100%]"
                          variant="default"
                          size="lg"
                          disabled={Object.values(budget).some(
                            (value) => !value
                          )}
                          onClick={handleSaveBudget}
                        >
                          Save
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <TooltipProvider>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          className="border-foreground disabled:cursor-not-allowed ml-2"
                        >
                          Set Active
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This will set the budget as active</p>
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
              ) : (
                ""
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full bg-gray-200 rounded h-6 overflow-hidden">
              {(() => {
                const spent = totalBudgetExpenses.totalExpenses;
                const budget = Number(
                  totalBudgetExpenses.budget_expenses.amount
                );
                const percent = (spent / budget) * 100;

                let barColor = "bg-white"; // default safe
                if (percent > 0) {
                  barColor = "bg-green-500";
                } else if (percent >= 100) {
                  barColor = "bg-red-500"; // over budget
                } else if (percent >= 70) {
                  barColor = "bg-yellow-500"; // almost at limit
                }

                return (
                  <div
                    className={`h-6 rounded transition-all ${barColor}`}
                    style={{
                      width: `${Math.min(percent, 100)}%`,
                    }}
                  ></div>
                );
              })()}
            </div>

            <div className="flex justify-between mt-2 text-sm">
              <span>
                Spent: ₱ {totalBudgetExpenses.totalExpenses.toLocaleString()}
              </span>
              <span
                className={
                  totalBudgetExpenses.remaining < 0
                    ? "font-semibold text-red-500"
                    : ""
                }
              >
                Remaining: ₱ {totalBudgetExpenses.remaining.toLocaleString()}
              </span>
            </div>
            {totalBudgetExpenses.remaining < 0 && (
              <p className=" text-xs mt-1 font-medium">
                ⚠️ You’ve exceeded your budget!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="col-span-4 row-span-2 border border-foreground">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Expenses</CardTitle>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={disabled}
                    variant="outline"
                    className="border-foreground disabled:cursor-not-allowed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[50%]  max-w-[90vw] p-0">
                  <div className="inline-block p-4">
                    <DialogHeader>
                      <DialogTitle>Add Expenses</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 p-1">
                      <div className="w-[100%]">
                        <div className="grid w-full items-center gap-4 mb-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              value={new Date().toLocaleDateString()}
                              disabled
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Amount</Label>
                            <Input
                              id="amount"
                              placeholder="Price expenses"
                              onChange={(e) =>
                                setExpenses({ amount: e.target.value })
                              }
                              value={expenses.amount}
                            />
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="expenses">Expenses Type</Label>
                            <Select
                              onValueChange={(value) =>
                                setExpenses({ expensesType: value })
                              }
                              value={expenses.expensesType}
                            >
                              <SelectTrigger id="expenses" className="w-[100%]">
                                <SelectValue placeholder="Select expense type" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Transportation">
                                  Transportation
                                </SelectItem>
                                <SelectItem value="Shopping">
                                  Shopping
                                </SelectItem>
                                <SelectItem value="Credit">Credit</SelectItem>
                                <SelectItem value="Loan">Loan</SelectItem>
                                <SelectItem value="others">Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-between mb-4">
                          <Button
                            variant="outline"
                            className="w-[40%]"
                            onClick={clearLocal}
                          >
                            Clear
                          </Button>
                          <Button
                            className="cursor-pointer w-[40%]"
                            variant="default"
                            onClick={handlePartialSave}
                          >
                            Add
                          </Button>
                        </div>

                        <Label>Review Expenses</Label>
                        <div className="max-h-[14.5rem] min-h-[14.5rem]   overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Expenses</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {expensesLocal.map((item) => (
                                <TableRow>
                                  <TableCell>{item.amount}</TableCell>
                                  <TableCell>
                                    {new Date().toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>{item.expensesType}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <Button
                          className="cursor-pointer w-[100%]"
                          disabled={expensesLocal.length === 0 ? true : false}
                          variant={"default"}
                          onClick={handleSave}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount (₱)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totalBudgetExpenses?.budget_expenses.expenses?.length ? (
                  totalBudgetExpenses.budget_expenses.expenses.map(
                    (expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {format(new Date(expense.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{expense.expensesType}</TableCell>
                        <TableCell>{expense.amount}</TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No expenses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Monthly Expenses Line Charts */}
        <Card className="col-span-4 border border-foreground">
          <CardHeader>
            <CardTitle>Monthly Expense Trends </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredExpenses}>
                  <XAxis
                    dataKey="createdAt"
                    tickFormatter={(value) => format(new Date(value), "MM/dd")}
                  />
                  <YAxis domain={[0, paddedMax]} />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), "PPpp")}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex  justify-center h-[300px]">
                <Label className="text-center font-light">
                  No expenses found
                </Label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses Break Pie Charts */}
        <Card className="col-span-4 border border-foreground">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {breakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex  justify-center h-[300px]">
                <Label className="text-center font-light">
                  No expenses found
                </Label>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
