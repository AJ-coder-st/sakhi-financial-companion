import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Plus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const monthlyData = [
  { name: "Food", amount: 3200, color: "hsl(160, 40%, 28%)" },
  { name: "Education", amount: 1500, color: "hsl(32, 85%, 55%)" },
  { name: "Health", amount: 800, color: "hsl(155, 30%, 42%)" },
  { name: "Farm", amount: 2100, color: "hsl(160, 35%, 15%)" },
  { name: "Utilities", amount: 600, color: "hsl(150, 25%, 55%)" },
  { name: "Other", amount: 400, color: "hsl(150, 15%, 85%)" },
];

const recentExpenses = [
  { desc: "सब्ज़ी / Vegetables", amount: 50, category: "Food", time: "Today" },
  { desc: "School fee", amount: 500, category: "Education", time: "Yesterday" },
  { desc: "Bus fare to mandi", amount: 30, category: "Other", time: "Yesterday" },
  { desc: "Medicine", amount: 120, category: "Health", time: "2 days ago" },
  { desc: "बिजली बिल / Electricity", amount: 350, category: "Utilities", time: "3 days ago" },
];

const DashboardBudget = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t("budgetTrackerTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("budgetSummary")}</p>
        </div>
        <Button size="sm" className="bg-saffron-gradient text-saffron-foreground gap-1">
          <Plus className="w-4 h-4" /> {t("add")}
        </Button>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border">
        <h3 className="font-bold text-sm mb-4">{t("spendingByCategory")}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
            <Tooltip formatter={(value: number) => [`₹${value}`, t("amount")]} />
            <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
              {monthlyData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-muted rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-saffron-gradient flex items-center justify-center flex-shrink-0">
          <Mic className="w-5 h-5 text-saffron-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{t("voiceLogExpenses")}</p>
          <p className="text-xs text-muted-foreground">{t("voiceLogHint")}</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">{t("recentExpenses")}</h3>
        <div className="space-y-2">
          {recentExpenses.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{e.desc}</p>
                <p className="text-xs text-muted-foreground">{e.category} · {e.time}</p>
              </div>
              <span className="font-bold text-sm">-₹{e.amount}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardBudget;
