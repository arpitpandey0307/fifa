# FIFA Nexus AI — Smart Stadium Operations Platform

> **GenAI-enabled solution for FIFA World Cup 2026 Smart Stadium Operations**
> Built with Next.js 16, Google Gemini AI, and deployable on Google Cloud Run.

---

## 🌟 Challenge Vertical

**[Challenge 4] Smart Stadiums & Tournament Operations**

Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, or venue staff. The solution leverages Generative AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, and real-time decision support during the FIFA World Cup 2026.

## 🎯 Solution Overview

FIFA Nexus AI is a comprehensive AI-powered stadium operations platform that leverages **Google Gemini AI** to provide real-time decision support across all personas:

| Persona | Feature | AI Capability |
|---------|---------|---------------|
| **Fans** | Multilingual AI Assistant | Context-aware concierge in 7 languages, food/seat/exit guidance |
| **Organizers** | AI Command Center | Real-time situation summary with priority actions |
| **Security** | Security Copilot | AI-augmented anomaly detection and threat assessment |
| **Volunteers** | Volunteer Copilot | Dynamic AI task prioritization and routing |
| **Medical** | Incident Commander | NLP-based incident triage with auto-dispatch |
| **Transport** | Transport Intelligence | Multi-modal congestion monitoring and AI routing |
| **Sustainability** | Green Dashboard | Environmental monitoring with AI optimization |

---

## 🧠 Approach & Logic

### Design Philosophy

1. **Context-Aware AI**: Every AI interaction receives rich context (user seat, zone density, vendor queues, match minute) enabling highly specific and actionable responses.
2. **Intelligent Fallbacks**: All AI features gracefully degrade with keyword-based heuristic responses when Gemini is unavailable — the platform never breaks.
3. **Real-Time Simulation**: A physics-inspired simulation engine generates realistic match-day patterns (pre-match arrival, halftime rush, post-match exit) for demonstration.
4. **Security-First**: All user inputs pass through Zod validation schemas and XSS sanitization before reaching any AI model.

### How It Works

```
User Input → Zod Validation → XSS Sanitization → Context Enrichment
     ↓
Gemini AI (with system prompt + stadium context)
     ↓
Structured Response → UI Rendering (with ARIA accessibility)
```

1. **Fan sends a message** (e.g., "I'm hungry" in Hindi) →
2. **Schema validation** strips excess, validates length →
3. **Context builder** attaches user's seat, nearby vendors, zone density →
4. **Gemini 2.0 Flash** generates personalized, language-matched response →
5. **UI renders** with proper ARIA live regions and keyboard navigation

### Assumptions

- MetLife Stadium (New Jersey) is used as the reference venue with realistic zone codes
- Match simulation cycles automatically for demo purposes (1 real min ≈ 2 simulated min)
- The platform operates as a control center dashboard (not a mobile fan app)
- API key is optional — all features work with intelligent fallbacks

---

## 🔌 Google Gemini AI Integration

This project uses **Google Gemini AI** (`@google/genai`) as the core generative AI engine:

| AI Feature | Gemini Model | Purpose |
|-----------|-------------|---------|
| Dashboard Summary | `gemini-2.0-flash` | Real-time situation analysis and priority actions |
| Fan Assistant Chat | `gemini-2.0-flash` | Multilingual, context-aware fan concierge |
| Crowd Prediction | `gemini-2.0-flash` | Density forecasting with confidence scoring |
| Incident Triage | `gemini-2.5-pro` | Natural language incident classification and dispatch |

### API Key Setup

```bash
# Get your Gemini API key from Google AI Studio:
# https://aistudio.google.com/apikey

# Create .env.local in the project root:
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

> **Note:** The app works without an API key using intelligent fallback responses, but AI features require a valid `GEMINI_API_KEY`.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------  |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **AI Engine** | Google Gemini AI (`@google/genai`) |
| **Styling** | TailwindCSS v4, Glassmorphism design system |
| **State** | Zustand (persisted), custom polling hooks |
| **Animation** | Framer Motion |
| **Validation** | Zod v4 (input sanitization on all API routes) |
| **Deployment** | Docker, Google Cloud Run, App Engine |
| **Testing** | Vitest, React Testing Library |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Dashboard pages (9 feature pages)
│   │   ├── command-center/   # AI Command Center
│   │   ├── fan-assistant/    # Multilingual AI Chat
│   │   ├── crowd/            # Crowd Intelligence
│   │   ├── incidents/        # Incident Commander
│   │   ├── security/         # Security Copilot
│   │   ├── volunteers/       # Volunteer Copilot
│   │   ├── sustainability/   # Sustainability Dashboard
│   │   ├── transport/        # Transport Intelligence
│   │   └── settings/         # User Preferences & Accessibility
│   ├── api/
│   │   ├── ai/               # Gemini AI endpoints (chat, predict, incident, summary)
│   │   ├── data/             # Data endpoints (dashboard, crowd, transport, sustainability)
│   │   └── health/           # Health check for Cloud Run
│   └── page.tsx              # Landing page
├── components/               # Reusable UI components
├── data/                     # Simulation engine & static data
├── hooks/                    # Custom React hooks (polling, chat, media queries)
├── lib/                      # Utilities, Gemini client, prompts, schemas, constants
├── stores/                   # Zustand state stores
├── types/                    # TypeScript type definitions
└── __tests__/                # Vitest unit & integration tests
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/arpitpandey0307/fifa.git
cd fifa

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the platform.

### Running Tests

```bash
npm test              # Run all tests
npm run test:coverage # Run tests with coverage report
```

---

## ☁️ Google Cloud Deployment

### Deploy to Cloud Run (Recommended)

```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy directly from source
gcloud run deploy fifa-nexus-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here \
  --port 8080
```

### Deploy with Docker

```bash
# Build the Docker image
docker build -t fifa-nexus-ai .

# Run locally
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key fifa-nexus-ai
```

### Deploy to App Engine

```bash
gcloud app deploy app.yaml
```

---

## 🔒 Security

- **Input Validation**: All API endpoints use Zod v4 schemas for strict input validation and type-safe parsing
- **XSS Prevention**: User input is sanitized via `sanitizeInput()` — HTML entities escaped, length-capped at 2000 chars
- **Rate Limiting**: In-memory sliding window rate limiter (60 req/min per IP) with automatic stale-entry cleanup
- **Security Headers**: CSP (no `unsafe-eval`), HSTS with preload, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **No Secrets in Code**: API keys managed exclusively via environment variables
- **Non-root Docker**: Production container runs as unprivileged `nextjs` user (UID 1001)
- **Frame Protection**: `frame-ancestors 'none'` in CSP + `X-Frame-Options: DENY`

---

## ♿ Accessibility

- WCAG 2.1 AA compliant across all pages
- Full keyboard navigation with visible focus indicators (`:focus-visible`)
- ARIA labels and roles on all interactive elements (`role="navigation"`, `role="log"`, `role="switch"`, `aria-expanded`, `aria-pressed`, `aria-selected`)
- Screen reader optimized with `aria-live="polite"` for chat messages and alerts
- Skip navigation link (`#main-content`) for keyboard users
- High contrast mode toggle in settings
- Reduced motion mode respecting `prefers-reduced-motion` system preference
- 7-language support: English, Hindi (हिन्दी), Spanish (Español), French (Français), Arabic (العربية), Japanese (日本語), German (Deutsch)

---

## 📊 Evaluation Criteria Alignment

| Criterion | Implementation |
|-----------|---------------|
| **Code Quality** | TypeScript strict mode, modular architecture, JSDoc on all exports, zero unused imports, clean separation of concerns. See [ARCHITECTURE.md](ARCHITECTURE.md) and [CONTRIBUTING.md](CONTRIBUTING.md) |
| **Security** | Zod validation, XSS sanitization, rate limiting, HSTS, CSP without unsafe-eval, env-based secrets, non-root Docker. See [SECURITY.md](SECURITY.md) |
| **Efficiency** | Standalone Next.js output, tab-visibility polling pause, memoized callbacks, lazy loading, seeded deterministic simulation |
| **Testing** | Vitest with 9 test suites, 120+ tests covering utils, schemas, simulator, API routes, Gemini client, constants/prompts, settings store, accessibility, and middleware |
| **Accessibility** | WCAG 2.1 AA, ARIA roles/labels, keyboard nav, high contrast, reduced motion, skip-nav, 7 languages. See accessibility tests |
| **Google Services** | Gemini 2.0 Flash + 2.5 Pro via `@google/genai`, Cloud Run + App Engine deployment, Dockerfile with health checks |
| **Problem Alignment** | All 7 personas (fan, volunteer, security, organizer, medical, transport, vendor) with GenAI-powered features. See [SOLUTION.md](SOLUTION.md) for detailed feature-to-challenge mapping |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SOLUTION.md](SOLUTION.md) | Detailed problem-solution mapping with all 7 personas and AI features |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture, data flow diagrams, and design decisions |
| [SECURITY.md](SECURITY.md) | Security policy, vulnerability reporting, and protection measures |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development setup, code standards, and commit conventions |

---

## 📄 License

Built for the FIFA World Cup 2026 PromptWars Hackathon. © 2026 FIFA Nexus AI Team.

