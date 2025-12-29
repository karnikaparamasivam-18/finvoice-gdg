import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore, Language } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Globe, Sparkles } from "lucide-react";
import womenEmpowermentImg from "@/assets/women-empowerment.png";

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
];

export const WelcomePage = () => {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const navigate = useNavigate(); // ✅ HOOK USED CORRECTLY

  const handleContinue = () => {
    if (selectedLang) {
      setLanguage(selectedLang);
      localStorage.setItem("lang", selectedLang);
      navigate("/setup");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 text-center max-w-md animate-fade-in">
        <div className="mb-6 flex justify-center">
          <img
            src={womenEmpowermentImg}
            alt="Women empowerment illustration"
            className="w-48 h-36 object-contain rounded-2xl shadow-card"
          />
        </div>

        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-xl font-medium text-muted-foreground mb-1">
          Welcome to
        </h1>
        <h2 className="text-4xl font-extrabold text-gradient mb-2">
          FinVoice
        </h2>
        <p className="text-muted-foreground text-base mb-8">
          Empowering Women's Self Help Groups
        </p>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">
              Select your language
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedLang === lang.code
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                }`}
              >
                <span className="block text-lg font-bold">
                  {lang.nativeName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedLang}
          size="lg"
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
