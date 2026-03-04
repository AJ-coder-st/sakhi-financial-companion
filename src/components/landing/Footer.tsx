import { Mic, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest-dark text-primary-foreground/60 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-saffron-gradient flex items-center justify-center">
                <Mic className="w-4 h-4 text-saffron-foreground" />
              </div>
              <span className="text-lg font-bold text-primary-foreground">SAKHI</span>
            </div>
            <p className="text-sm">{t("footerDesc")}</p>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3">{t("platform")}</h4>
            <ul className="space-y-2 text-sm">
              <li>{t("aiAssistant")}</li>
              <li>{t("schemeMatching")}</li>
              <li>{t("financialLiteracy")}</li>
              <li>{t("microSavings")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3">{t("resources")}</h4>
            <ul className="space-y-2 text-sm">
              <li>{t("aboutUs")}</li>
              <li>{t("privacyPolicy")}</li>
              <li>{t("dpdpCompliance")}</li>
              <li>{t("openSource")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3">{t("contact")}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> 1800-SAKHI-01</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@sakhi.org</div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm">
          {t("madeWithLove")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
