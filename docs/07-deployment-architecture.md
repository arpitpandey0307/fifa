# FIFA Nexus AI — Deployment Architecture

---

## Cloud Architecture

```mermaid
graph TB
    subgraph "Internet"
        USERS[Users / Browsers]
        MOBILE[Mobile Devices]
    end

    subgraph "Google Cloud Platform"
        subgraph "Edge"
            CDN[Cloud CDN]
            LB[Cloud Load Balancer]
        end

        subgraph "Cloud Run"
            FE[Frontend Service<br>Next.js Container]
            BE[Backend Service<br>FastAPI Container]
            SIM[Simulator Service<br>Data Generator]
        end

        subgraph "Data Layer"
            SQL[(Cloud SQL<br>PostgreSQL 15)]
            REDIS[(Memorystore<br>Redis 7)]
            GCS[Cloud Storage<br>Static Assets]
        end

        subgraph "AI Layer"
            VERTEX[Vertex AI<br>Gemini 2.5 Pro<br>Gemini Flash]
            EMBED[Vertex AI<br>Embeddings]
        end

        subgraph "Firebase"
            FAUTH[Firebase Auth]
            FSTORE[Firebase Storage]
            FCM[Firebase Cloud Messaging]
        end

        subgraph "Monitoring"
            LOG[Cloud Logging]
            MON[Cloud Monitoring]
            TRACE[Cloud Trace]
        end
    end

    USERS & MOBILE --> CDN --> LB
    LB --> FE & BE
    FE --> BE
    BE --> SQL & REDIS
    BE --> VERTEX & EMBED
    BE --> FAUTH & FSTORE
    BE --> LOG & MON & TRACE
    FE --> GCS
    BE --> FCM

    style VERTEX fill:#4285f4,color:#fff
    style SQL fill:#336791,color:#fff
    style REDIS fill:#dc382d,color:#fff
    style FAUTH fill:#f59e0b,color:#fff
```

---

## Docker Configuration

### docker-compose.yml (Development)

```yaml
version: "3.9"

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8000
      - NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_MAPBOX_TOKEN=${MAPBOX_TOKEN}
    volumes:
      - ./frontend/src:/app/src
    depends_on:
      - backend
    networks:
      - nexus-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://nexus:nexus_pass@postgres:5432/fifa_nexus
      - REDIS_URL=redis://redis:6379/0
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GOOGLE_CLOUD_PROJECT=${GCP_PROJECT_ID}
      - FIREBASE_SERVICE_ACCOUNT=${FIREBASE_SERVICE_ACCOUNT}
      - WEATHER_API_KEY=${WEATHER_API_KEY}
      - MAPBOX_TOKEN=${MAPBOX_TOKEN}
      - CORS_ORIGINS=http://localhost:3000
      - ENVIRONMENT=development
    volumes:
      - ./backend/app:/app/app
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - nexus-network

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=fifa_nexus
      - POSTGRES_USER=nexus
      - POSTGRES_PASSWORD=nexus_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexus -d fifa_nexus"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - nexus-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - nexus-network

volumes:
  postgres_data:
  redis_data:

networks:
  nexus-network:
    driver: bridge
```

### Backend Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run with uvicorn
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### Frontend Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

# Build for production
# RUN npm run build

# Development mode
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://nexus:nexus_pass@localhost:5432/fifa_nexus

# Redis
REDIS_URL=redis://localhost:6379/0

# AI
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_PROJECT=your_gcp_project

# Firebase
FIREBASE_SERVICE_ACCOUNT=path/to/service-account.json

# External APIs
WEATHER_API_KEY=your_weather_api_key
MAPBOX_TOKEN=your_mapbox_token

# App
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000
SECRET_KEY=your_secret_key
LOG_LEVEL=INFO

# Simulation
SIMULATION_ENABLED=true
SIMULATION_SPEED=1.0
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

---

## Cloud Run Deployment

### Backend Service Configuration

```yaml
# gcp/cloud-run-backend.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: fifa-nexus-backend
  annotations:
    run.googleapis.com/launch-stage: BETA
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/sessionAffinity: "true"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
        - image: gcr.io/PROJECT_ID/fifa-nexus-backend:latest
          ports:
            - containerPort: 8000
          resources:
            limits:
              cpu: "2"
              memory: "2Gi"
          env:
            - name: ENVIRONMENT
              value: "production"
          livenessProbe:
            httpGet:
              path: /health
            initialDelaySeconds: 5
          readinessProbe:
            httpGet:
              path: /health
            initialDelaySeconds: 5
```

### Cloud Build Pipeline

```yaml
# gcp/cloudbuild.yaml
steps:
  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/fifa-nexus-backend:$COMMIT_SHA', '-f', 'backend/Dockerfile', 'backend/']

  # Build frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/fifa-nexus-frontend:$COMMIT_SHA', '-f', 'frontend/Dockerfile', 'frontend/']

  # Push images
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/fifa-nexus-backend:$COMMIT_SHA']

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/fifa-nexus-frontend:$COMMIT_SHA']

  # Run migrations
  - name: 'gcr.io/cloud-builders/docker'
    args: ['run', 'gcr.io/$PROJECT_ID/fifa-nexus-backend:$COMMIT_SHA', 'alembic', 'upgrade', 'head']

  # Deploy backend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    args:
      - 'gcloud'
      - 'run'
      - 'deploy'
      - 'fifa-nexus-backend'
      - '--image=gcr.io/$PROJECT_ID/fifa-nexus-backend:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

  # Deploy frontend
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    args:
      - 'gcloud'
      - 'run'
      - 'deploy'
      - 'fifa-nexus-frontend'
      - '--image=gcr.io/$PROJECT_ID/fifa-nexus-frontend:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

timeout: '1200s'
options:
  logging: CLOUD_LOGGING_ONLY
```

---

## Scaling Strategy

| Component | Min Instances | Max Instances | CPU | Memory | Scaling Trigger |
|-----------|:---:|:---:|:---:|:---:|---|
| Frontend | 1 | 5 | 1 vCPU | 512 MB | Concurrent requests > 50 |
| Backend | 1 | 10 | 2 vCPU | 2 GB | Concurrent requests > 30 |
| PostgreSQL | 1 | 1 | 2 vCPU | 8 GB | Vertical scaling |
| Redis | 1 | 1 | 1 vCPU | 4 GB | Memory threshold > 75% |

## Monitoring & Observability

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| API Latency P95 | > 2000ms | Scale backend, check AI response times |
| WebSocket connections | > 5000 | Scale backend instances |
| Error Rate | > 1% | Alert on-call, check logs |
| AI Agent Latency | > 5000ms | Switch to Gemini Flash, cache results |
| Database connections | > 80% pool | Scale connection pool |
| Redis memory | > 75% | Evict old cache, increase memory |
| CPU usage | > 80% sustained | Auto-scale instances |
