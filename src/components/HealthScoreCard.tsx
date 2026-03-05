import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getScoreColor, getScoreBgColor } from "@/lib/financialHealthScore";
import type { FinancialHealthResult } from "@/lib/financialHealthScore";

interface HealthScoreCardProps {
  data: FinancialHealthResult;
  compact?: boolean;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  data,
  compact = false,
}) => {
  if (compact) {
    return (
      <Card className="p-4 md:p-6 bg-gradient-to-br from-card to-card/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Financial Health Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
                {data.score}
              </span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <p className="text-sm font-semibold mt-1">{data.status}</p>
          </div>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreBgColor(data.score)}`}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                {data.score}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 space-y-6">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Financial Health Score</h3>
          <p className="text-muted-foreground">
            Comprehensive analysis of your financial profile
          </p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-32 h-32 rounded-full flex items-center justify-center ${getScoreBgColor(
            data.score
          )}`}
        >
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(data.score)}`}>
              {data.score}
            </div>
            <div className={`text-sm font-semibold ${getScoreColor(data.score)}`}>
              {data.status}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Savings Ratio</p>
          <p className="text-2xl font-bold text-primary">{data.savingsRatio}%</p>
          <p className="text-xs mt-2">of income saved</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Debt Ratio</p>
          <p className="text-2xl font-bold text-orange-600">{data.debtRatio}%</p>
          <p className="text-xs mt-2">of income as debt</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Expense Ratio</p>
          <p className="text-2xl font-bold text-blue-600">{data.expenseRatio}%</p>
          <p className="text-xs mt-2">of income spent</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Emergency Fund</p>
          <p className="text-2xl font-bold text-green-600">
            {data.emergencyFundMonths.toFixed(1)}
          </p>
          <p className="text-xs mt-2">months of expenses</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Financial Health Status</p>
          <p className="text-sm text-muted-foreground">{data.status}</p>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${
              data.score >= 85
                ? "bg-green-500"
                : data.score >= 65
                  ? "bg-blue-500"
                  : data.score >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Strengths */}
      {data.strengths && data.strengths.length > 0 && (
        <div className="space-y-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-900">
          <p className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </p>
          <ul className="space-y-2">
            {data.strengths.map((strength, idx) => (
              <li
                key={idx}
                className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2"
              >
                <span className="text-green-600 mt-1">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {data.issues && data.issues.length > 0 && (
        <div className="space-y-3 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-900">
          <p className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Areas for Improvement
          </p>
          <ul className="space-y-2">
            {data.issues.map((issue, idx) => (
              <li
                key={idx}
                className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2"
              >
                <span className="text-red-600 mt-1">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {data.advice && data.advice.length > 0 && (
        <div className="space-y-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
          <p className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recommendations
          </p>
          <ul className="space-y-2">
            {data.advice.map((advice, idx) => (
              <li
                key={idx}
                className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2"
              >
                <span className="text-blue-600 mt-1">→</span>
                {advice}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Level */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <TrendingUp className="w-6 h-6 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Risk Level</p>
          <p className="font-semibold capitalize">
            {data.riskLevel === "low"
              ? "✓ Low Risk - Good position"
              : data.riskLevel === "medium"
                ? "⚠ Medium Risk - Monitor closely"
                : "🔴 High Risk - Needs attention"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default HealthScoreCard;
