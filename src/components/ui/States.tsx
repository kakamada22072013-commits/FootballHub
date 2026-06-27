"use client";

import { cn } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-16 gap-4", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
      <p className="text-slate-400">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-16 gap-4 text-center", className)}
      role="alert"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <p className="text-slate-400 max-w-md">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {icon && <div className="text-4xl opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-slate-400 max-w-sm">{description}</p>}
    </div>
  );
}
