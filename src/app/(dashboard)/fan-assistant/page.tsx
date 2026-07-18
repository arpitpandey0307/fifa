"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Globe,
  Sparkles,
  User,
  Bot,
} from "lucide-react";
import { useAIChat } from "@/hooks/use-data";
import { useSettingsStore } from "@/stores/settings-store";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "🚪 Find my gate", message: "Where is my gate and how do I get to my seat?" },
  { label: "🍕 I'm hungry", message: "I'm looking for food. What's nearby with a short queue?" },
  { label: "🚗 When to leave?", message: "When should I leave to avoid traffic? Best exit route?" },
  { label: "♿ Accessible routes", message: "Show me accessible routes to my seat" },
  { label: "🏥 First aid", message: "Where is the nearest medical station?" },
  { label: "🌦 Weather update", message: "What's the weather like right now?" },
];

const LANGUAGE_HINTS = [
  { lang: "Hindi", example: "मुझे खाना कहाँ मिलेगा?" },
  { lang: "Spanish", example: "¿Dónde puedo encontrar comida?" },
  { lang: "French", example: "Où est ma porte d'entrée ?" },
  { lang: "Arabic", example: "أين يمكنني العثور على الطعام؟" },
  { lang: "Japanese", example: "食べ物はどこで見つけられますか？" },
];

export default function FanAssistantPage() {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useSettingsStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    sendMessage(trimmed, {
      seat: "NS-A-R12-S8",
      gate: "Gate D",
      zone: "NS-A",
      language,
      dietary: [],
      accessibility: "none",
      transportPreference: "metro",
    });
    setInput("");
  };

  const handleQuickAction = (message: string) => {
    sendMessage(message, {
      seat: "NS-A-R12-S8",
      gate: "Gate D",
      zone: "NS-A",
      language,
      dietary: [],
      accessibility: "none",
      transportPreference: "metro",
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="gradient-blue flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              Fan AI Assistant
            </h1>
            <p className="text-xs text-text-secondary">
              Ask anything • 7 languages supported • Context-aware
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="glass-panel flex flex-1 flex-col overflow-hidden">
        {/* Messages Area */}
        <div
          className="flex-1 space-y-4 overflow-y-auto p-5"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="gradient-blue mb-4 flex h-16 w-16 items-center justify-center rounded-2xl opacity-50">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-1 text-lg font-semibold text-text-primary">
                Welcome to MetLife Stadium! ⚽
              </h2>
              <p className="mb-6 max-w-md text-sm text-text-secondary">
                I&apos;m your AI concierge. Ask me about navigation, food, transport,
                or anything else. I speak 7 languages!
              </p>

              {/* Quick Actions */}
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.message)}
                    className="glass-input rounded-full px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-blue/30 hover:text-text-primary"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Language Hints */}
              <div className="text-[11px] text-text-muted">
                <Globe className="mr-1 inline h-3 w-3" />
                Try:{" "}
                {LANGUAGE_HINTS.map((hint, i) => (
                  <button
                    key={hint.lang}
                    onClick={() => handleQuickAction(hint.example)}
                    className="text-accent-cyan hover:underline"
                  >
                    {hint.example}
                    {i < LANGUAGE_HINTS.length - 1 ? " • " : ""}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="gradient-blue flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                      <Bot className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "gradient-blue text-white"
                        : "glass-card text-text-primary"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <p className="mt-1.5 text-[10px] opacity-50">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <User className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <div className="flex gap-3">
              <div className="gradient-blue flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                <Bot className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <div className="glass-card flex items-center gap-1.5 rounded-2xl px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/[0.06] p-4">
          {messages.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.slice(0, 4).map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.message)}
                  className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-text-muted transition-colors hover:bg-white/[0.08] hover:text-text-secondary"
                  disabled={isLoading}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about food, directions, transport, or anything..."
              className="glass-input flex-1 px-4 py-3 text-sm placeholder:text-text-muted"
              disabled={isLoading}
              aria-label="Chat message input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="gradient-blue flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all disabled:opacity-30"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
