"use client";

import { SettingsProvider } from "@/contexts/SettingsContext";
import { FavouritesProvider } from "@/contexts/FavouritesContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { PageProvider } from "@/contexts/PageContext";
import { AIActionProvider } from "@/contexts/AIActionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
        <AuthProvider>
          <FavouritesProvider>
            <RecentlyViewedProvider>
              <PageProvider>
                <AIActionProvider>
                  <ToastProvider>{children}</ToastProvider>
                </AIActionProvider>
              </PageProvider>
            </RecentlyViewedProvider>
          </FavouritesProvider>
        </AuthProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}
