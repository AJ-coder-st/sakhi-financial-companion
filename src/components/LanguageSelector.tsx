import { Globe } from "lucide-react";
import { useLanguage, languageLabels } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector = ({ variant = "default" }: { variant?: "default" | "compact" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
      <SelectTrigger className={`${variant === "compact" ? "w-[100px] h-8 text-xs" : "w-[130px] h-9 text-sm"} gap-1`}>
        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(languageLabels) as Language[]).map((lang) => (
          <SelectItem key={lang} value={lang}>
            {languageLabels[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
