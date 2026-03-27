# AGENTS.md

---

## Project Overview

**Name:** my-nestjs-project
**Stack:** NestJS + TypeScript + Docker
**Repo:** https://github.com/zulkarnen-force/my-nestjs-project

---

## Architecture Rules

### Layered Architecture
```
Controller → Service → Repository → Data Source
```
- **Controller:** HTTP handling, validation, response formatting
- **Service:** Business logic, orchestration
- **Repository:** Data access abstraction
- **Data Source:** Database, external APIs

### Repository Pattern
- Data access must go through repository layer
- Never query database directly from service
- Interface-based design for testability

### Typed Data
- Use DTOs/Interfaces for all data transfers
- Define return types explicitly
- No `any` types — use `unknown` with type guards if needed

---

## Coding Standards

### File Naming
```
*.service.ts        → Business logic
*.controller.ts     → HTTP handlers
*.repository.ts     → Data access
*.dto.ts           → Data transfer objects
*.entity.ts         → Domain models
*.spec.ts          → Unit tests (MUST exist for every feature)
```

### Unit Test Requirements
**Every feature MUST have corresponding `*.spec.ts`**
```
src/auth/auth.service.ts   → src/auth/auth.service.spec.ts
src/auth/auth.controller.ts → src/auth/auth.controller.spec.ts
```

Test coverage requirements:
- Service methods: all public methods tested
- Controller methods: all endpoints tested with mocks

---

## Pre-PR Checklist

- [ ] Unit tests exist for new feature
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No hardcoded secrets
- [ ] Docker builds: `docker compose build`
- [ ] Types are explicit (no `any`)

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
git add . && git commit -m "<type>: <desc>"
git push origin-https HEAD     # Push current branch
```

---

## Commit Types

`feat` | `fix` | `docs` | `refactor` | `test` | `chore`

---

## Project Structure

```
src/
├── auth/                    # Auth module (example)
│   ├── dto/                  # Data transfer objects
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── entities/             # Domain models
│   │   └── user.entity.ts
│   ├── repositories/          # Data access layer
│   │   └── user.repository.ts
│   ├── auth.service.ts        # Business logic
│   ├── auth.service.spec.ts   # REQUIRED
│   ├── auth.controller.ts     # HTTP handlers
│   ├── auth.controller.spec.ts # REQUIRED
│   └── auth.module.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
```

---

## Service Pattern

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(createDto: CreateUserDto): Promise<User> {
    // Business logic here
    return this.userRepository.create(createDto);
  }
}
```

---

## Repository Pattern

```typescript
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly db: Repository<User>,
  ) {}

  create(data: CreateUserDto): Promise<User> {
    return this.db.save(data);
  }
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/` | Health check |

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
