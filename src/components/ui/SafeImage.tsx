"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Shield, Trophy, ImageIcon } from "lucide-react";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  type?: "team" | "player" | "league" | "generic";
  priority?: boolean;
}

const placeholders = {
  team: Shield,
  player: User,
  league: Trophy,
  generic: ImageIcon,
};

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  type = "generic",
  priority,
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const Placeholder = placeholders[type];
  const validSrc = src && !error && src.startsWith("http") ? src : null;

  if (!validSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-800/80 text-slate-500",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={!fill ? { width, height } : undefined}
        role="img"
        aria-label={alt}
      >
        <Placeholder className="w-1/3 h-1/3 opacity-50" />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={validSrc}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        onError={() => setError(true)}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  return (
    <Image
      src={validSrc}
      alt={alt}
      width={width ?? 64}
      height={height ?? 64}
      className={className}
      onError={() => setError(true)}
      priority={priority}
    />
  );
}
