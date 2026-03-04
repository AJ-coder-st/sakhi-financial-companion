import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";

const schemes = [
  { name: "Jan Dhan Yojana", ministry: "Finance", benefit: "Zero-balance bank account + ₹10,000 OD", category: "Banking", match: 95 },
  { name: "PM Mudra Yojana", ministry: "Finance", benefit: "Loans up to ₹10 lakh for micro-enterprises", category: "Credit", match: 88 },
  { name: "Mahila Samman Savings", ministry: "Finance", benefit: "7.5% interest, 2-year deposits up to ₹2L", category: "Savings", match: 92 },
  { name: "PM Fasal Bima Yojana", ministry: "Agriculture", benefit: "Crop insurance at subsidized premiums", category: "Insurance", match: 78 },
  { name: "Ujjwala Yojana", ministry: "Petroleum", benefit: "Free LPG connection + refill subsidy", category: "Welfare", match: 96 },
  { name: "Stand-Up India", ministry: "Finance", benefit: "Loans ₹10L-1Cr for women entrepreneurs", category: "Credit", match: 72 },
];

const categoryColors: Record<string, string> = {
  Banking: "bg-primary/10 text-primary",
  Credit: "bg-secondary/10 text-secondary",
  Savings: "bg-accent/10 text-accent",
  Insurance: "bg-saffron/20 text-saffron-deep",
  Welfare: "bg-forest-light/20 text-forest-dark",
};

const SchemesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <section id="schemes" className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t("governmentSchemes")} <span className="text-gradient-sakhi">{t("schemesMatchedTitle")}</span></h2>
          <p className="text-muted-foreground">{t("schemesAnalyzes")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 border border-border hover:shadow-sakhi transition-all group">
              <div className="flex items-start justify-between mb-3">
                <Badge className={categoryColors[s.category] || "bg-muted text-muted-foreground"} variant="secondary">{s.category}</Badge>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">{t("match")}</span>
                  <div className="text-lg font-bold text-primary">{s.match}%</div>
                </div>
              </div>
              <h3 className="font-bold mb-1">{s.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{s.ministry}</p>
              <p className="text-sm text-muted-foreground">{s.benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchemesSection;
