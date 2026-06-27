"use client";

import { useToast } from "@/contexts/ToastContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { Heart, Share2, Link2 } from "lucide-react";
import { cn, copyToClipboard, shareUrl } from "@/lib/utils";
import type { FavouriteItem } from "@/types/sportsdb";

interface FavouriteButtonProps {
  id: string;
  type: FavouriteItem["type"];
  name: string;
  image?: string;
  subtitle?: string;
  className?: string;
}

export function FavouriteButton({
  id,
  type,
  name,
  image,
  subtitle,
  className,
}: FavouriteButtonProps) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const { showToast } = useToast();
  const active = isFavourite(id, type);

  const handleClick = () => {
    toggleFavourite({ id, type, name, image, subtitle });
    showToast(
      active ? `Removed ${name} from favourites` : `Added ${name} to favourites`,
      "success"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "btn-secondary p-2.5",
        active && "border-red-400/50 text-red-400",
        className
      )}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={active}
    >
      <Heart className={cn("w-5 h-5", active && "fill-current")} />
    </button>
  );
}

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButton({ url, title, className }: ShareButtonProps) {
  const { showToast } = useToast();

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      shareUrl(url, title);
    } else {
      try {
        await copyToClipboard(url);
        showToast("Link copied to clipboard!", "success");
      } catch {
        showToast("Could not copy link", "error");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn("btn-secondary p-2.5", className)}
      aria-label="Share"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}

export function CopyLinkButton({ url, className }: { url: string; className?: string }) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await copyToClipboard(url);
      showToast("Link copied!", "success");
    } catch {
      showToast("Could not copy link", "error");
    }
  };

  return (
    <button onClick={handleCopy} className={cn("btn-secondary", className)}>
      <Link2 className="w-4 h-4" />
      Copy Link
    </button>
  );
}
