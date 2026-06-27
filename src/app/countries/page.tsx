"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllCountries } from "@/lib/api/sportsdb";
import { TOP_COUNTRIES } from "@/lib/constants";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { useI18n } from "@/contexts/I18nContext";
import type { Country } from "@/types/sportsdb";

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("");
  const { t } = useI18n();

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = countries.filter((c) =>
    !filter || c.strCountry.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">{t.countries.title}</h1>
        <p className="text-slate-400">{t.countries.subtitle}</p>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">{t.countries.topNations}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {TOP_COUNTRIES.map((country) => (
            <Link
              key={country}
              href={`/countries/${encodeURIComponent(country)}`}
              className="glass-card text-center py-5 hover:border-neon-green/30 hover:scale-105 transition-all"
            >
              <span className="text-3xl mb-2 block">⚽</span>
              <span className="font-medium text-sm">{country}</span>
            </Link>
          ))}
        </div>
      </section>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={t.countries.search}
        className="w-full max-w-xl px-4 py-3 rounded-xl glass border border-white/10 outline-none focus:border-neon-green/40"
      />

      {loading && <LoadingState />}
      {error && <ErrorState onRetry={load} />}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.length === 0 && filter && (
            <p className="col-span-full text-center text-slate-500 py-8">{t.common.noResults}</p>
          )}
          {filtered.map((country) => (
            <Link
              key={country.strCountry}
              href={`/countries/${encodeURIComponent(country.strCountry)}`}
              className="glass-card flex items-center gap-3 py-3 px-4 hover:border-neon-blue/30 transition-all"
            >
              {country.strFlag ? (
                <Image
                  src={country.strFlag}
                  alt={country.strCountry}
                  width={28}
                  height={20}
                  className="object-contain shrink-0 rounded-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-xl shrink-0">🏳️</span>
              )}
              <span className="text-sm font-medium truncate">{country.strCountry}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
