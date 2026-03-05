import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { label: t("features"), href: "#features" },
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("schemes"), href: "#schemes" },
    { label: t("impact"), href: "#impact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center">
            <Mic className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient-sakhi">IRAIVI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector variant="compact" />
          <Link to="/login">
            <Button variant="ghost" size="sm">{t("login")}</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="bg-saffron-gradient text-saffron-foreground font-semibold shadow-saffron hover:opacity-90">
              {t("getStarted")}
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="text-sm font-medium py-2" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <LanguageSelector />
              <Link to="/dashboard">
                <Button className="w-full bg-saffron-gradient text-saffron-foreground font-semibold mt-2">
                  {t("getStarted")}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
