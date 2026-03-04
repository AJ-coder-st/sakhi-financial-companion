import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "react-countup";

const stats = [
  { value: 200, suffix: "M+", label: "Women Financially Excluded", icon: "🚫" },
  { value: 40000, suffix: " Cr+", label: "Government Schemes Unclaimed (₹)", icon: "💰", prefix: "₹" },
  { value: 77, suffix: "%", label: "Rural Women Without Bank Literacy", icon: "📖" },
  { value: 65, suffix: "%", label: "Own Feature Phones, Not Smartphones", icon: "📱" },
];

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-warm" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">The Problem is <span className="text-gradient-saffron">Massive</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Most fintech is designed for literate smartphone users. Rural women are left behind.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-6 text-center shadow-sakhi"
            >
              <span className="text-3xl mb-3 block">{s.icon}</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                {isInView && (
                  <>
                    {s.prefix}
                    <CountUp end={s.value} duration={2.5} separator="," />
                    {s.suffix}
                  </>
                )}
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
