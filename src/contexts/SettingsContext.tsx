"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AppSettings } from "@/types/sportsdb";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  language: "en",
  animationsEnabled: true,
};

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  toggleAnimations: () => void;
  setLanguage: (lang: AppSettings["language"]) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "fh_settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.documentElement.classList.toggle("light", settings.theme === "light");
    document.documentElement.classList.toggle("no-animations", !settings.animationsEnabled);
    document.documentElement.lang = settings.language;
  }, [settings, mounted]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }, []);

  const toggleAnimations = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      animationsEnabled: !prev.animationsEnabled,
    }));
  }, []);

  const setLanguage = useCallback((lang: AppSettings["language"]) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, toggleTheme, toggleAnimations, setLanguage }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
