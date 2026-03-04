import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, BookOpen, Search, PiggyBank, Users, BarChart3 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const features = [
    { icon: Mic, title: t("aiVoiceAssistant"), desc: t("aiVoiceDesc"), accent: "primary" },
    { icon: BookOpen, title: t("financialLiteracy"), desc: t("financialLiteracyDesc"), accent: "secondary" },
    { icon: Search, title: t("schemeMatching"), desc: t("schemeMatchingDesc"), accent: "accent" },
    { icon: BarChart3, title: t("budgetTracker"), desc: t("budgetTrackerDesc"), accent: "primary" },
    { icon: PiggyBank, title: t("microSavings"), desc: t("microSavingsDesc"), accent: "secondary" },
    { icon: Users, title: t("communitySHG"), desc: t("communitySHGDesc"), accent: "accent" },
  ];

  return (
    <section id="features" className="py-20 bg-cream" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t("coreModules")} <span className="text-gradient-saffron">{t("modules")}</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("featuresSubtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-6 hover:shadow-sakhi transition-shadow group">
              <div className={`w-12 h-12 rounded-xl bg-${f.accent}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 text-${f.accent}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
