import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { HealthScoreCard } from "@/components/HealthScoreCard";
import {
  calculateHealthScore,
  type FinancialHealthResult,
} from "@/lib/financialHealthScore";
import { calculateSnapshot } from "@/lib/financialTwin";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/i18n/LanguageContext";

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  description: string;
}

interface BudgetData {
  income: number;
  expenses: BudgetItem[];
}

const EXPENSE_CATEGORIES = [
  { name: "Food", color: "#FF6B6B", emoji: "🍜" },
  { name: "Housing", color: "#4ECDC4", emoji: "🏠" },
  { name: "Transportation", color: "#45B7D1", emoji: "🚗" },
  { name: "Utilities", color: "#FFA07A", emoji: "💡" },
  { name: "Healthcare", color: "#98D8C8", emoji: "🏥" },
  { name: "Education", color: "#F7DC6F", emoji: "📚" },
  { name: "Other", color: "#BB8FCE", emoji: "📦" },
];

export default function BudgetTracker() {
  const { t } = useLanguage();
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 0,
    expenses: [],
  });

  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    category: "Food",
    amount: "",
    description: "",
  });

  const [healthScore, setHealthScore] = useState<FinancialHealthResult | null>(null);

  // Calculate totals
  const totalExpenses = budgetData.expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlySavings = budgetData.income - totalExpenses;

  // Update health score whenever budget changes
  useEffect(() => {
    if (budgetData.income > 0) {
      const score = calculateHealthScore({
        income: budgetData.income,
        expenses: totalExpenses,
        currentSavings: 0,
        totalDebt: 0,
        dependents: 1,
      });
      setHealthScore(score);
    }
  }, [budgetData.income, totalExpenses]);

  const handleAddIncome = () => {
    if (incomeInput && parseFloat(incomeInput) > 0) {
      setBudgetData((prev) => ({
        ...prev,
        income: parseFloat(incomeInput),
      }));
      setIncomeInput("");
      setShowIncomeDialog(false);
    }
  };

  const handleAddExpense = () => {
    if (
      expenseForm.amount &&
      parseFloat(expenseForm.amount) > 0 &&
      expenseForm.category
    ) {
      const newExpense: BudgetItem = {
        id: Date.now().toString(),
        category: expenseForm.category,
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
      };

      setBudgetData((prev) => ({
        ...prev,
        expenses: [...prev.expenses, newExpense],
      }));

      setExpenseForm({ category: "Food", amount: "", description: "" });
      setShowExpenseDialog(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setBudgetData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  // Prepare chart data
  const chartData = EXPENSE_CATEGORIES.map((cat) => {
    const amount = budgetData.expenses
      .filter((e) => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      name: cat.name,
      value: amount,
      color: cat.color,
      emoji: cat.emoji,
    };
  }).filter((item) => item.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Budget Tracker</h1>
          <p className="text-muted-foreground">
            Track your income and expenses to build a stronger financial future
          </p>
        </div>

        {/* Income & Savings Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Income Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Monthly Income</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    ₹{budgetData.income.toLocaleString()}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowIncomeDialog(true)}
                    className="mt-3"
                  >
                    <DollarSign className="w-4 h-4 mr-1" /> Update Income
                  </Button>
                </div>
                <div className="text-5xl">💰</div>
              </div>
            </Card>
          </motion.div>

          {/* Expenses Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {totalExpenses > 0
                      ? `${Math.round((totalExpenses / budgetData.income) * 100)}% of income`
                      : "No expenses yet"}
                  </p>
                </div>
                <div className="text-5xl">💸</div>
              </div>
            </Card>
          </motion.div>

          {/* Savings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`p-6 ${monthlySavings > 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              <p className="text-sm text-muted-foreground mb-2">Monthly Savings</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-3xl font-bold ${monthlySavings > 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{monthlySavings.toLocaleString()}
                  </p>
                  {budgetData.income > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round((monthlySavings / budgetData.income) * 100)}% savings rate
                    </p>
                  )}
                </div>
                <div className="text-5xl">{monthlySavings > 0 ? "✅" : "⚠️"}</div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Expenses List & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Expense Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Expenses</h2>
              <Button
                className="bg-saffron-gradient text-saffron-foreground gap-2"
                onClick={() => setShowExpenseDialog(true)}
              >
                <Plus className="w-4 h-4" /> Add Expense
              </Button>
            </div>

            {/* Expense Chart */}
            {chartData.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4">Spending Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ₹${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Expense List */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">All Expenses</h3>
              {budgetData.expenses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No expenses added yet. Start by adding your first expense.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {budgetData.expenses.map((expense) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{expense.category}</p>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground">
                            {expense.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-lg">
                          ₹{expense.amount.toLocaleString()}
                        </p>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Health Score Sidebar */}
          {healthScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <HealthScoreCard data={healthScore} compact={false} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Income Dialog */}
      <Dialog open={showIncomeDialog} onOpenChange={setShowIncomeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Monthly Income</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Enter your monthly income"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              className="text-lg"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowIncomeDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-saffron-gradient text-saffron-foreground"
                onClick={handleAddIncome}
              >
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Category</label>
              <select
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Amount (₹)</label>
              <Input
                type="number"
                placeholder="0"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Description (optional)
              </label>
              <Input
                type="text"
                placeholder="e.g., Weekly groceries"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowExpenseDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-saffron-gradient text-saffron-foreground"
                onClick={handleAddExpense}
              >
                Add Expense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
