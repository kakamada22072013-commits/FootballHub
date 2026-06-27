"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageContext } from "@/contexts/PageContext";
import { useAIActions } from "@/contexts/AIActionContext";
import { useI18n } from "@/contexts/I18nContext";
import type { Message, AIResponse, ContentPart } from "@/types/ai-actions";

const SUGGESTIONS_EN = [
  "Open Real Madrid",
  "Show today's matches",
  "Enable dark mode",
  "Search for Haaland",
  "Add to favourites",
  "Open Champions League",
  "Show standings",
  "Help",
];

const SUGGESTIONS_FR = [
  "Ouvrir Real Madrid",
  "Afficher les matchs d'aujourd'hui",
  "Activer le mode sombre",
  "Rechercher Haaland",
  "Ajouter aux favoris",
  "Ouvrir la Ligue des Champions",
  "Afficher le classement",
  "Aide",
];

const SUGGESTIONS_AR = [
  "افتح ريال مدريد",
  "عرض مباريات اليوم",
  "تفعيل الوضع الداكن",
  "ابحث عن هالاند",
  "أضف إلى المفضلة",
  "افتح دوري أبطال أوروبا",
  "عرض الترتيب",
  "مساعدة",
];

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function renderContent(content: string | ContentPart[]): string {
  if (typeof content === "string") return formatMarkdown(content);
  return content
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => formatMarkdown(p.text))
    .join(" ");
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t.ai.welcome,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pageContext = usePageContext();
  const { executeActions } = useAIActions();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-ai-chat", handler);
    return () => window.removeEventListener("open-ai-chat", handler);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const getSuggestions = () => {
    switch (locale) {
      case "fr": return SUGGESTIONS_FR;
      case "ar": return SUGGESTIONS_AR;
      default: return SUGGESTIONS_EN;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageData(dataUrl);
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const buildContent = (text: string): string | ContentPart[] => {
    if (!imageData) return text;
    const parts: ContentPart[] = [{ type: "text", text }];
    if (imageData) parts.push({ type: "image_url", image_url: { url: imageData } });
    return parts;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() && !imageData) return;

    const finalText = text.trim() || "What's in this image?";
    const content = buildContent(finalText);
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const updatedMessages = [...messagesRef.current, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setImageData(null);
    setImagePreview(null);
    setTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          pageContext,
          language: locale,
        }),
      });

      const response: AIResponse = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: response.text },
      ]);

      if (response.actions && response.actions.length > 0) {
        await executeActions(response.actions);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: t.ai.error },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: t.ai.chatCleared,
      },
    ]);
    setImageData(null);
    setImagePreview(null);
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-neon-green to-neon-blue text-slate-900 shadow-neon flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-7 h-7" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className={cn(
                "w-full max-w-md glass rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-neon-green/20",
                minimized ? "h-16" : "h-[80vh] sm:h-[600px]"
              )}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-neon-green/10 to-neon-blue/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-green" />
                  <div>
                    <h3 className="font-bold">{t.ai.title}</h3>
                    <p className="text-xs text-slate-400">{t.ai.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!minimized && (
                    <button
                      onClick={clearChat}
                      className="p-2 hover:bg-white/10 rounded-lg text-xs"
                      title="Clear chat"
                    >
                      {t.ai.clear}
                    </button>
                  )}
                  <button
                    onClick={() => setMinimized(!minimized)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                    aria-label={minimized ? "Expand" : "Minimize"}
                  >
                    {minimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {!minimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green/20"
                              : "glass"
                          )}
                        >
                          {typeof msg.content === "string" ? (
                            <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                          ) : (
                            <div className="space-y-2">
                              {msg.content.map((part, i) => {
                                if (part.type === "text") {
                                  return <span key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(part.text) }} />;
                                }
                                if (part.type === "image_url") {
                                  return (
                                    <img
                                      key={i}
                                      src={part.image_url.url}
                                      alt="Uploaded"
                                      className="max-w-full rounded-lg max-h-48 object-cover"
                                    />
                                  );
                                }
                                return null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div className="flex gap-1 px-4 py-3 glass rounded-2xl w-fit">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full bg-neon-green animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {imagePreview && (
                    <div className="px-4 pb-2">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-20 rounded-lg border border-neon-green/30"
                        />
                        <button
                          onClick={() => { setImageData(null); setImagePreview(null); }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  )}

                  {messages.length <= 1 && !imagePreview && (
                    <div className="px-4 pb-2 flex flex-wrap gap-2">
                      {getSuggestions().map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="text-xs px-3 py-1.5 rounded-full glass hover:border-neon-green/30 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage(input);
                    }}
                    className="p-4 border-t border-white/10 flex gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 hover:border-neon-green/40 transition-colors"
                      title="Attach image"
                    >
                      <ImagePlus className="w-5 h-5" />
                    </button>
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.ai.placeholder}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 outline-none focus:border-neon-green/40 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={(!input.trim() && !imageData) || typing}
                      className="btn-primary p-2.5 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
