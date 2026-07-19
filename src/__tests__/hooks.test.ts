// ============================================================================
// FIFA Nexus AI — Custom Hooks Tests
// Validates polling, AI chat state management, and media query hooks.
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePolling, useDashboardData, useCrowdData, useMediaQuery, useAIChat } from "@/hooks/use-data";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("usePolling Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches data initially and sets state", async () => {
    const mockData = { test: "data" };
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => usePolling(fetcher, 1000));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await Promise.resolve(); // flush microtasks
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("polls data at specified intervals", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    
    renderHook(() => usePolling(fetcher, 5000));

    await act(async () => {
      await Promise.resolve();
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });
    expect(fetcher).toHaveBeenCalledTimes(4);
  });

  it("handles fetch errors gracefully", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => usePolling(fetcher, 1000));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network Error");
    expect(result.current.isLoading).toBe(false);
  });

  it("does not poll when disabled", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });

    renderHook(() => usePolling(fetcher, 1000, false));

    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(5000);
    });

    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("useDashboardData & useCrowdData", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("useDashboardData calls correct endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ match: { status: "live" } }),
    });

    const { result } = renderHook(() => useDashboardData());

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/data/dashboard");
    expect(result.current.data).toEqual({ match: { status: "live" } });
  });

  it("useCrowdData calls correct endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ zones: [] }),
    });

    const { result } = renderHook(() => useCrowdData());

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/data/crowd");
    expect(result.current.data).toEqual({ zones: [] });
  });

  it("handles API errors (res.ok = false)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useDashboardData());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe("Failed to fetch dashboard data");
  });
});

describe("useMediaQuery", () => {
  let matchMediaMock: any;

  beforeEach(() => {
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(matchMediaMock);
  });

  it("returns initial match state", () => {
    matchMediaMock.matches = true;
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("adds and removes event listener", () => {
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    
    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    
    unmount();
    
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});

describe("useAIChat", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("initializes with empty messages", () => {
    const { result } = renderHook(() => useAIChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("sends message and receives response", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ response: "Hello, I can help!" }),
    });

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage("Hi there");
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/ai/chat", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ message: "Hi there" }),
    }));

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe("user");
    expect(result.current.messages[0].content).toBe("Hi there");
    
    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[1].content).toBe("Hello, I can help!");
    expect(result.current.isLoading).toBe(false);
  });

  it("handles network errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failed"));

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage("Hi");
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.messages[1].content).toContain("trouble connecting");
  });

  it("clears messages", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ response: "Hello" }),
    });

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage("Hi");
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toHaveLength(0);
  });
});
