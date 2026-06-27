"use client";

import { useState, useMemo } from "react";
import { Eye, Monitor, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SportSRCStream } from "@/lib/api/sportsrc";

interface Props {
  streams: SportSRCStream[];
  matchTitle: string;
}

function groupStreams(streams: SportSRCStream[]) {
  const groups: Record<string, SportSRCStream[]> = {};
  for (const s of streams) {
    const key = s.language || "Unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  return groups;
}

export function StreamPlayer({ streams, matchTitle }: Props) {
  const [selected, setSelected] = useState<SportSRCStream | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const groups = useMemo(() => groupStreams(streams), [streams]);

  return (
    <div className="space-y-4">
      {selected ? (
        <div className="glass-card overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={selected.embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              title={`${matchTitle} - Stream ${selected.streamNo}`}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-presentation"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center justify-between p-3 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Monitor className="w-3.5 h-3.5" />
              <span>
                {selected.language || "No language"} · Stream #{selected.streamNo}
              </span>
              {selected.hd && (
                <span className="text-neon-green text-[10px] font-bold border border-neon-green/40 px-1 rounded">
                  HD
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {selected.viewers?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={selected.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neon-blue hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> Open in tab
              </a>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-neon-green hover:underline"
              >
                Change stream
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card flex items-center justify-center aspect-video">
          <p className="text-slate-500 text-sm">Select a stream below to start watching</p>
        </div>
      )}

      <div className="glass-card p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full text-sm font-semibold mb-2"
        >
          <span>
            Available Streams{" "}
            <span className="text-slate-500 font-normal">({streams.length})</span>
          </span>
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsed && (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {Object.entries(groups).map(([language, groupStreams]) => (
              <div key={language}>
                {language !== "Unknown" && (
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wider">
                    {language}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {groupStreams.map((s) => (
                    <button
                      key={s.streamNo}
                      onClick={() => setSelected(s)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all",
                        selected?.streamNo === s.streamNo
                          ? "bg-neon-green/20 border border-neon-green/40"
                          : "bg-slate-800/50 border border-transparent hover:bg-slate-700/50"
                      )}
                    >
                      <Monitor className="w-4 h-4 shrink-0 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate">
                          Stream #{s.streamNo}
                          {s.source && (
                            <span className="text-slate-500 font-light ml-1">· {s.source}</span>
                          )}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-slate-500">
                          {s.hd && (
                            <span className="text-neon-green text-[10px] font-bold border border-neon-green/40 px-1 rounded leading-tight">
                              HD
                            </span>
                          )}
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-3 h-3" /> {s.viewers?.toLocaleString() || 0}
                          </span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
