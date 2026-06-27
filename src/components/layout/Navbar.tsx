"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Shield,
  Users,
  Trophy,
  Calendar,
  Globe,
  Heart,
  User,
  Search,
  Settings,
  Menu,
  X,
  Bot,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
  Languages,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LiveClock } from "@/components/ui/LiveClock";
import { SearchModal } from "@/components/search/SearchModal";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n, type Language } from "@/contexts/I18nContext";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Shield, Users, Trophy, Calendar, Globe, Heart, User,
};

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "ar", label: "AR", flag: "🇸🇦" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { t, locale, setLocale } = useI18n();

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center font-black text-slate-900 text-sm group-hover:shadow-neon transition-shadow">
              FH
            </div>
            <span className="font-bold text-lg hidden sm:block">
              Football<span className="gradient-text">Hub AI</span>
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = iconMap[link.icon];
              const active = pathname === link.href;
              const labelKey = link.label.toLowerCase() as keyof typeof t.nav;
              const label = t.nav[labelKey] || link.label;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LiveClock />

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg glass hover:border-neon-green/30 transition-colors flex items-center gap-1"
                aria-label="Language"
              >
                <Languages className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">{LANGUAGES.find(l => l.code === locale)?.flag}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 glass rounded-xl p-2 min-w-[140px] shadow-xl border border-white/10 z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                        locale === lang.code
                          ? "bg-neon-green/10 text-neon-green"
                          : "hover:bg-white/5 text-slate-300"
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Link
                href="/auth/dashboard"
                className={cn(
                  "p-2.5 rounded-lg transition-colors hidden sm:flex",
                  pathname === "/auth/dashboard"
                    ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                    : "glass hover:border-neon-green/30"
                )}
                aria-label={t.nav.dashboard}
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="p-2.5 rounded-lg glass hover:border-neon-green/30 transition-colors hidden sm:flex"
                  aria-label={t.nav.signIn}
                >
                  <LogIn className="w-5 h-5" />
                </Link>
              </>
            )}

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-lg glass hover:border-neon-blue/30 transition-colors"
              aria-label={t.nav.search}
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/settings"
              className="p-2.5 rounded-lg glass hover:border-neon-green/30 transition-colors hidden sm:flex"
              aria-label={t.nav.settings}
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-lg glass xl:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {NAV_LINKS.map((link) => {
              const Icon = iconMap[link.icon];
              const labelKey = link.label.toLowerCase() as keyof typeof t.nav;
              const label = t.nav[labelKey] || link.label;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5"
                >
                  <Icon className="w-5 h-5 text-neon-green" />
                  {label}
                </Link>
              );
            })}

            {/* Language switcher in mobile */}
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="text-xs text-slate-500 px-4 mb-2">{t.settings.language}</p>
              <div className="flex gap-2 px-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setMobileOpen(false); }}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm border transition-colors",
                      locale === lang.code
                        ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth in mobile */}
            <div className="border-t border-white/10 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/auth/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5"
                  >
                    <LayoutDashboard className="w-5 h-5 text-neon-green" />
                    {t.nav.dashboard}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 w-full text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5"
                  >
                    <LogIn className="w-5 h-5 text-neon-blue" />
                    {t.nav.signIn}
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5"
                  >
                    <UserPlus className="w-5 h-5 text-neon-green" />
                    {t.nav.signUp}
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setMobileOpen(false);
                window.dispatchEvent(new CustomEvent("open-ai-chat"));
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 w-full"
            >
              <Bot className="w-5 h-5 text-neon-purple" />
              {t.nav.aiAssistant}
            </button>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
