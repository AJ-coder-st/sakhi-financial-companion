import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Heart, Handshake, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cream" ref={ref}>
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            {t("bePartOf")} <span className="text-gradient-saffron">{t("revolution")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">{t("ctaDesc")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          {[
            { icon: Handshake, label: t("partnerWithUs"), desc: t("partnerDesc") },
            { icon: Heart, label: t("invest"), desc: t("investDesc") },
            { icon: Code, label: t("buildWithUs"), desc: t("buildDesc") },
          ].map((c, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 shadow-sakhi">
              <c.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">{c.label}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </motion.div>

        <Link to="/dashboard">
          <Button size="lg" className="bg-saffron-gradient text-saffron-foreground font-bold text-lg shadow-saffron hover:opacity-90 gap-2">
            {t("launchSakhi")} <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
