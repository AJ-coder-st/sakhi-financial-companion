import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "react-countup";
import { useLanguage } from "@/i18n/LanguageContext";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const stats = [
    { value: 200, suffix: "M+", label: t("womenExcluded"), icon: "🚫" },
    { value: 40000, suffix: " Cr+", label: t("schemesUnclaimed"), icon: "💰", prefix: "₹" },
    { value: 77, suffix: "%", label: t("withoutBankLiteracy"), icon: "📖" },
    { value: 65, suffix: "%", label: t("ownFeaturePhones"), icon: "📱" },
  ];

  return (
    <section className="py-20 bg-warm" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t("problemMassive")} <span className="text-gradient-saffron">{t("massive")}</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("statsSubtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }} className="bg-card rounded-2xl p-6 text-center shadow-sakhi">
              <span className="text-3xl mb-3 block">{s.icon}</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                {isInView && (<>{s.prefix}<CountUp end={s.value} duration={2.5} separator="," />{s.suffix}</>)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
