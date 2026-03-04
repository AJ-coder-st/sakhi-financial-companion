import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Heart, Handshake, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-cream" ref={ref}>
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Be Part of the <span className="text-gradient-saffron">Revolution</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
            SAKHI is more than an app — it's a movement to bring 200 million women into the financial mainstream.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
        >
          {[
            { icon: Handshake, label: "Partner With Us", desc: "NGOs, banks, government agencies" },
            { icon: Heart, label: "Invest", desc: "Impact-driven funding for scale" },
            { icon: Code, label: "Build With Us", desc: "Open-source contributors welcome" },
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
            Launch SAKHI <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
