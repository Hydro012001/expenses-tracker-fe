import { useEffect, useState, useMemo } from "react";
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
import { Plus } from "lucide-react";
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

export default function Dashboard() {
  const defaultEndDate = useMemo(() => new Date(), []);
  const selectedMonth = format(defaultEndDate, "LLLL");
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
  ];
  const {
    expensesFetch,
    getExpenses,
    setExpenses,
    expenses,
    expensesLocal,
    expensesLocalSave,
    clear,
    saveExpense,
    clearLocal,
    expensesDate,
    setExpensesDate,
  } = expensesStore();
  const {
    getBudgetByDateRange,
    totalBudgetExpenses,
    setBudget,
    budget,
    saveBudget,
    getBudgetDate,
  } = budgetStore();
  const budgetId = totalBudgetExpenses.budget?.id;
  const { filteredExpenses, breakdown, paddedMax } = getCategoryBreakdown(
    expensesFetch,
    selectedMonth
  );
  // const budgetStart = totalBudgetExpenses?.budget?.startDate
  //   ? new Date(totalBudgetExpenses.budget.startDate)
  //   : null;

  const endDate = expensesDate.endDate ?? defaultEndDate;

  useEffect(() => {
    getBudgetByDateRange();
  }, [getBudgetByDateRange]);

  useEffect(() => {
    getExpenses(
      Number(budgetId),
      endDate,
      totalBudgetExpenses.budget.startDate
    );
  }, [budgetId, getExpenses, endDate, totalBudgetExpenses.budget.startDate]);

  const handlePartialSave = () => {
    const data = {
      budgetId: totalBudgetExpenses.budget.id,
      ...expenses,
    };
    expensesLocalSave([data]);
    clear();
  };

  const handleSave = async () => {
    await saveExpense(expensesLocal);

    getBudgetByDateRange();

    getExpenses(
      Number(budgetId),
      endDate,
      totalBudgetExpenses.budget.startDate
    );
    clearLocal();
  };
  const handleSaveBudget = async () => {
    await saveBudget(budget);
    getBudgetByDateRange();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex w-full justify-between items-center gap-2">
        <Label className="text-lg font-semibold flex-1/2">
          Total Expenses: ₱ {totalBudgetExpenses.totalExpenses}
        </Label>
        <DatePickerWithRangePopover
          value={{
            from: totalBudgetExpenses.budget.startDate
              ? new Date(totalBudgetExpenses.budget.startDate)
              : undefined,
            to: endDate,
          }}
          onChange={(daterange) => {
            setExpensesDate({
              startDate: daterange.from,
              endDate: daterange.to,
            });
          }}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-8 ">
          <CardHeader>
            <div className="flex justify-between ">
              <CardTitle>Budget Tracking</CardTitle>
              {totalBudgetExpenses ? (
                <>
                  <Dialog>
                    <DialogTrigger>
                      <Plus className="cursor-pointer text-primary/70 hover:text-primary/100" />
                    </DialogTrigger>
                    <DialogContent className="p-5 pr-5">
                      <DialogHeader>
                        <DialogTitle>Budget</DialogTitle>
                      </DialogHeader>
                      <Label>Budget Range</Label>
                      <DatePickerWithRange
                        onChange={(daterange) =>
                          setBudget({
                            startDate: String(daterange?.from),
                            endDate: String(daterange?.to),
                          })
                        }
                      />
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Budget</Label>
                        <Input
                          id="amount"
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
                      <DialogClose>
                        <Button
                          className="cursor-pointer mt-3"
                          variant="default"
                          size="lg"
                          onClick={handleSaveBudget}
                        >
                          Save
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                ""
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full bg-gray-200 rounded h-6">
              <div
                className="bg-primary h-6 rounded"
                style={{
                  width: `${
                    (totalBudgetExpenses.totalExpenses /
                      Number(totalBudgetExpenses.budget.amount)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>Spent: ₱ {totalBudgetExpenses.totalExpenses}</span>
              <span>Remaining: ₱ {totalBudgetExpenses.remaining}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4 row-span-2">
          <CardHeader>
            <div className="flex justify-between ">
              <CardTitle>Recent Expenses</CardTitle>

              <Dialog>
                <DialogTrigger asChild>
                  <Plus className="cursor-pointer text-primary/70 hover:text-primary/100" />
                </DialogTrigger>
                <DialogContent className="w-[50%]  max-w-[90vw] p-0">
                  <div className="inline-block p-4">
                    <div className=" p-1">
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
                              <SelectTrigger id="expenses">
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
                            onClick={clear}
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
                {expensesFetch?.data?.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.createdAt}</TableCell>
                    <TableCell>{expense.expensesType}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Expense Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredExpenses}>
                <XAxis dataKey="createdAt" />
                <YAxis domain={[0, paddedMax]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
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
                  {breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
