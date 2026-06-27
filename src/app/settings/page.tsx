"use client";

import { Moon, Sun, Globe, Sparkles, Trash2, Send } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/contexts/ToastContext";
import { useI18n, type Language } from "@/contexts/I18nContext";
import { clearAllCache } from "@/lib/cache";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
];

export default function SettingsPage() {
  const { settings, toggleTheme, toggleAnimations } = useSettings();
  const { t, locale, setLocale } = useI18n();
  const { showToast } = useToast();
  const pathname = usePathname();

  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleClearCache = () => {
    clearAllCache();
    showToast(t.settings.cacheCleared, "success");
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail.trim() || !feedbackMessage.trim()) {
      showToast("Please fill in both fields", "error");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: feedbackEmail.trim(),
          message: feedbackMessage.trim(),
          page: pathname,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Feedback sent! Thank you.", "success");
        setFeedbackEmail("");
        setFeedbackMessage("");
      } else {
        showToast(data.error || "Failed to send feedback", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-2xl mx-auto" dir={locale === "ar" || locale === "ur" ? "rtl" : "ltr"}>
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
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={cn(
                "py-2.5 px-3 rounded-xl border text-sm transition-all flex items-center gap-1.5",
                locale === lang.code
                  ? "border-neon-green/40 bg-neon-green/10"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <span>{lang.flag}</span>
              <span className="truncate">{lang.label}</span>
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

      <section className="glass-card space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Send className="w-5 h-5" /> Feedback
        </h2>
        <p className="text-sm text-slate-400">Report a bug or share your thoughts. Sent directly to the developer.</p>
        <form onSubmit={handleSubmitFeedback} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Your Email</label>
            <input
              type="email"
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 outline-none focus:border-neon-green/40 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Describe the error or your suggestion..."
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 outline-none focus:border-neon-green/40 text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sending ? "Sending..." : "Send Feedback"}
          </button>
        </form>
      </section>
    </div>
  );
}
