import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HealthScoreCard } from "@/components/HealthScoreCard";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  projectFinances,
  calculateMaxLoanAmount,
  calculateEMI,
} from "@/lib/financialTwin";
import { calculateHealthScore } from "@/lib/financialHealthScore";
import { getTopSchemes } from "@/lib/schemeMatcher";
import type { Scheme } from "@/lib/schemeMatcher";

export default function FinancialDashboard() {
  const [income, setIncome] = useState(30000);
  const [expenses, setExpenses] = useState(20000);
  const [savings, setSavings] = useState(15000);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [projections, setProjections] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<any>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [maxLoan, setMaxLoan] = useState(0);

  // Calculate when inputs change
  useEffect(() => {
    const proj = projectFinances(income, expenses, savings);
    setProjections(proj);

    const health = calculateHealthScore({
      income,
      expenses,
      currentSavings: savings,
      totalDebt: 0,
      dependents: 1,
    });
    setHealthScore(health);

    const max = calculateMaxLoanAmount(income, expenses);
    setMaxLoan(max);

    // Fetch matching schemes
    const fetchSchemes = async () => {
      try {
        const matched = await getTopSchemes({
          income,
          occupation: "self-employed",
          gender: "female",
          hasOwnBusiness: false,
          location: "rural",
          age: 35,
        });
        setSchemes(matched);
      } catch (err) {
        console.error("Error fetching schemes:", err);
      }
    };

    fetchSchemes();
  }, [income, expenses, savings]);

  // Prepare projection chart data
  const monthLabels = [
    "Current",
    "Month 1",
    "Month 2",
    "Month 3",
    "Month 4",
    "Month 5",
    "Month 6",
  ];
  const projectionChartData = monthLabels.map((label, i) => {
    if (i === 0) {
      return {
        month: label,
        savings: savings,
        income: income,
      };
    }
    const monthSavings = projections?.currentMonth.monthlySavings || 0;
    return {
      month: label,
      savings: savings + monthSavings * i,
      income: income,
    };
  });

  const yearlyProjectionData = [
    {
      period: "Current",
      savings: savings,
      yearlyProjection: savings + (projections?.currentMonth.yearlySavings || 0),
    },
    {
      period: "6 Months",
      savings:
        savings +
        (projections?.currentMonth.monthlySavings || 0) * 6,
      yearlyProjection:
        savings +
        (projections?.currentMonth.monthlySavings || 0) * 6 +
        (projections?.currentMonth.yearlySavings || 0),
    },
    {
      period: "1 Year",
      savings:
        savings +
        (projections?.currentMonth.yearlySavings || 0),
      yearlyProjection:
        savings +
        (projections?.currentMonth.yearlySavings || 0) * 2,
    },
  ];

  const handleSetupComplete = (
    newIncome: number,
    newExpenses: number
  ) => {
    setIncome(newIncome);
    setExpenses(newExpenses);
    setShowSetupDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Financial Dashboard</h1>
            <p className="text-muted-foreground">
              Your complete financial overview and projections
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSetupDialog(true)}
            className="mt-2"
          >
            Update Profile
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Monthly Income</p>
              <p className="text-3xl font-bold">₹{income.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Stable income</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Monthly Savings
              </p>
              <p className="text-3xl font-bold text-green-600">
                ₹{(income - expenses).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(((income - expenses) / income) * 100)}% savings rate
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Safe Loan Amount
              </p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{maxLoan.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Safe to borrow
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Yearly Projection
              </p>
              <p className="text-3xl font-bold text-purple-600">
                ₹
                {(
                  savings +
                  (projections?.currentMonth.yearlySavings || 0)
                ).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                By end of year
              </p>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* 6 Month Projection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  6-Month Savings Projection
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={projectionChartData}>
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="savings"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorSavings)"
                      name="Projected Savings"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Yearly Projection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Yearly Growth Projection</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={yearlyProjectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                      name="Savings"
                    />
                    <Line
                      type="monotone"
                      dataKey="yearlyProjection"
                      stroke="hsl(var(--chart-5))"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                      name="With Interest"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Health Score Sidebar */}
          {healthScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <HealthScoreCard data={healthScore} />
            </motion.div>
          )}
        </div>

        {/* Matching Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">Recommended Schemes for You</h3>
            {schemes.length === 0 ? (
              <p className="text-muted-foreground">Loading schemes...</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {schemes.slice(0, 3).map((scheme) => (
                  <div
                    key={scheme.id || scheme.name}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <p className="font-bold mb-2">{scheme.name}</p>
                    {scheme.maxLoan > 0 && (
                      <p className="text-sm text-primary mb-2">
                        Loan: ₹{scheme.maxLoan.toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mb-3">
                      {scheme.description}
                    </p>
                    <div className="flex gap-2">
                      <div className="text-xs flex items-center gap-1">
                        {scheme.matchScore !== undefined && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {scheme.matchScore}% match
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Loan EMI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">Loan EMI Calculator</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-semibold mb-2">Sample Scenarios</p>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-muted rounded">
                    <p className="font-semibold">₹{maxLoan.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      at 10% for 12 months
                    </p>
                    <p className="text-xs mt-1">
                      EMI: ₹{calculateEMI(maxLoan, 10, 12).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="font-semibold">
                      ₹{Math.round(maxLoan * 0.5).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      at 10% for 12 months
                    </p>
                    <p className="text-xs mt-1">
                      EMI: ₹
                      {calculateEMI(Math.round(maxLoan * 0.5), 10, 12).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-semibold mb-3">How much should you borrow?</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Safe Borrowing Limit
                      </p>
                      <p className="text-blue-800 dark:text-blue-200 mt-1">
                        Your current financial profile allows borrowing up to ₹
                        {maxLoan.toLocaleString()} safely. This ensures your EMI
                        doesn't exceed 50% of your monthly savings.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✓ Remember: Only borrow what you can repay comfortably while
                      maintaining your savings goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Financial Profile</DialogTitle>
          </DialogHeader>
          <SetupForm
            defaultIncome={income}
            defaultExpenses={expenses}
            onComplete={handleSetupComplete}
            onCancel={() => setShowSetupDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SetupForm({
  defaultIncome,
  defaultExpenses,
  onComplete,
  onCancel,
}: {
  defaultIncome: number;
  defaultExpenses: number;
  onComplete: (income: number, expenses: number) => void;
  onCancel: () => void;
}) {
  const [income, setIncome] = useState(defaultIncome.toString());
  const [expenses, setExpenses] = useState(defaultExpenses.toString());

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold mb-2 block">
          Monthly Income (₹)
        </label>
        <Input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="30000"
        />
      </div>
      <div>
        <label className="text-sm font-semibold mb-2 block">
          Monthly Expenses (₹)
        </label>
        <Input
          type="number"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          placeholder="20000"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          className="flex-1 bg-saffron-gradient text-saffron-foreground"
          onClick={() => {
            onComplete(parseFloat(income) || 0, parseFloat(expenses) || 0);
          }}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
