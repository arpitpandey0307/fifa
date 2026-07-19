"use client";

// ============================================================================
// FIFA Nexus AI — Custom React Hooks
// Data fetching, polling, AI chat, and responsive media query hooks.
// ============================================================================

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic polling hook that fetches data at regular intervals.
 * Automatically **pauses polling** when the browser tab is hidden
 * (using the Page Visibility API) and resumes on return.
 *
 * @typeParam T - The type of data returned by the fetcher.
 * @param fetcher - Async function that returns the data.
 * @param intervalMs - Polling interval in milliseconds.
 * @param enabled - Whether polling is active (default: `true`).
 * @returns Object with `data`, `error`, `isLoading`, and `refetch`.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = usePolling(
 *   useCallback(async () => {
 *     const res = await fetch("/api/data/dashboard");
 *     return res.json();
 *   }, []),
 *   30000
 * );
 * ```
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
    } catch (err: unknown) {
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
 * Pre-configured polling hook for the main dashboard data endpoint.
 * Polls `/api/data/dashboard` every 30 seconds.
 *
 * @returns Polling result with `DashboardData` type.
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
 * Pre-configured polling hook for crowd density data.
 * Polls `/api/data/crowd` every 15 seconds (higher frequency for safety).
 *
 * @returns Polling result with crowd zone metrics.
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
 * AI chat hook managing conversation state and API communication.
 * Handles message history, loading states, and error recovery.
 *
 * @returns Object with `messages`, `isLoading`, `sendMessage`, and `clearMessages`.
 *
 * @example
 * ```tsx
 * const { messages, isLoading, sendMessage } = useAIChat();
 * sendMessage("Where is my gate?", { seat: "NS-A-R12-S8" });
 * ```
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
 * Responsive media query hook using `window.matchMedia`.
 * Reactively tracks whether a CSS media query matches.
 *
 * @param query - CSS media query string (e.g., `"(min-width: 768px)"`).
 * @returns `true` if the media query currently matches.
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
