import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { DatePicker } from "@/components/custom/datepicker";
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

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("April");
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
  } = expensesStore();
  const {
    getBudgetByDateRange,
    totalBudgetExpenses,
    setBudget,
    budget,
    saveBudget,
  } = budgetStore();
  const budgetId = totalBudgetExpenses.budget?.id;
  const date: Date = new Date(); // Or use new Date('2025-04-12') for a specific date

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate: string = date.toLocaleDateString("en-US", options);
  useEffect(() => {
    getExpenses(Number(budgetId));

    getBudgetByDateRange(formattedDate);
  }, [getExpenses, getBudgetByDateRange, budgetId, formattedDate]);

  const filteredExpenses = expensesFetch.data.filter(
    (expense) =>
      new Date(String(expense.createdAt)).toLocaleString("default", {
        month: "long",
      }) === selectedMonth
  );
  const maxAmount = Math.max(...filteredExpenses.map((e) => Number(e.amount)));
  const paddedMax = maxAmount + 100;

  const categoryBreakdown = Object.entries(
    filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.expensesType] =
        (acc[expense.expensesType] || 0) + Number(expense.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

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

    getBudgetByDateRange(formattedDate);

    getExpenses(Number(budgetId));
    clearLocal();
  };
  const handleSaveBudget = async () => {
    await saveBudget(budget);
    getBudgetByDateRange(formattedDate);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex w-full justify-between items-center gap-2">
        <Label className="text-lg font-semibold flex-1/2">
          Total Expenses: ₱ {totalBudgetExpenses.totalExpenses}
        </Label>
        <DatePicker />
        <Button onClick={() => alert("Exporting CSV...")} disabled>
          Export as CSV
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Budget Progress */}
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

        {/* Expenses Table */}
        <Card className="col-span-4 row-span-2">
          <CardHeader>
            <div className="flex justify-between ">
              <CardTitle>Recent Expenses</CardTitle>

              <Dialog>
                <DialogTrigger asChild>
                  <Plus className="cursor-pointer text-primary/70 hover:text-primary/100" />
                </DialogTrigger>
                <DialogContent className="w-auto max-w-[90vw] p-0">
                  <div className="inline-block p-4">
                    <div className="w-96 p-1">
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
                          <Button variant="outline" onClick={clear}>
                            Clear
                          </Button>
                          <Button
                            className="cursor-pointer"
                            variant="default"
                            onClick={handlePartialSave}
                          >
                            Add
                          </Button>
                        </div>

                        <Label>Review Expenses</Label>
                        <div className="max-h-[14.5rem] min-h-[14.5rem] w-96  overflow-auto">
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

                              {/* Add more rows to test scrolling */}
                            </TableBody>
                          </Table>
                        </div>
                        <Button
                          className="cursor-pointer"
                          variant={"default"}
                          onClick={handleSave}
                        >
                          {" "}
                          Save
                        </Button>
                      </div>
                      {/* <Card className=" w-96 max-h-96">
        <CardHeader>
          <CardTitle>Add Expenses</CardTitle>
          <CardDescription>Add your expenses to track them.</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card> */}

                      {/* <Card className="w-2xl">
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-end"></CardFooter>
      </Card> */}
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
        {/* Bar Chart */}
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

        {/* Pie Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryBreakdown.map((entry, index) => (
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

      {/* Export Button */}
    </div>
  );
}
