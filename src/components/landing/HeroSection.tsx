import { motion } from "framer-motion";
import { Mic, ArrowRight, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--saffron) / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--forest-light) / 0.2) 0%, transparent 40%)"
      }} />

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Globe className="w-4 h-4 text-saffron" />
              <span className="text-sm text-primary-foreground/80">Available in 10+ Indian Languages</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
              आपकी सखी,{" "}
              <span className="text-gradient-saffron">आपकी ताक़त</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/70 mb-2 font-devanagari">
              Your SAKHI, Your Strength
            </p>
            <p className="text-base text-primary-foreground/60 max-w-lg mb-8">
              AI-powered financial companion designed for rural women. Voice-first. Feature-phone friendly. Reaching the truly last mile.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/dashboard">
                <Button size="lg" className="bg-saffron-gradient text-saffron-foreground font-bold text-lg shadow-saffron hover:opacity-90 gap-2">
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2">
                  <Mic className="w-5 h-5" /> See Demo
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 text-primary-foreground/50 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>DPDP Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🇮🇳</span>
                <span>Made for Bharat</span>
              </div>
            </div>
          </motion.div>

          {/* Right — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-72 h-[520px] bg-card rounded-[2.5rem] shadow-2xl p-3 border-4 border-primary-foreground/10">
                <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden flex flex-col">
                  {/* Status bar */}
                  <div className="bg-primary px-4 py-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-saffron-gradient flex items-center justify-center">
                      <Mic className="w-4 h-4 text-saffron-foreground" />
                    </div>
                    <span className="text-sm font-bold text-primary-foreground">SAKHI</span>
                  </div>

                  {/* Chat */}
                  <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] self-start"
                    >
                      <p className="text-sm font-devanagari">नमस्ते सुनीता दीदी! 🙏 मैं आपकी सखी हूँ। आज मैं आपकी क्या मदद कर सकती हूँ?</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 }}
                      className="bg-saffron/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] self-end"
                    >
                      <p className="text-sm font-devanagari">मुझे बचत योजना के बारे में बताओ</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.6 }}
                      className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] self-start"
                    >
                      <p className="text-sm font-devanagari">बिलकुल! आपके लिए 3 योजनाएं मिली हैं। सबसे पहले <strong>महिला सम्मान बचत पत्र</strong> — इसमें 7.5% ब्याज मिलता है। ✨</p>
                    </motion.div>
                  </div>

                  {/* Mic button */}
                  <div className="p-4 flex justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-14 h-14 rounded-full bg-saffron-gradient flex items-center justify-center shadow-saffron cursor-pointer"
                    >
                      <Mic className="w-7 h-7 text-saffron-foreground" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute -left-16 top-20 bg-card rounded-2xl px-4 py-3 shadow-sakhi"
              >
                <p className="text-xs text-muted-foreground">Schemes Matched</p>
                <p className="text-2xl font-bold text-primary">50+</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
                className="absolute -right-16 bottom-32 bg-card rounded-2xl px-4 py-3 shadow-sakhi"
              >
                <p className="text-xs text-muted-foreground">Languages</p>
                <p className="text-2xl font-bold text-secondary">10+</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
