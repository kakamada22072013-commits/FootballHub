"use client";

import Link from "next/link";
import { User, Heart, Clock, Settings, Trash2 } from "lucide-react";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useI18n } from "@/contexts/I18nContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export default function ProfilePage() {
  const { favourites, getByType } = useFavourites();
  const { items, clearHistory } = useRecentlyViewed();
  const { t } = useI18n();

  const stats = [
    { label: t.profile.favouriteTeams, value: getByType("team").length, icon: "⚽" },
    { label: t.profile.favouritePlayers, value: getByType("player").length, icon: "👤" },
    { label: t.profile.favouriteLeagues, value: getByType("league").length, icon: "🏆" },
    { label: t.profile.recentlyViewed, value: items.length, icon: "👁️" },
  ];

  return (
    <div className="space-y-10 pb-8 max-w-3xl mx-auto">
      <div className="glass-card flex items-center gap-6 py-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
          <User className="w-10 h-10 text-slate-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t.profile.title}</h1>
          <p className="text-slate-400">{t.profile.subtitle}</p>
          <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-neon-green mt-2 hover:underline">
            <Settings className="w-4 h-4" /> {t.nav.settings}
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" /> {t.profile.favouriteStats}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card text-center py-4">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold gradient-text mt-2">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        <Link href="/favourites" className="btn-secondary mt-4 inline-flex">
          {t.profile.viewAllFavourites}
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-blue" /> {t.profile.recentlyViewed}
          </h2>
          {items.length > 0 && (
            <button onClick={clearHistory} className="text-sm text-slate-400 hover:text-red-400 flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> {t.profile.clear}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-slate-400 text-sm">{t.profile.noRecentlyViewed}</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="glass-card flex items-center gap-4 py-3"
              >
                {item.image && (
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    type={item.type === "team" ? "team" : item.type === "player" ? "player" : "league"}
                  />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{item.type}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
