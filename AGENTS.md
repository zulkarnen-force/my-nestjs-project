# AGENTS.md

---

## Project Overview

**Name:** my-nestjs-project
**Stack:** NestJS + TypeScript + Docker
**Repo:** https://github.com/zulkarnen-force/my-nestjs-project

---

## Quick Commands

```bash
# Development
npm run start:dev     # Watch mode
npm test              # Run all tests
npm run build         # Build for production

# Docker
docker compose up --build -d   # Build & start
docker compose logs -f app     # View logs
docker compose down            # Stop

# Git
git checkout -b feat/<name>   # Create feature branch
git commit -m "<type>: <desc>" # Commit changes
```

---

## Commit Types

`feat` | `fix` | `docs` | `refactor` | `test` | `chore`

---

## Pre-Commit Checklist

- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No hardcoded secrets
- [ ] Docker builds successfully

---

## Project Structure

```
src/
├── auth/              # JWT authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── auth.service.spec.ts
│   └── auth.controller.spec.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/` | Health check (Hello World) |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `production` | Environment |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |

---

## Docker

- **Image:** `node:22-alpine` (multi-stage build)
- **User:** Non-root (`nestjs`)
- **Port:** `3000`
- **Health Check:** Enabled

---

## Notes

- Tests are in `*.spec.ts` files alongside source
- Use `class-validator` DTOs for input validation
- Auth uses Passport + JWT strategy
