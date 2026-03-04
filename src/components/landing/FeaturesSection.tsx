import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, BookOpen, Search, PiggyBank, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "AI Voice Assistant",
    desc: "Talk to SAKHI in Hindi, Tamil, Telugu, Bengali & more. She understands you and guides you — no typing needed.",
    accent: "primary",
  },
  {
    icon: BookOpen,
    title: "Financial Literacy",
    desc: "Audio stories, illustrated cards, quizzes. Learn from 'What is money?' to 'Start your business' — at your pace.",
    accent: "secondary",
  },
  {
    icon: Search,
    title: "Scheme Matching",
    desc: "50+ government schemes analyzed. SAKHI matches your profile to eligible benefits and guides your application.",
    accent: "accent",
  },
  {
    icon: BarChart3,
    title: "Budget Tracker",
    desc: "\"Maine 50 rupaye sabzi pe kharch kiye\" — voice-log expenses. See monthly summaries and savings streaks.",
    accent: "primary",
  },
  {
    icon: PiggyBank,
    title: "Micro-Savings",
    desc: "Visual savings jars for goals — school fees, emergencies, festivals. Even ₹10/day builds a safety net.",
    accent: "secondary",
  },
  {
    icon: Users,
    title: "Community (SHG)",
    desc: "Manage your Self-Help Group. Track contributions, schedule meetings, share advice with your community.",
    accent: "accent",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-20 bg-cream" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">6 Core <span className="text-gradient-saffron">Modules</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Everything a rural woman needs for financial independence — in one platform</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 hover:shadow-sakhi transition-shadow group"
            >
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
