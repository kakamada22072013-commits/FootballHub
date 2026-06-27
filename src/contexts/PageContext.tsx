"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname, useParams } from "next/navigation";
import type { PageContext } from "@/types/ai-actions";

const PageContext = createContext<PageContext | null>(null);

export function PageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const [context, setContext] = useState<PageContext>({ page: pathname });

  useEffect(() => {
    const newContext: PageContext = { page: pathname };

    // Extract context based on route
    if (pathname.startsWith("/teams/")) {
      newContext.teamId = params.id as string;
      // Team name would need to be fetched from API or stored in state
    } else if (pathname.startsWith("/players/")) {
      newContext.playerId = params.id as string;
    } else if (pathname.startsWith("/leagues/")) {
      newContext.leagueId = params.id as string;
    } else if (pathname.startsWith("/countries/")) {
      newContext.country = params.id as string;
    }

    setContext(newContext);
  }, [pathname, params]);

  return (
    <PageContext.Provider value={context}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePageContext must be used within PageProvider");
  return ctx;
}
