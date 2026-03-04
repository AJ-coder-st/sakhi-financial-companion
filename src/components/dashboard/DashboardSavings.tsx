import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const goals = [
  { name: "School Fees", emoji: "📚", target: 5000, saved: 3200, deadline: "June 2026" },
  { name: "Emergency Fund", emoji: "🏥", target: 10000, saved: 4250, deadline: "Dec 2026" },
  { name: "Diwali Festival", emoji: "🪔", target: 3000, saved: 800, deadline: "Oct 2026" },
  { name: "Sewing Machine", emoji: "🧵", target: 8000, saved: 1500, deadline: "Sep 2026" },
];

const DashboardSavings = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">Micro-Savings Goals</h2>
        <p className="text-sm text-muted-foreground">Total saved: ₹9,750</p>
      </div>
      <Button size="sm" className="bg-saffron-gradient text-saffron-foreground gap-1">
        <Plus className="w-4 h-4" /> New Goal
      </Button>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      {goals.map((g, i) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-5 border border-border hover:shadow-sakhi transition-shadow"
          >
            <div className="text-3xl mb-2">{g.emoji}</div>
            <h3 className="font-bold mb-1">{g.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">by {g.deadline}</p>

            {/* Visual jar */}
            <div className="relative w-full h-24 bg-muted rounded-xl overflow-hidden mb-3">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                className="absolute bottom-0 left-0 right-0 bg-primary/20 rounded-b-xl"
                style={{ background: `linear-gradient(180deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.35))` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-primary">{pct}%</span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">₹{g.saved.toLocaleString()}</span>
              <span className="font-bold">₹{g.target.toLocaleString()}</span>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3">+ Add Savings</Button>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default DashboardSavings;
