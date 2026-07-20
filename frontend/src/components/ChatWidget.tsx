"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, apiErrorMessage } from "@/lib/api";
import { ChatEntry } from "@/types";

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the StudyMatch assistant. Ask me about universities, IELTS/GPA requirements, scholarships, or how to use the app.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    function handleOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("studymatch:open-chat", handleOpenRequest);
    return () => window.removeEventListener("studymatch:open-chat", handleOpenRequest);
  }, []);

  if (!user) return null;

  async function send(text: string) {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setFollowUps([]);
    setTyping(true);
    setError("");
    try {
      const res = await api.post("/ai/chat", { sessionId, message: text });
      setMessages((m) => [...m, { role: "assistant", content: res.data.reply }]);
      setFollowUps(res.data.suggestedFollowUps || []);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setTyping(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-paper shadow-xl transition hover:bg-navy-light"
      >
        {open ? "✕" : "AI"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-card border border-navy/10 bg-white shadow-2xl">
          <div className="bg-navy px-4 py-3">
            <p className="font-display text-sm font-semibold text-paper">StudyMatch Assistant</p>
            <p className="font-mono text-[10px] text-paper/50">Context-aware · remembers this chat</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-brass text-navy"
                    : "bg-navy/5 text-ink/80"
                }`}
              >
                {m.content}
              </div>
            ))}
            {typing && (
              <div className="flex w-fit items-center gap-1 rounded-2xl bg-navy/5 px-3 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/40 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/40 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/40" />
              </div>
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          {followUps.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-navy/10 px-3 py-2">
              {followUps.map((f) => (
                <button
                  key={f}
                  onClick={() => send(f)}
                  className="rounded-full bg-teal/10 px-3 py-1 text-xs text-teal hover:bg-teal/20"
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-navy/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-navy/15 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={typing}
              className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-paper disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}