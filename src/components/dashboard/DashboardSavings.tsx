import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";

interface SavingGoal {
  id: number;
  name: string;
  nameHi: string;
  emoji: string;
  target: number;
  saved: number;
  deadline: string;
  deadlineHi: string;
  description: string;
  descriptionHi: string;
  reason: string;
  reasonHi: string;
  monthlyTarget: number;
  currentMonth: number;
  paymentFrequency: string;
  category: string;
}

const DashboardSavings = () => {
  const { t, language } = useLanguage();
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);
  const [showAddAmount, setShowAddAmount] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch savings goals from data
    fetch("/data/savingsGoals.json")
      .then((res) => res.json())
      .then((data) => {
        setGoals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading savings goals:", err);
        setLoading(false);
      });
  }, []);

  const handleAddAmount = () => {
    if (!addAmount || !selectedGoal) return;

    const numAmount = parseFloat(addAmount);
    if (numAmount <= 0) return;

    // Update the goal
    setGoals((prevGoals) =>
      prevGoals.map((g) =>
        g.id === selectedGoal.id
          ? { ...g, saved: g.saved + numAmount, currentMonth: g.currentMonth + numAmount }
          : g
      )
    );

    // Update selected goal for UI
    setSelectedGoal((prev) =>
      prev ? { ...prev, saved: prev.saved + numAmount, currentMonth: prev.currentMonth + numAmount } : null
    );

    setAddAmount("");
    setShowAddAmount(false);

    // Show success toast
    setTimeout(() => {
      alert(t("paymentClicked") || "Payment recorded successfully!");
    }, 300);
  };

  const calculateProgress = (goal: SavingGoal) => {
    return Math.min(Math.round((goal.saved / goal.target) * 100), 100);
  };

  const getTotalSaved = () => {
    return goals.reduce((sum, g) => sum + g.saved, 0);
  };

  if (loading) {
    return <div className="text-center py-8">{t("loading") || "Loading..."}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t("microSavingsGoals")}</h2>
          <p className="text-sm text-muted-foreground">{t("totalSaved")}: ₹{getTotalSaved().toLocaleString()}</p>
        </div>
        <Button size="sm" className="bg-saffron-gradient text-saffron-foreground gap-1">
          <Plus className="w-4 h-4" /> {t("newGoal")}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = calculateProgress(g);
          const remainingAmount = g.target - g.saved;
          const daysLeft = Math.ceil(Math.random() * 200); // Placeholder

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

              {/* Progress Bar */}
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

              {/* Amount Info */}
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">₹{g.saved.toLocaleString()}</span>
                <span className="font-bold">₹{g.target.toLocaleString()}</span>
              </div>

              {/* Remaining & Days */}
              <div className="flex justify-between text-xs text-muted-foreground mb-3">
                <span>{t("remaining") || "Remaining"}: ₹{remainingAmount.toLocaleString()}</span>
                <span>{daysLeft} {t("daysLeft") || "days left"}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedGoal(g);
                    setShowDetails(true);
                  }}
                >
                  {t("goalDetails") || "Details"}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-saffron-gradient text-saffron-foreground hover:opacity-90"
                  onClick={() => {
                    setSelectedGoal(g);
                    setShowAddAmount(true);
                  }}
                >
                  {t("addAmount") || "Add Amount"}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Amount Dialog */}
      <Dialog open={showAddAmount} onOpenChange={setShowAddAmount}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedGoal?.emoji} {selectedGoal?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Progress */}
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{t("monthlyProgress")}</p>
              <p className="text-lg font-bold">₹{selectedGoal?.currentMonth.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly target: ₹{selectedGoal?.monthlyTarget.toLocaleString()}</p>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t("enterAmount")}</label>
              <Input
                type="number"
                placeholder="₹ Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 200].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAddAmount(amt.toString())}
                  className="text-sm"
                >
                  ₹{amt}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddAmount(false)} className="flex-1">
                {t("cancel") || "Cancel"}
              </Button>
              <Button
                className="flex-1 bg-saffron-gradient text-saffron-foreground hover:opacity-90"
                onClick={handleAddAmount}
                disabled={!addAmount || parseFloat(addAmount) <= 0}
              >
                {t("addSavingsBtn") || "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md max-h-96 overflow-y-auto">
          {selectedGoal && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedGoal.emoji} {selectedGoal.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Goal Description */}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-saffron-deep">{t("description") || "Description"}</p>
                  <p className="text-sm leading-relaxed">{selectedGoal.description}</p>
                  {selectedGoal.descriptionHi && (
                    <p className="text-sm leading-relaxed font-devanagari text-muted-foreground">{selectedGoal.descriptionHi}</p>
                  )}
                </div>

                {/* Why This Goal */}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-saffron-deep">{t("reason")}</p>
                  <p className="text-sm leading-relaxed">{selectedGoal.reason}</p>
                  {selectedGoal.reasonHi && (
                    <p className="text-sm leading-relaxed font-devanagari text-muted-foreground">{selectedGoal.reasonHi}</p>
                  )}
                </div>

                {/* Goal Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{t("category")}</p>
                    <p className="text-sm font-bold mt-1 capitalize">{selectedGoal.category}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Frequency</p>
                    <p className="text-sm font-bold mt-1 capitalize">{selectedGoal.paymentFrequency}</p>
                  </div>
                </div>

                {/* Progress & Timeline */}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-saffron-deep">Progress</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-saffron-gradient"
                      style={{ width: `${calculateProgress(selectedGoal)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{selectedGoal.saved.toLocaleString()}</span>
                    <span>{calculateProgress(selectedGoal)}%</span>
                    <span>₹{selectedGoal.target.toLocaleString()}</span>
                  </div>
                </div>

                {/* Close Button */}
                <Button variant="outline" onClick={() => setShowDetails(false)} className="w-full">
                  {t("close") || "Close"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardSavings;
