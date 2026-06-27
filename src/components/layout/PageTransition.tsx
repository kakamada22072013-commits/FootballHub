"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  if (!settings.animationsEnabled) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
