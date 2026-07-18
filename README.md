# FIFA Nexus AI — Smart Stadium Operations Platform

> **GenAI-enabled solution for FIFA World Cup 2026 Smart Stadium Operations**  
> Built with Next.js 16, Google Gemini AI, and deployable on Google Cloud Run.

---

## 🌟 Problem Statement

Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, and venue staff during the FIFA World Cup 2026.

## 🎯 Solution Overview

FIFA Nexus AI is a comprehensive AI-powered stadium operations platform that leverages **Google Gemini AI** to provide:

- **Real-time Crowd Intelligence** — AI density prediction with 5/10/15 min forecasting
- **Multilingual Fan Assistant** — Context-aware AI concierge supporting 7 languages
- **Incident Commander** — Natural language incident triage with AI dispatch
- **Security Copilot** — AI-augmented surveillance with anomaly detection
- **Volunteer Copilot** — Dynamic AI task assignment and coordination
- **Transport Intelligence** — Multi-modal transport monitoring and AI routing
- **Sustainability Dashboard** — Environmental monitoring with AI optimization
- **Accessibility** — Full WCAG compliance, reduced motion, high contrast, screen reader support

---

## 🧠 Google Gemini AI Integration

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
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **AI Engine** | Google Gemini AI (`@google/genai`) |
| **Styling** | TailwindCSS v4, Glassmorphism design system |
| **State** | Zustand (persisted), custom polling hooks |
| **Animation** | Framer Motion |
| **Validation** | Zod v4 (input sanitization on all API routes) |
| **Deployment** | Docker, Google Cloud Run |
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
│   │   └── settings/         # User Preferences
│   ├── api/
│   │   ├── ai/               # Gemini AI endpoints (chat, predict, incident, summary)
│   │   ├── data/             # Data endpoints (dashboard, crowd, transport, sustainability)
│   │   └── health/           # Health check
│   └── page.tsx              # Landing page
├── components/               # Reusable UI components
├── data/                     # Simulation engine & static data
├── hooks/                    # Custom React hooks (polling, chat, media queries)
├── lib/                      # Utilities, Gemini client, prompts, schemas, constants
├── stores/                   # Zustand state stores
└── types/                    # TypeScript type definitions
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

---

## 🔒 Security

- **Input Validation**: All API endpoints use Zod schemas for strict input validation
- **XSS Prevention**: User input is sanitized via `sanitizeInput()` utility
- **Rate Limiting**: API routes include rate limiting middleware
- **Security Headers**: CSP, X-Frame-Options, and other security headers configured
- **No Secrets in Code**: API keys managed via environment variables only
- **Non-root Docker**: Production container runs as unprivileged `nextjs` user

---

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation
- ARIA labels and roles on all interactive elements
- Screen reader optimized with `role="log"`, `role="alert"`, `aria-live`
- High contrast mode toggle
- Reduced motion mode for vestibular sensitivity
- 7-language support (English, Hindi, Spanish, French, Arabic, Japanese, German)
- Skip navigation link for keyboard users

---

## 📊 Evaluation Criteria Alignment

| Criterion | Implementation |
|-----------|---------------|
| **Code Quality** | TypeScript strict mode, modular architecture, JSDoc comments, clean separation of concerns |
| **Security** | Zod validation, XSS sanitization, rate limiting, security headers, env-based secrets |
| **Efficiency** | Standalone Next.js output, tab-visibility polling, memoized callbacks, lazy loading |
| **Testing** | Vitest + React Testing Library, unit tests for utilities and API routes |
| **Accessibility** | WCAG 2.1 AA, ARIA, keyboard nav, high contrast, reduced motion, 7 languages |
| **Google Services** | Gemini 2.0 Flash + 2.5 Pro, Cloud Run deployment, Docker containerization |
| **Problem Alignment** | Covers all personas (fans, volunteers, security, organizers) with GenAI features |

---

## 📄 License

Built for the FIFA World Cup 2026 Hackathon. © 2026 FIFA Nexus AI Team.
