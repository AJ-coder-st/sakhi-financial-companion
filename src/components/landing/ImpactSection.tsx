import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "react-countup";

const phases = [
  { phase: "Phase 1", label: "Pilot", target: "5,000 women", months: "0–6 months", pct: 15 },
  { phase: "Phase 2", label: "Scale", target: "100,000 women", months: "6–18 months", pct: 50 },
  { phase: "Phase 3", label: "Nationwide", target: "1,000,000 women", months: "18–36 months", pct: 100 },
];

const ImpactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="impact" className="py-20 bg-hero-gradient text-primary-foreground" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Impact & <span className="text-gradient-saffron">Roadmap</span></h2>
          <p className="text-primary-foreground/60 max-w-xl mx-auto">From 5,000 women to 1 million — a three-phase journey to nationwide impact</p>
        </motion.div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { val: 3, suffix: "x", label: "Avg savings increase" },
            { val: 85, suffix: "%", label: "Scheme enrollment rate" },
            { val: 92, suffix: "%", label: "User retention (90-day)" },
            { val: 4.8, suffix: "/5", label: "User satisfaction" },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-saffron">
                {isInView && <CountUp end={m.val} decimals={m.val % 1 ? 1 : 0} duration={2} />}
                {m.suffix}
              </div>
              <p className="text-sm text-primary-foreground/50 mt-1">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Phases */}
        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.2 }}
              className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10"
            >
              <div className="text-xs font-bold text-saffron mb-1">{p.phase}</div>
              <h3 className="text-xl font-bold mb-1">{p.label}</h3>
              <p className="text-sm text-primary-foreground/50 mb-4">{p.months}</p>
              <div className="w-full bg-primary-foreground/10 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${p.pct}%` } : {}}
                  transition={{ delay: 0.6 + i * 0.2, duration: 1 }}
                  className="h-3 rounded-full bg-saffron-gradient"
                />
              </div>
              <p className="text-sm font-semibold">{p.target}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
