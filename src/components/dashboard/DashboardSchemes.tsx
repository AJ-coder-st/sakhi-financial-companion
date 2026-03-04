import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const schemes = [
  { name: "Jan Dhan Yojana", benefit: "Zero-balance account + ₹10,000 OD", match: 95, category: "Banking", status: "eligible" },
  { name: "Mahila Samman Savings", benefit: "7.5% interest on 2-year deposit", match: 92, category: "Savings", status: "eligible" },
  { name: "Ujjwala Yojana", benefit: "Free LPG connection + refill subsidy", match: 96, category: "Welfare", status: "applied" },
  { name: "PM Mudra Yojana", benefit: "Micro-enterprise loans up to ₹10L", match: 88, category: "Credit", status: "eligible" },
  { name: "PM Fasal Bima", benefit: "Crop insurance at subsidized rates", match: 78, category: "Insurance", status: "eligible" },
  { name: "Stand-Up India", benefit: "Loans ₹10L-1Cr for SC/ST/women", match: 72, category: "Credit", status: "eligible" },
];

const DashboardSchemes = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t("yourMatchedSchemes")}</h2>
          <p className="text-sm text-muted-foreground">{t("profileBasis")}</p>
        </div>
        <Badge className="bg-primary/10 text-primary">{schemes.length} {t("found")}</Badge>
      </div>

      {schemes.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 hover:shadow-sakhi transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold">{s.name}</h3>
              {s.status === "applied" && (
                <Badge className="bg-accent/10 text-accent text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" /> {t("applied")}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{s.benefit}</p>
            <Badge variant="secondary" className="mt-2 text-xs">{s.category}</Badge>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-primary">{s.match}%</div>
            <p className="text-xs text-muted-foreground">{t("match")}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardSchemes;
