# Contributing

## Development Setup

```bash
git clone https://github.com/arpitpandey0307/fifa.git
cd fifa
npm install
cp .env.example .env.local
npm run dev
```

## Code Standards

### TypeScript
- **Strict mode** enabled (`strict: true` in tsconfig.json)
- All exports must have **JSDoc comments**
- Use `error: unknown` pattern in catch blocks (never implicit `any`)
- Prefer `const` assertions for literal objects (`as const`)

### File Organization
- One component per file
- Co-locate types near usage, shared types in `src/types/index.ts`
- Constants in `src/lib/constants.ts`, not inline magic values

### Testing
- All utility functions must have corresponding tests
- API routes must have integration tests with validation edge cases
- Run `npm test` before committing
- Minimum coverage target: 80% on `src/lib/` and `src/data/`

### Security
- All user input must pass through `sanitizeInput()` before use
- API routes must use Zod schemas for request validation
- Never log API keys or user PII
- CSP must not include `unsafe-eval`

### Accessibility
- All interactive elements must have ARIA labels
- All icons must have `aria-hidden="true"` with adjacent text labels
- Dynamic content regions must use `aria-live`
- Support keyboard navigation with visible focus indicators

## Commit Convention

```
feat: add new feature
fix: resolve a bug
chore: maintenance tasks
test: add or update tests
docs: documentation changes
refactor: code restructuring without behavior change
security: security improvements
a11y: accessibility improvements
```

## Branch Policy
- All work on `main` branch (single-branch repository)
- Clean, atomic commits with descriptive messages
