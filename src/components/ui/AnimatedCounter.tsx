"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = "", duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.animationsEnabled) {
      setCount(value);
      return;
    }

    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration, settings.animationsEnabled]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
