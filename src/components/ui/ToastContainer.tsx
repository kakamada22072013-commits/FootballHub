"use client";

import { useToast } from "@/contexts/ToastContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-neon-green/30 bg-neon-green/10",
  error: "border-red-400/30 bg-red-400/10",
  info: "border-neon-blue/30 bg-neon-blue/10",
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      className="fixed bottom-24 right-4 z-[100] flex flex-col gap-2 max-w-sm"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "glass flex items-center gap-3 px-4 py-3 rounded-xl border animate-in slide-in-from-right",
              colors[toast.type]
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
