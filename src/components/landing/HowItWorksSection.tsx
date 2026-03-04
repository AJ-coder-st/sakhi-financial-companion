import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MessageCircle, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Phone,
    title: "Connect",
    titleHi: "जुड़ें",
    desc: "Sign up with just your phone number. No email, no passwords. Available via WhatsApp, USSD, or app.",
    color: "bg-primary",
  },
  {
    icon: MessageCircle,
    title: "Interact",
    titleHi: "बात करें",
    desc: "Speak to SAKHI in your language. She finds schemes, tracks savings, and teaches financial concepts.",
    color: "bg-saffron-gradient",
  },
  {
    icon: TrendingUp,
    title: "Empower",
    titleHi: "आगे बढ़ें",
    desc: "Access government benefits, build savings habits, and grow your financial confidence — one step at a time.",
    color: "bg-accent",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">How <span className="text-gradient-sakhi">SAKHI</span> Works</h2>
          <p className="text-muted-foreground">Three simple steps to financial empowerment</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                <step.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-xs font-bold text-muted-foreground mb-1">STEP {i + 1}</div>
              <h3 className="text-xl font-bold mb-1">{step.title}</h3>
              <p className="text-sm text-saffron-deep font-devanagari mb-3">{step.titleHi}</p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
