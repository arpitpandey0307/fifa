"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook for polling data at a regular interval.
 * Automatically pauses when the tab is not visible.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  intervalMs: number,
  enabled = true
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!enabled) return;

    fetchData();
    timerRef.current = setInterval(fetchData, intervalMs);

    const handleVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        fetchData();
        timerRef.current = setInterval(fetchData, intervalMs);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchData, intervalMs, enabled]);

  return { data, error, isLoading, refetch: fetchData };
}

/**
 * Hook for fetching dashboard data with polling.
 */
export function useDashboardData() {
  const fetcher = useCallback(async () => {
    const res = await fetch("/api/data/dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    return res.json();
  }, []);

  return usePolling(fetcher, 30000);
}

/**
 * Hook for fetching crowd data with faster polling.
 */
export function useCrowdData() {
  const fetcher = useCallback(async () => {
    const res = await fetch("/api/data/crowd");
    if (!res.ok) throw new Error("Failed to fetch crowd data");
    return res.json();
  }, []);

  return usePolling(fetcher, 15000);
}

/**
 * Hook for the AI chat interface.
 */
export function useAIChat() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string; timestamp: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string, context?: Record<string, unknown>) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      });

      const data = await res.json();

      const assistantMsg = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant" as const,
        content: data.response || data.error || "Sorry, I couldn't process that request.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: "assistant" as const,
          content: "Sorry, I'm having trouble connecting right now. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, sendMessage, clearMessages };
}

/**
 * Responsive breakpoint hook.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
