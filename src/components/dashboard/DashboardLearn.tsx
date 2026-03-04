import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, Play } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const levels = [
  { level: 1, title: "What is Money?", titleHi: "पैसा क्या है?", lessons: 4, completed: 4, status: "complete" },
  { level: 2, title: "Banking Basics", titleHi: "बैंकिंग की बुनियाद", lessons: 4, completed: 2, status: "current" },
  { level: 3, title: "Saving & Budgeting", titleHi: "बचत और बजट", lessons: 4, completed: 0, status: "locked" },
  { level: 4, title: "Credit & Loans", titleHi: "उधार और ऋण", lessons: 4, completed: 0, status: "locked" },
  { level: 5, title: "Insurance & Protection", titleHi: "बीमा और सुरक्षा", lessons: 4, completed: 0, status: "locked" },
  { level: 6, title: "Start Your Business", titleHi: "अपना व्यवसाय शुरू करें", lessons: 4, completed: 0, status: "locked" },
];

const DashboardLearn = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("financialLiteracyPath")}</h2>
        <p className="text-sm text-muted-foreground">{t("learnSubtitle")}</p>
      </div>

      <div className="space-y-4">
        {levels.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`bg-card rounded-2xl p-5 border transition-shadow ${l.status === "current" ? "border-primary shadow-sakhi" : "border-border"} ${l.status === "locked" ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${l.status === "complete" ? "bg-accent text-accent-foreground" : l.status === "current" ? "bg-saffron-gradient text-saffron-foreground" : "bg-muted text-muted-foreground"}`}>
                {l.status === "complete" ? <CheckCircle className="w-6 h-6" /> : l.status === "locked" ? <Lock className="w-5 h-5" /> : l.level}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{l.title}</h3>
                <p className="text-xs text-saffron-deep font-devanagari">{l.titleHi}</p>
                <div className="mt-2">
                  <Progress value={(l.completed / l.lessons) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{l.completed}/{l.lessons} {t("lessons")}</p>
                </div>
              </div>
              {l.status === "current" && (
                <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLearn;
