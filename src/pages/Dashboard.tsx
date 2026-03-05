import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Home, Search, BarChart3, PiggyBank, BookOpen, Users, Settings, 
  ChevronRight, TrendingUp, Bell, LogOut, Menu, X, Briefcase, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import DashboardAssistant from "@/components/dashboard/DashboardAssistant";
import DashboardSchemes from "@/components/dashboard/DashboardSchemes";
import DashboardBudget from "@/components/dashboard/DashboardBudget";
import DashboardLearn from "@/components/dashboard/DashboardLearn";
import DashboardSavings from "@/components/dashboard/DashboardSavings";
import DashboardCommunity from "@/components/dashboard/DashboardCommunity";
import LearningDashboard from "@/components/entrepreneurship/LearningDashboard";
import { FutureVisionCard } from "@/components/impact/FutureVisionCard";
import { ImpactMap } from "@/components/impact/ImpactMap";
import { VoiceMentor } from "@/components/impact/VoiceMentor";

type TabKey = "home" | "assistant" | "schemes" | "budget" | "learn" | "savings" | "community" | "entrepreneurship" | "impact";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const tabs = [
    { key: "home" as TabKey, label: t("home"), icon: Home },
    { key: "assistant" as TabKey, label: t("iraivisAI"), icon: Mic },
    { key: "schemes" as TabKey, label: t("schemes"), icon: Search },
    { key: "budget" as TabKey, label: t("budget"), icon: BarChart3 },
    { key: "savings" as TabKey, label: t("savings"), icon: PiggyBank },
    { key: "learn" as TabKey, label: t("learn"), icon: BookOpen },
    { key: "entrepreneurship" as TabKey, label: "Entrepreneurship", icon: Briefcase },
    { key: "community" as TabKey, label: t("shg"), icon: Users },
    { key: "impact" as TabKey, label: "Impact", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed left-0 top-0 bottom-0 z-30">
        <div className="p-5 flex items-center gap-2 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-saffron-gradient flex items-center justify-center shadow-saffron">
            <Mic className="w-5 h-5 text-saffron-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">IRAIVI</span>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                activeTab === tab.key
                  ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            <LogOut className="w-4 h-4" /> {t("backToHome")}
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar z-50 lg:hidden flex flex-col shadow-xl"
            >
              <div className="p-5 flex items-center justify-between border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-saffron-gradient flex items-center justify-center shadow-saffron">
                    <Mic className="w-5 h-5 text-saffron-foreground" />
                  </div>
                  <span className="text-lg font-bold text-sidebar-foreground">IRAIVI</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
                >
                  <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 overflow-y-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                      activeTab === tab.key
                        ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-sidebar-border">
                <Link 
                  to="/" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" /> {t("backToHome")}
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center px-4 lg:px-6 gap-4 bg-card">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">
              {activeTab === "home" ? t("greeting") : tabs.find(tab => tab.key === activeTab)?.label}
            </h1>
          </div>
          <LanguageSelector variant="compact" />
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
          {activeTab === "entrepreneurship" && <LearningDashboard />}
          {activeTab === "community" && <DashboardCommunity />}
          {activeTab === "impact" && <ImpactTab />}
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

const HomeTab = ({ onNavigate }: { onNavigate: (tab: TabKey) => void }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t("totalSavings"), value: "₹4,250", icon: PiggyBank, color: "text-primary" },
          { label: t("schemesMatchedLabel"), value: "6", icon: Search, color: "text-secondary" },
          { label: t("lessonsDone"), value: "8/24", icon: BookOpen, color: "text-accent" },
          { label: t("savingsStreak"), value: "12 days 🔥", icon: TrendingUp, color: "text-saffron-deep" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      <div className="bg-saffron/10 rounded-2xl p-4 border border-saffron/20">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-saffron-deep" /> {t("newSchemeAlert")}
        </h3>
        <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("schemeAlertText") }} />
        <button onClick={() => onNavigate("schemes")} className="text-sm text-primary font-semibold mt-2 flex items-center gap-1">
          {t("checkEligibility")} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold mb-3">{t("quickActions")}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: t("talkToSakhi"), icon: Mic, tab: "assistant" as TabKey },
            { label: t("logExpense"), icon: BarChart3, tab: "budget" as TabKey },
            { label: t("findSchemes"), icon: Search, tab: "schemes" as TabKey },
            { label: t("addSavings"), icon: PiggyBank, tab: "savings" as TabKey },
            { label: t("continueLearning"), icon: BookOpen, tab: "learn" as TabKey },
            { label: t("learnBusiness"), icon: Briefcase, tab: "entrepreneurship" as TabKey },
            { label: t("mySHGGroup"), icon: Users, tab: "community" as TabKey },
            { label: "View Impact", icon: Sparkles, tab: "impact" as TabKey },
          ].map((a, i) => (
            <button key={i} onClick={() => onNavigate(a.tab)} className="bg-card rounded-xl p-4 border border-border hover:shadow-iraivi transition-shadow text-left">
              <a.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-medium">{a.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Learning progress */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <h3 className="font-bold mb-2">{t("learningProgress")}</h3>
        <p className="text-sm text-muted-foreground mb-3">{t("level2Banking")}</p>
        <Progress value={33} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">{t("lessonsCompleted")}</p>
      </div>
    </div>
  );
};

const ImpactTab = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-amber-600 to-purple-600 bg-clip-text text-transparent mb-4">
          IRAIVI Impact Dashboard
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience the power of AI-driven financial empowerment through our interactive dashboard.
        </p>
      </div>

      {/* Future Vision Card */}
      <div className="transform hover:scale-105 transition-transform duration-300">
        <FutureVisionCard />
      </div>

      {/* Impact Map */}
      <div className="transform hover:scale-105 transition-transform duration-300">
        <ImpactMap />
      </div>

      {/* Voice Mentor */}
      <div className="transform hover:scale-105 transition-transform duration-300">
        <VoiceMentor />
      </div>
    </div>
  );
};

export default Dashboard;
