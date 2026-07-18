# FIFA Nexus AI — Folder Structure

## Complete Project Tree

```
fifa-nexus-ai/
│
├── README.md
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .gitignore
├── Makefile
│
├── docs/                                    # Design Documents (you are here)
│   ├── 01-product-vision.md
│   ├── 02-database-design.md
│   ├── 03-folder-structure.md
│   ├── 04-backend-architecture.md
│   ├── 05-frontend-architecture.md
│   ├── 06-ai-agent-design.md
│   ├── 07-deployment-architecture.md
│   └── 08-sprint-plan.md
│
├── backend/                                 # FastAPI Backend
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── .env.example
│   │
│   ├── alembic/                             # Database Migrations
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       └── 001_initial_schema.py
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                          # FastAPI app entry point
│   │   ├── config.py                        # Environment configuration
│   │   ├── dependencies.py                  # Dependency injection
│   │   │
│   │   ├── core/                            # Core infrastructure
│   │   │   ├── __init__.py
│   │   │   ├── database.py                  # SQLAlchemy engine & session
│   │   │   ├── redis.py                     # Redis client
│   │   │   ├── security.py                  # Firebase auth verification
│   │   │   ├── websocket.py                 # Socket.IO server
│   │   │   ├── exceptions.py                # Custom exceptions
│   │   │   └── middleware.py                # CORS, logging, rate limiting
│   │   │
│   │   ├── models/                          # SQLAlchemy ORM Models
│   │   │   ├── __init__.py
│   │   │   ├── base.py                      # Base model with common fields
│   │   │   ├── user.py
│   │   │   ├── ticket.py
│   │   │   ├── match.py
│   │   │   ├── stadium.py
│   │   │   ├── zone.py
│   │   │   ├── seat.py
│   │   │   ├── crowd_metric.py
│   │   │   ├── crowd_prediction.py
│   │   │   ├── transport_metric.py
│   │   │   ├── transport_prediction.py
│   │   │   ├── incident.py
│   │   │   ├── volunteer.py
│   │   │   ├── volunteer_task.py
│   │   │   ├── food_vendor.py
│   │   │   ├── vendor_metric.py
│   │   │   ├── accessibility_request.py
│   │   │   ├── energy_metric.py
│   │   │   ├── water_metric.py
│   │   │   ├── waste_metric.py
│   │   │   ├── camera.py
│   │   │   ├── camera_event.py
│   │   │   ├── ai_report.py
│   │   │   ├── alert.py
│   │   │   ├── prediction.py
│   │   │   ├── fan_preference.py
│   │   │   ├── weather_data.py
│   │   │   └── agent_log.py
│   │   │
│   │   ├── schemas/                         # Pydantic Schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── ticket.py
│   │   │   ├── match.py
│   │   │   ├── stadium.py
│   │   │   ├── crowd.py
│   │   │   ├── transport.py
│   │   │   ├── incident.py
│   │   │   ├── volunteer.py
│   │   │   ├── vendor.py
│   │   │   ├── accessibility.py
│   │   │   ├── sustainability.py
│   │   │   ├── camera.py
│   │   │   ├── ai_report.py
│   │   │   ├── alert.py
│   │   │   ├── prediction.py
│   │   │   ├── weather.py
│   │   │   ├── fan.py
│   │   │   └── websocket.py
│   │   │
│   │   ├── repositories/                    # Repository Pattern (DB access)
│   │   │   ├── __init__.py
│   │   │   ├── base.py                      # Generic CRUD repository
│   │   │   ├── user_repository.py
│   │   │   ├── ticket_repository.py
│   │   │   ├── match_repository.py
│   │   │   ├── crowd_repository.py
│   │   │   ├── transport_repository.py
│   │   │   ├── incident_repository.py
│   │   │   ├── volunteer_repository.py
│   │   │   ├── vendor_repository.py
│   │   │   ├── accessibility_repository.py
│   │   │   ├── sustainability_repository.py
│   │   │   ├── camera_repository.py
│   │   │   ├── alert_repository.py
│   │   │   ├── prediction_repository.py
│   │   │   ├── weather_repository.py
│   │   │   └── ai_report_repository.py
│   │   │
│   │   ├── services/                        # Business Logic Layer
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── crowd_service.py
│   │   │   ├── transport_service.py
│   │   │   ├── incident_service.py
│   │   │   ├── volunteer_service.py
│   │   │   ├── vendor_service.py
│   │   │   ├── accessibility_service.py
│   │   │   ├── sustainability_service.py
│   │   │   ├── security_service.py
│   │   │   ├── weather_service.py
│   │   │   ├── alert_service.py
│   │   │   ├── prediction_service.py
│   │   │   ├── fan_service.py
│   │   │   ├── report_service.py
│   │   │   └── realtime_service.py          # WebSocket event dispatcher
│   │   │
│   │   ├── api/                             # API Routes
│   │   │   ├── __init__.py
│   │   │   ├── deps.py                      # Route dependencies
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── router.py                # Main API router
│   │   │       ├── auth.py
│   │   │       ├── dashboard.py
│   │   │       ├── crowd.py
│   │   │       ├── transport.py
│   │   │       ├── incidents.py
│   │   │       ├── volunteers.py
│   │   │       ├── vendors.py
│   │   │       ├── accessibility.py
│   │   │       ├── sustainability.py
│   │   │       ├── security.py
│   │   │       ├── fan_assistant.py
│   │   │       ├── predictions.py
│   │   │       ├── reports.py
│   │   │       ├── alerts.py
│   │   │       ├── map.py
│   │   │       ├── analytics.py
│   │   │       └── settings.py
│   │   │
│   │   ├── agents/                          # LangGraph AI Agents
│   │   │   ├── __init__.py
│   │   │   ├── base_agent.py                # Base agent class
│   │   │   ├── coordinator.py               # Coordinator Agent (orchestrator)
│   │   │   ├── crowd_agent.py
│   │   │   ├── transport_agent.py
│   │   │   ├── security_agent.py
│   │   │   ├── volunteer_agent.py
│   │   │   ├── vendor_agent.py
│   │   │   ├── accessibility_agent.py
│   │   │   ├── weather_agent.py
│   │   │   ├── energy_agent.py
│   │   │   ├── emergency_agent.py
│   │   │   ├── graph.py                     # LangGraph workflow definition
│   │   │   ├── state.py                     # Shared agent state
│   │   │   ├── tools.py                     # Agent tools
│   │   │   └── prompts/                     # Prompt templates
│   │   │       ├── __init__.py
│   │   │       ├── coordinator_prompt.py
│   │   │       ├── crowd_prompt.py
│   │   │       ├── transport_prompt.py
│   │   │       ├── security_prompt.py
│   │   │       ├── volunteer_prompt.py
│   │   │       ├── vendor_prompt.py
│   │   │       ├── accessibility_prompt.py
│   │   │       ├── weather_prompt.py
│   │   │       ├── energy_prompt.py
│   │   │       ├── emergency_prompt.py
│   │   │       ├── fan_assistant_prompt.py
│   │   │       ├── briefing_prompt.py
│   │   │       └── executive_prompt.py
│   │   │
│   │   ├── integrations/                    # External API Integrations
│   │   │   ├── __init__.py
│   │   │   ├── weather_api.py               # OpenWeatherMap / Weather API
│   │   │   ├── maps_api.py                  # Google Maps / Mapbox
│   │   │   ├── traffic_api.py               # Traffic data provider
│   │   │   ├── transit_api.py               # Public transit APIs
│   │   │   └── gemini_client.py             # Gemini API wrapper
│   │   │
│   │   ├── simulation/                      # Demo Data Simulation
│   │   │   ├── __init__.py
│   │   │   ├── simulator.py                 # Main simulation engine
│   │   │   ├── crowd_simulator.py
│   │   │   ├── transport_simulator.py
│   │   │   ├── incident_simulator.py
│   │   │   ├── weather_simulator.py
│   │   │   ├── energy_simulator.py
│   │   │   ├── vendor_simulator.py
│   │   │   └── seed_data.py                 # Database seeding
│   │   │
│   │   └── utils/                           # Utilities
│   │       ├── __init__.py
│   │       ├── logger.py
│   │       ├── helpers.py
│   │       ├── constants.py
│   │       └── validators.py
│   │
│   └── tests/                               # Backend Tests
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_api/
│       ├── test_services/
│       ├── test_agents/
│       └── test_repositories/
│
├── frontend/                                # Next.js Frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── .env.example
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   ├── stadium-map.svg
│   │   └── assets/
│   │       ├── icons/
│   │       └── images/
│   │
│   ├── src/
│   │   ├── app/                             # Next.js App Router
│   │   │   ├── layout.tsx                   # Root layout
│   │   │   ├── page.tsx                     # Landing page
│   │   │   ├── globals.css                  # Global styles
│   │   │   ├── providers.tsx                # Context providers
│   │   │   │
│   │   │   ├── (auth)/                      # Auth group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   └── (dashboard)/                 # Dashboard group (protected)
│   │   │       ├── layout.tsx               # Dashboard shell (sidebar + topbar)
│   │   │       ├── command-center/
│   │   │       │   └── page.tsx
│   │   │       ├── map/
│   │   │       │   └── page.tsx
│   │   │       ├── analytics/
│   │   │       │   └── page.tsx
│   │   │       ├── crowd/
│   │   │       │   └── page.tsx
│   │   │       ├── transport/
│   │   │       │   └── page.tsx
│   │   │       ├── security/
│   │   │       │   └── page.tsx
│   │   │       ├── volunteers/
│   │   │       │   └── page.tsx
│   │   │       ├── fan-assistant/
│   │   │       │   └── page.tsx
│   │   │       ├── accessibility/
│   │   │       │   └── page.tsx
│   │   │       ├── sustainability/
│   │   │       │   └── page.tsx
│   │   │       ├── incidents/
│   │   │       │   └── page.tsx
│   │   │       ├── reports/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/                      # Shared Components
│   │   │   ├── ui/                          # shadcn/ui primitives
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   └── sheet.tsx
│   │   │   │
│   │   │   ├── layout/                      # Layout components
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── topbar.tsx
│   │   │   │   ├── mobile-nav.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   └── page-header.tsx
│   │   │   │
│   │   │   ├── dashboard/                   # Dashboard-specific components
│   │   │   │   ├── stat-card.tsx
│   │   │   │   ├── alert-feed.tsx
│   │   │   │   ├── ai-summary-card.tsx
│   │   │   │   ├── heatmap-widget.tsx
│   │   │   │   ├── weather-widget.tsx
│   │   │   │   ├── traffic-widget.tsx
│   │   │   │   ├── parking-widget.tsx
│   │   │   │   ├── vendor-status-widget.tsx
│   │   │   │   ├── energy-gauge.tsx
│   │   │   │   └── water-gauge.tsx
│   │   │   │
│   │   │   ├── crowd/                       # Crowd module components
│   │   │   │   ├── prediction-chart.tsx
│   │   │   │   ├── zone-density-card.tsx
│   │   │   │   ├── risk-indicator.tsx
│   │   │   │   └── action-suggestions.tsx
│   │   │   │
│   │   │   ├── map/                         # Map components
│   │   │   │   ├── stadium-map.tsx
│   │   │   │   ├── heatmap-layer.tsx
│   │   │   │   ├── zone-overlay.tsx
│   │   │   │   ├── poi-markers.tsx
│   │   │   │   ├── route-layer.tsx
│   │   │   │   └── map-controls.tsx
│   │   │   │
│   │   │   ├── security/                    # Security module components
│   │   │   │   ├── camera-feed-card.tsx
│   │   │   │   ├── event-timeline.tsx
│   │   │   │   ├── threat-assessment.tsx
│   │   │   │   └── recommendation-panel.tsx
│   │   │   │
│   │   │   ├── volunteer/                   # Volunteer module components
│   │   │   │   ├── task-card.tsx
│   │   │   │   ├── task-list.tsx
│   │   │   │   ├── volunteer-map.tsx
│   │   │   │   └── shift-timeline.tsx
│   │   │   │
│   │   │   ├── fan/                         # Fan assistant components
│   │   │   │   ├── chat-interface.tsx
│   │   │   │   ├── message-bubble.tsx
│   │   │   │   ├── quick-actions.tsx
│   │   │   │   └── recommendation-card.tsx
│   │   │   │
│   │   │   ├── transport/                   # Transport module components
│   │   │   │   ├── route-comparison.tsx
│   │   │   │   ├── transport-status.tsx
│   │   │   │   ├── parking-map.tsx
│   │   │   │   └── congestion-forecast.tsx
│   │   │   │
│   │   │   ├── accessibility/               # Accessibility components
│   │   │   │   ├── accessible-route.tsx
│   │   │   │   ├── restroom-finder.tsx
│   │   │   │   ├── voice-navigator.tsx
│   │   │   │   └── exit-finder.tsx
│   │   │   │
│   │   │   ├── sustainability/              # Sustainability components
│   │   │   │   ├── energy-chart.tsx
│   │   │   │   ├── water-chart.tsx
│   │   │   │   ├── waste-tracker.tsx
│   │   │   │   ├── carbon-meter.tsx
│   │   │   │   └── optimization-panel.tsx
│   │   │   │
│   │   │   ├── incidents/                   # Incident components
│   │   │   │   ├── incident-form.tsx
│   │   │   │   ├── incident-card.tsx
│   │   │   │   ├── incident-timeline.tsx
│   │   │   │   └── dispatch-panel.tsx
│   │   │   │
│   │   │   ├── reports/                     # Report components
│   │   │   │   ├── briefing-card.tsx
│   │   │   │   ├── executive-summary.tsx
│   │   │   │   ├── report-viewer.tsx
│   │   │   │   └── kpi-grid.tsx
│   │   │   │
│   │   │   ├── analytics/                   # Analytics components
│   │   │   │   ├── trend-chart.tsx
│   │   │   │   ├── comparison-chart.tsx
│   │   │   │   ├── accuracy-tracker.tsx
│   │   │   │   └── metric-grid.tsx
│   │   │   │
│   │   │   └── shared/                      # Cross-cutting components
│   │   │       ├── error-boundary.tsx
│   │   │       ├── loading-skeleton.tsx
│   │   │       ├── notification-bell.tsx
│   │   │       ├── role-guard.tsx
│   │   │       ├── language-selector.tsx
│   │   │       ├── real-time-indicator.tsx
│   │   │       └── empty-state.tsx
│   │   │
│   │   ├── hooks/                           # Custom React Hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-socket.ts
│   │   │   ├── use-realtime.ts
│   │   │   ├── use-crowd-data.ts
│   │   │   ├── use-transport-data.ts
│   │   │   ├── use-alerts.ts
│   │   │   ├── use-predictions.ts
│   │   │   ├── use-media-query.ts
│   │   │   ├── use-debounce.ts
│   │   │   └── use-intersection-observer.ts
│   │   │
│   │   ├── lib/                             # Utilities & Configuration
│   │   │   ├── api-client.ts                # Axios/fetch wrapper
│   │   │   ├── socket-client.ts             # Socket.IO client
│   │   │   ├── firebase.ts                  # Firebase config
│   │   │   ├── utils.ts                     # General utilities
│   │   │   ├── constants.ts                 # App constants
│   │   │   ├── cn.ts                        # className helper
│   │   │   └── format.ts                    # Date/number formatters
│   │   │
│   │   ├── stores/                          # Zustand Stores
│   │   │   ├── auth-store.ts
│   │   │   ├── dashboard-store.ts
│   │   │   ├── crowd-store.ts
│   │   │   ├── alert-store.ts
│   │   │   ├── map-store.ts
│   │   │   ├── notification-store.ts
│   │   │   └── settings-store.ts
│   │   │
│   │   ├── types/                           # TypeScript Types
│   │   │   ├── index.ts
│   │   │   ├── api.ts
│   │   │   ├── user.ts
│   │   │   ├── crowd.ts
│   │   │   ├── transport.ts
│   │   │   ├── incident.ts
│   │   │   ├── volunteer.ts
│   │   │   ├── vendor.ts
│   │   │   ├── sustainability.ts
│   │   │   ├── security.ts
│   │   │   ├── map.ts
│   │   │   ├── alert.ts
│   │   │   ├── prediction.ts
│   │   │   └── websocket.ts
│   │   │
│   │   └── styles/                          # Additional Styles
│   │       ├── animations.css
│   │       ├── glassmorphism.css
│   │       └── map.css
│   │
│   └── tests/                               # Frontend Tests
│       ├── setup.ts
│       ├── components/
│       └── hooks/
│
├── infrastructure/                          # DevOps & Deployment
│   ├── docker/
│   │   ├── backend.Dockerfile
│   │   ├── frontend.Dockerfile
│   │   └── nginx.conf
│   ├── gcp/
│   │   ├── cloudbuild.yaml
│   │   ├── cloud-run-backend.yaml
│   │   └── cloud-run-frontend.yaml
│   └── scripts/
│       ├── setup.sh
│       ├── seed-db.sh
│       └── deploy.sh
│
└── shared/                                  # Shared Constants & Types
    ├── constants.ts
    └── types.ts
```

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **App Router** | Next.js 16 route groups for clean URL structure and layouts |
| **Route Groups** | `(auth)` and `(dashboard)` for layout separation |
| **Repository Pattern** | Decouples DB access from business logic |
| **Agents Folder** | Isolated LangGraph agents with dedicated prompts |
| **Simulation** | Demo data generators for hackathon presentation |
| **Shared Types** | Single source of truth for frontend/backend type contracts |
| **Component Grouping** | By feature module, not by component type |
