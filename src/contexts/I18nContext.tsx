"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import en from "@/lib/i18n/dictionaries/en";
import fr from "@/lib/i18n/dictionaries/fr";
import ar from "@/lib/i18n/dictionaries/ar";
import type { Translations } from "@/lib/i18n/dictionaries/en";

export type Language = "en" | "fr" | "ar";

const dictionaries: Record<Language, Translations> = { en, fr, ar };

interface I18nContextValue {
  locale: Language;
  t: Translations;
  setLocale: (lang: Language) => void;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "fh_locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && dictionaries[stored]) setLocaleState(stored);
    } catch {}
  }, []);

  const setLocale = useCallback((lang: Language) => {
    setLocaleState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = dictionaries[locale] || en;

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
