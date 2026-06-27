"use client";

import { Moon, Sun, Globe, Sparkles, Trash2 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/contexts/ToastContext";
import { useI18n, type Language } from "@/contexts/I18nContext";
import { clearAllCache } from "@/lib/cache";
import { cn } from "@/lib/utils";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

export default function SettingsPage() {
  const { settings, toggleTheme, toggleAnimations } = useSettings();
  const { t, locale, setLocale } = useI18n();
  const { showToast } = useToast();

  const handleClearCache = () => {
    clearAllCache();
    showToast(t.settings.cacheCleared, "success");
  };

  return (
    <div className="space-y-8 pb-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">{t.settings.title}</h1>
        <p className="text-slate-400">{t.settings.subtitle}</p>
      </div>

      <section className="glass-card space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          {settings.theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          {t.settings.theme}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => settings.theme !== "dark" && toggleTheme()}
            className={cn(
              "flex-1 py-3 rounded-xl border transition-all",
              settings.theme === "dark"
                ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
                : "border-white/10 hover:border-white/20"
            )}
          >
            <Moon className="w-5 h-5 mx-auto mb-1" />
            {t.settings.darkMode}
          </button>
          <button
            onClick={() => settings.theme !== "light" && toggleTheme()}
            className={cn(
              "flex-1 py-3 rounded-xl border transition-all",
              settings.theme === "light"
                ? "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
                : "border-white/10 hover:border-white/20"
            )}
          >
            <Sun className="w-5 h-5 mx-auto mb-1" />
            {t.settings.lightMode}
          </button>
        </div>
      </section>

      <section className="glass-card space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Globe className="w-5 h-5" /> {t.settings.language}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={cn(
                "py-2.5 px-4 rounded-xl border text-sm transition-all",
                locale === lang.code
                  ? "border-neon-green/40 bg-neon-green/10"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> {t.settings.animations}
        </h2>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-slate-400">{t.settings.enableAnimations}</span>
          <button
            role="switch"
            aria-checked={settings.animationsEnabled}
            onClick={toggleAnimations}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              settings.animationsEnabled ? "bg-neon-green" : "bg-slate-600"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                settings.animationsEnabled ? "left-7" : "left-1"
              )}
            />
          </button>
        </label>
      </section>

      <section className="glass-card space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Trash2 className="w-5 h-5" /> {t.settings.cache}
        </h2>
        <p className="text-sm text-slate-400">{t.settings.cacheDescription}</p>
        <button onClick={handleClearCache} className="btn-secondary">
          <Trash2 className="w-4 h-4" /> {t.settings.clearCache}
        </button>
      </section>
    </div>
  );
}
