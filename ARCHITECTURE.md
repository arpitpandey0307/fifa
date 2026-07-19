# Architecture

## System Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Client (React 19)                        │
│  ┌──────────┐ ┌───────────┐ ┌───────┐ ┌─────────────────┐  │
│  │ Dashboard │ │Fan Assist.│ │Crowd  │ │ Incidents/Sec.  │  │
│  │  Pages    │ │  (Chat)   │ │Intel. │ │ Volunteers/etc. │  │
│  └─────┬────┘ └─────┬─────┘ └───┬───┘ └───────┬─────────┘  │
│        └─────────────┴───────────┴─────────────┘             │
│              Zustand Store + Custom Hooks                    │
│              (usePolling, useAIChat, useCrowdData)           │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTP (JSON)
┌─────────────────────────┴────────────────────────────────────┐
│                  Middleware (Edge Runtime)                    │
│         Rate Limiting · Security Headers · CSP · HSTS        │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────┐
│                Next.js API Routes (Server)                   │
│  ┌──────────────────────┐  ┌─────────────────────────────┐  │
│  │   /api/data/*         │  │       /api/ai/*              │  │
│  │   dashboard, crowd,   │  │  chat, predict, incident,   │  │
│  │   transport, sustain. │  │  summary                    │  │
│  └──────────┬───────────┘  └──────────┬──────────────────┘  │
│             │                         │                      │
│  ┌──────────▼───────────┐  ┌──────────▼──────────────────┐  │
│  │  Simulation Engine   │  │  Gemini Client              │  │
│  │  (src/data/simulator)│  │  (src/lib/gemini)           │  │
│  │  Deterministic PRNG  │  │  callGemini / callGeminiJSON│  │
│  │  Match-phase aware   │  │  Automatic fallbacks        │  │
│  └──────────────────────┘  └──────────┬──────────────────┘  │
│                                       │                      │
└───────────────────────────────────────┼──────────────────────┘
                                        │ HTTPS
                              ┌─────────▼─────────┐
                              │ Google Gemini API  │
                              │ gemini-2.0-flash   │
                              │ gemini-2.5-pro     │
                              └────────────────────┘
```

## Key Design Decisions

### 1. Simulation Engine (No External Database)
The simulator uses a **seeded PRNG** tied to `Date.now()` and match-phase logic, producing
deterministic crowd density, transport congestion, and weather data that changes realistically
over time. This eliminates external database dependencies while maintaining believable
real-time behavior for demonstration.

### 2. Intelligent AI Fallbacks
Every Gemini call has a **keyword-based heuristic fallback** so the platform never fails even
without an API key. The `callGemini()` function detects food, navigation, transport, and
emergency intents and returns pre-written, context-appropriate responses.

### 3. Edge Middleware Security
Rate limiting and security headers are applied at the **edge layer** (Next.js middleware),
ensuring every request is protected before reaching any route handler. CSP is strict
(`unsafe-eval` banned), HSTS is enabled with preload, and frame embedding is blocked.

### 4. Polling with Visibility Awareness
The `usePolling` hook **pauses** when the browser tab is hidden (`visibilitychange` API) and
resumes on return, preventing unnecessary API calls and reducing server load.

### 5. Zod Validation at API Boundary
All API routes validate input with **Zod v4 schemas** (`src/lib/schemas.ts`) before any
processing. Schema failures return 400 with structured error details. User input is
additionally sanitized with HTML entity escaping.

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `src/app/(dashboard)/` | 9 feature pages behind shared sidebar layout |
| `src/app/api/ai/` | 4 AI endpoints (chat, predict, incident, summary) |
| `src/app/api/data/` | 4 data endpoints (dashboard, crowd, transport, sustainability) |
| `src/components/` | Reusable UI components (stat-card, alert-feed, heatmap, sidebar, topbar) |
| `src/data/` | Simulation engine with deterministic PRNG and static venue data |
| `src/hooks/` | Custom React hooks (usePolling, useAIChat, useCrowdData, useMediaQuery) |
| `src/lib/` | Utilities, Gemini client, prompt templates, Zod schemas, constants |
| `src/stores/` | Zustand state management with localStorage persistence |
| `src/types/` | Comprehensive TypeScript type definitions (325 lines, 30+ types) |
| `src/__tests__/` | Vitest test suites (7 files, 99+ tests) |

## Data Flow

### Fan Assistant Chat
```
User types message (any of 7 languages)
  → Zod schema validation (chatRequestSchema)
  → XSS sanitization (sanitizeInput)
  → Context enrichment (seat, zone, nearby vendors, density)
  → Gemini 2.0 Flash with FAN_ASSISTANT_PROMPT
  → Language-matched response
  → UI renders with ARIA live region
```

### Incident Triage
```
Security reports incident in natural language
  → Zod schema validation (incidentRequestSchema)
  → Gemini 2.5 Pro with INCIDENT_TRIAGE_PROMPT (chain-of-thought)
  → STEP 1: Extract location and type
  → STEP 2: Classify severity
  → STEP 3: Map to zone code
  → STEP 4: Assess crowd level
  → STEP 5: Generate dispatch recommendation
  → Structured triage result with nearest responder and route
```

### Crowd Prediction
```
Operator requests prediction for zones
  → Current zone metrics from simulator
  → Match minute and phase context
  → Gemini 2.0 Flash with CROWD_PREDICTION_PROMPT
  → 5/10/15 min predictions with confidence scores
  → Fallback: algorithmic prediction using trend + phase logic
```
