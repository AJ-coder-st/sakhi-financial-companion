import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Home, Search, BarChart3, PiggyBank, BookOpen, Users, Settings, 
  ChevronRight, TrendingUp, Bell, LogOut, Menu, X
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardAssistant from "@/components/dashboard/DashboardAssistant";
import DashboardSchemes from "@/components/dashboard/DashboardSchemes";
import DashboardBudget from "@/components/dashboard/DashboardBudget";
import DashboardLearn from "@/components/dashboard/DashboardLearn";
import DashboardSavings from "@/components/dashboard/DashboardSavings";
import DashboardCommunity from "@/components/dashboard/DashboardCommunity";

type TabKey = "home" | "assistant" | "schemes" | "budget" | "learn" | "savings" | "community";

const tabs = [
  { key: "home" as TabKey, label: "Home", icon: Home },
  { key: "assistant" as TabKey, label: "SAKHI AI", icon: Mic },
  { key: "schemes" as TabKey, label: "Schemes", icon: Search },
  { key: "budget" as TabKey, label: "Budget", icon: BarChart3 },
  { key: "savings" as TabKey, label: "Savings", icon: PiggyBank },
  { key: "learn" as TabKey, label: "Learn", icon: BookOpen },
  { key: "community" as TabKey, label: "SHG", icon: Users },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-5 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-saffron-gradient flex items-center justify-center">
            <Mic className="w-5 h-5 text-saffron-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">SAKHI</span>
        </div>
        <nav className="flex-1 px-3 mt-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                activeTab === t.key
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/">
            <button className="flex items-center gap-2 text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
              <LogOut className="w-4 h-4" /> Back to Home
            </button>
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar z-50 lg:hidden flex flex-col"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-saffron-gradient flex items-center justify-center">
                    <Mic className="w-5 h-5 text-saffron-foreground" />
                  </div>
                  <span className="text-lg font-bold text-sidebar-foreground">SAKHI</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
              </div>
              <nav className="flex-1 px-3">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setActiveTab(t.key); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 ${
                      activeTab === t.key
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/60"
                    }`}
                  >
                    <t.icon className="w-5 h-5" />
                    {t.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center px-4 lg:px-6 gap-4 bg-card">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">
              {activeTab === "home" ? "नमस्ते, सुनीता! 🙏" : tabs.find(t => t.key === activeTab)?.label}
            </h1>
          </div>
          <button className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            S
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {activeTab === "home" && <HomeTab onNavigate={setActiveTab} />}
          {activeTab === "assistant" && <DashboardAssistant />}
          {activeTab === "schemes" && <DashboardSchemes />}
          {activeTab === "budget" && <DashboardBudget />}
          {activeTab === "savings" && <DashboardSavings />}
          {activeTab === "learn" && <DashboardLearn />}
          {activeTab === "community" && <DashboardCommunity />}
        </div>

        {/* Floating mic */}
        {activeTab !== "assistant" && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("assistant")}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-saffron-gradient flex items-center justify-center shadow-saffron z-30"
          >
            <Mic className="w-7 h-7 text-saffron-foreground" />
          </motion.button>
        )}
      </main>
    </div>
  );
};

const HomeTab = ({ onNavigate }: { onNavigate: (tab: TabKey) => void }) => (
  <div className="space-y-6 max-w-4xl">
    {/* Quick stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total Savings", value: "₹4,250", icon: PiggyBank, color: "text-primary" },
        { label: "Schemes Matched", value: "6", icon: Search, color: "text-secondary" },
        { label: "Lessons Done", value: "8/24", icon: BookOpen, color: "text-accent" },
        { label: "Savings Streak", value: "12 days 🔥", icon: TrendingUp, color: "text-saffron-deep" },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border"
        >
          <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="text-lg font-bold">{s.value}</p>
        </motion.div>
      ))}
    </div>

    {/* Alerts */}
    <div className="bg-saffron/10 rounded-2xl p-4 border border-saffron/20">
      <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
        <Bell className="w-4 h-4 text-saffron-deep" /> New Scheme Alert
      </h3>
      <p className="text-sm text-muted-foreground">You may be eligible for <strong>PM Vishwakarma Yojana</strong> — up to ₹3 lakh at 5% interest!</p>
      <button onClick={() => onNavigate("schemes")} className="text-sm text-primary font-semibold mt-2 flex items-center gap-1">
        Check Eligibility <ChevronRight className="w-4 h-4" />
      </button>
    </div>

    {/* Quick actions */}
    <div>
      <h3 className="font-bold mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Talk to SAKHI", icon: Mic, tab: "assistant" as TabKey },
          { label: "Log Expense", icon: BarChart3, tab: "budget" as TabKey },
          { label: "Find Schemes", icon: Search, tab: "schemes" as TabKey },
          { label: "Add Savings", icon: PiggyBank, tab: "savings" as TabKey },
          { label: "Continue Learning", icon: BookOpen, tab: "learn" as TabKey },
          { label: "My SHG Group", icon: Users, tab: "community" as TabKey },
        ].map((a, i) => (
          <button
            key={i}
            onClick={() => onNavigate(a.tab)}
            className="bg-card rounded-xl p-4 border border-border hover:shadow-sakhi transition-shadow text-left"
          >
            <a.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-sm font-medium">{a.label}</p>
          </button>
        ))}
      </div>
    </div>

    {/* Learning progress */}
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h3 className="font-bold mb-2">Learning Progress</h3>
      <p className="text-sm text-muted-foreground mb-3">Level 2: Banking Basics</p>
      <Progress value={33} className="h-3" />
      <p className="text-xs text-muted-foreground mt-2">8 of 24 lessons completed</p>
    </div>
  </div>
);

export default Dashboard;
