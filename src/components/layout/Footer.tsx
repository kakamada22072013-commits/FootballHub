"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useToast } from "@/contexts/ToastContext";
import { useI18n } from "@/contexts/I18nContext";

export function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  const { t } = useI18n();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast("Thanks for subscribing to FootballHub AI newsletter!", "success");
    setEmail("");
  };

  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center font-black text-slate-900">
                FH
              </div>
              <span className="font-bold text-xl">FootballHub AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Instagram, href: "https://www.instagram.com/abderrahim__maafi/" },
                { Icon: Youtube, href: "https://youtube.com" },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass hover:border-neon-green/30 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-neon-green">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => {
                const labelKey = link.label.toLowerCase() as keyof typeof t.nav;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-neon-blue transition-colors"
                    >
                      {t.nav[labelKey] || link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-neon-blue">{t.footer.competitions}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/leagues/4328" className="hover:text-white">Premier League</Link></li>
              <li><Link href="/leagues/4335" className="hover:text-white">La Liga</Link></li>
              <li><Link href="/leagues/4480" className="hover:text-white">Champions League</Link></li>
              <li><Link href="/leagues/4429" className="hover:text-white">World Cup</Link></li>
              <li><Link href="/matches" className="hover:text-white">{t.matches.title}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 gradient-text">{t.footer.newsletter}</h4>
            <p className="text-sm text-slate-400 mb-3">{t.footer.newsletterDesc}</p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800/80 border border-white/10 text-sm focus:border-neon-green/50 outline-none"
                required
              />
              <button type="submit" className="btn-primary px-4 py-2 text-sm">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} FootballHub AI. {t.footer.allRightsReserved}</p>
          <p>
            {t.footer.dataProvided}{" "}
            <a
              href="https://www.thesportsdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-green hover:underline"
            >
              TheSportsDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
