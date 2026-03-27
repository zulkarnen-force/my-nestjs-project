# AGENTS.md — Production-Grade Vibe Coding Guide

_For humans who want to ship fast without breaking things._

---

## Philosophy

Vibe coding = move fast, stay creative, let AI handle the boilerplate.

But fast ≠ sloppy. This guide ensures your project is **production-grade** while keeping the vibe alive.

---

## Golden Rules

### 1. Always Run Tests Before Committing
```bash
npm test        # Run all tests
npm run build    # Verify TypeScript compiles
```
No exceptions. Tests are your safety net.

### 2. Use Feature Branches
```
main      → production-ready code only
feat/*    → new features
fix/*     → bug fixes
hotfix/*  → urgent production fixes
```

### 3. Lint & Format Before Commit
```bash
npm run lint     # Check code style
npm run format   # Auto-format (if available)
```

### 4. Environment Variables = Secrets
- Never commit `.env` files
- Use `.env.example` as a template
- Store secrets in CI/CD or secrets manager

### 5. Keep Commits Atomic
One commit = one logical change. Message format:
```
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Production Checklist

Before deploying, verify:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No hardcoded secrets in code
- [ ] `.env` properly configured for production
- [ ] Docker image builds successfully
- [ ] Health check endpoint responds
- [ ] Error handling is in place

---

## Docker Best Practices

### Multi-Stage Builds
Always use multi-stage builds for small, secure images:
```dockerfile
FROM node:22-alpine AS builder
# ... build steps

FROM node:22-alpine AS production
# Only copy needed artifacts
```

### Non-Root User
```dockerfile
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs
```

### Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1
```

---

## GitHub Workflow Integration

### Branch Protection (for main)
- Require pull request reviews
- Require status checks to pass
- Do not allow force pushes

### PR Requirements
All PRs must have:
- Clear title describing the change
- Link to related issue
- Description of what/why
- Test results

### Closing Issues
Use keywords in commits/PRs:
```
Closes #1
Fixes #2
Resolves #3
```

---

## Error Handling Patterns

### Service Layer
```typescript
try {
  const result = await this.someService.doSomething();
  return result;
} catch (error) {
  throw new InternalServerErrorException('Operation failed');
}
```

### Controller Layer
```typescript
@Post()
async create(@Body() dto: CreateDto): Promise<Response> {
  const result = await this.service.create(dto);
  return result; // Let global exception filter handle errors
}
```

---

## Logging (Production)

Use a consistent log format:
```typescript
this.logger.log(`User ${userId} logged in`);
this.logger.error('Operation failed', error.stack);
```

Log levels: `log`, `warn`, `error`, `debug`

---

## Security Basics

1. **Validate all input** — Use DTOs with class-validator
2. **Sanitize output** — Don't leak internal errors to clients
3. **Use HTTPS** — Always in production
4. **Rate limiting** — Protect auth endpoints
5. **CORS** — Configure properly for your domains

---

## Quick Reference

```bash
# Development
npm run start:dev     # Watch mode
npm test              # Run tests
npm run lint          # Lint

# Production
npm run build         # Build
docker build -t app . # Docker build
docker compose up -d  # Run with compose

# Cleanup
npm run prune         # Remove unused deps
docker system prune   # Clean Docker
```

---

## When in Doubt

- **Ship it?** → Tests pass + builds = ship it
- **Need help?** → Check logs first, then escalate
- **Found a bug?** → Write a test, fix it, commit
- **Not sure about security?** → Ask, don't guess

---

_This guide evolves. Update it as your team learns._
