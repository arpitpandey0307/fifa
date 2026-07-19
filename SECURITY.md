# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Active |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: security@fifanexusai.dev
3. Include: description, reproduction steps, impact assessment

We will acknowledge receipt within 48 hours and aim to resolve critical issues within 7 days.

## Security Measures

### Input Validation
- All API inputs validated with Zod v4 schemas before processing
- Message length capped at 2000 characters, incident descriptions at 1000
- Coordinate ranges validated (-90 to 90 lat, -180 to 180 lng)
- XSS prevention via HTML entity escaping in `sanitizeInput()`

### Rate Limiting
- 60 requests per minute per IP on all `/api/*` routes
- Sliding window implementation with automatic stale-entry cleanup
- Returns 429 status with human-readable error message

### HTTP Security Headers
| Header | Value |
|--------|-------|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none'` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| X-XSS-Protection | `1; mode=block` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(self)` |

### API Key Management
- Gemini API key stored exclusively in environment variables
- Never committed to source control (`.env*` in `.gitignore`)
- Application gracefully degrades without API key (fallback responses)

### Container Security
- Multi-stage Docker build (minimal production image ~150MB)
- Non-root user execution (UID 1001, `nextjs` user)
- Health check endpoint for container orchestration
