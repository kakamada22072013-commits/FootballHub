"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useFavourites } from "@/contexts/FavouritesContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { EmptyState } from "@/components/ui/States";

export default function FavouritesPage() {
  const { favourites, removeFavourite, getByType } = useFavourites();

  const teams = getByType("team");
  const players = getByType("player");
  const leagues = getByType("league");

  if (favourites.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold gradient-text">Favourites</h1>
        <EmptyState
          title="No favourites yet"
          description="Save teams, players, and leagues to access them quickly"
          icon={<Heart className="w-12 h-12 text-red-400" />}
        />
      </div>
    );
  }

  const sections = [
    { title: "Teams", items: teams, href: (id: string) => `/teams/${id}`, type: "team" as const },
    { title: "Players", items: players, href: (id: string) => `/players/${id}`, type: "player" as const },
    { title: "Leagues", items: leagues, href: (id: string) => `/leagues/${id}`, type: "league" as const },
  ];

  return (
    <div className="space-y-10 pb-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Favourites</h1>
        <p className="text-slate-400">{favourites.length} saved items</p>
      </div>

      {sections.map(
        (section) =>
          section.items.length > 0 && (
            <section key={section.title}>
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <div key={item.id} className="glass-card flex items-center gap-4">
                    <Link href={section.href(item.id)} className="flex items-center gap-4 flex-1 min-w-0">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        type={section.type === "team" ? "team" : section.type === "player" ? "player" : "league"}
                        className="rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{item.name}</p>
                        {item.subtitle && <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>}
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFavourite(item.id, item.type)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg shrink-0"
                      aria-label="Remove favourite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
