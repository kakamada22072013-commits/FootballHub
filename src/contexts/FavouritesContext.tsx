"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FavouriteItem } from "@/types/sportsdb";

interface FavouritesContextValue {
  favourites: FavouriteItem[];
  isFavourite: (id: string, type: FavouriteItem["type"]) => boolean;
  toggleFavourite: (item: Omit<FavouriteItem, "addedAt">) => void;
  removeFavourite: (id: string, type: FavouriteItem["type"]) => void;
  getByType: (type: FavouriteItem["type"]) => FavouriteItem[];
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);
const STORAGE_KEY = "fh_favourites";

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavourites(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const isFavourite = useCallback(
    (id: string, type: FavouriteItem["type"]) =>
      favourites.some((f) => f.id === id && f.type === type),
    [favourites]
  );

  const toggleFavourite = useCallback((item: Omit<FavouriteItem, "addedAt">) => {
    setFavourites((prev) => {
      const exists = prev.find((f) => f.id === item.id && f.type === item.type);
      if (exists) {
        return prev.filter((f) => !(f.id === item.id && f.type === item.type));
      }
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFavourite = useCallback((id: string, type: FavouriteItem["type"]) => {
    setFavourites((prev) => prev.filter((f) => !(f.id === id && f.type === type)));
  }, []);

  const getByType = useCallback(
    (type: FavouriteItem["type"]) => favourites.filter((f) => f.type === type),
    [favourites]
  );

  return (
    <FavouritesContext.Provider
      value={{ favourites, isFavourite, toggleFavourite, removeFavourite, getByType }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
