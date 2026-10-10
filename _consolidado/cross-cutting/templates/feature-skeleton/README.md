# Feature Skeleton Template (`feature-skeleton`)

> **Version**: 1.0.0  
> **Status**: Canonical / Production Ready  
> **Based on**: **ADR-001: Feature-based Packaging**, ADR-002 (Async Store), ADR-003 (Multi-Agent), ADR-007/010 (Security Baseline), ADR-013 (Supply Chain), ADR-014 (Observability), and extracted lessons from `oh-my-openagent`, `cc-switch`, `distilly`, and `skillpper`.

---

## Overview

The `feature-skeleton` is the canonical modular template for creating self-contained, domain-isolated, production-grade features within the repository. It enforces **Clean Architecture**, **Contract-First Design**, **Explicit Dependency Management**, and **Built-in Verification Gates**.

### Core Philosophy
1. **Domain Isolation**: The domain layer (`src/domain`) has zero external dependencies (pure business logic, entities, value objects).
2. **Contract-First**: Interfaces and external interactions are bound to explicit schemas (OpenAPI, AsyncAPI, or MCP contracts).
3. **Explicit Boundaries**: Every feature declares its metadata, dependencies (`requires`), provided capabilities (`provides`), and contracts in `feature.template.yml`.
4. **Autonomous Testing**: Full test pyramid (unit, integration, contract) accompanied by an isolated CI workflow (`feature-ci.yml`).

---

## Directory Structure

```
feature-skeleton/
├── README.md                    # This documentation guide
├── feature.template.yml         # Feature manifest (name, version, deps, contracts)
├── src/
│   ├── domain/                  # Pure domain logic (zero external dependencies)
│   │   ├── entities/            # Core business entities
│   │   ├── value-objects/       # Immutable value objects
│   │   ├── services/            # Domain services (cross-entity logic)
│   │   └── events/              # Domain events (reactive triggers)
│   ├── application/             # Use cases & workflow orchestration
│   │   ├── commands/            # Write operations (State-changing handlers)
│   │   ├── queries/             # Read operations (Optimized projections)
│   │   └── handlers/            # Event / Command / Query handlers
│   ├── infrastructure/          # Adapters (Database, HTTP, MQ, Filesystem)
│   │   ├── persistence/         # Repositories & ORM mappings
│   │   ├── messaging/           # Event bus / message queue producers/consumers
│   │   └── external/            # External API clients & SDK wrappers
│   └── interfaces/              # API surface (REST, gRPC, CLI, MCP)
│       ├── http/                # REST controllers / routers
│       ├── grpc/                # gRPC service definitions
│       └── cli/                 # Command Line Interface bindings
├── tests/
│   ├── unit/                    # Domain & application unit tests (fast, isolated)
│   ├── integration/             # Persistence & adapter integration tests (with testcontainers/fixtures)
│   └── contract/                # API and event contract tests
├── .github/
│   └── workflows/
│       └── feature-ci.yml       # Isolated feature CI pipeline (lint, test, build, security scan)
├── Dockerfile                   # Multi-stage production container build
├── docker-compose.yml           # Local development dependencies (DB, Redis, etc.)
├── package.json                 # Dependencies, scripts, and tooling config
└── CHANGELOG.md                 # Keep a Changelog format tracking version history
```

---

## Getting Started: How to Instantiate a New Feature

1. **Copy the skeleton**:
   ```bash
   cp -r _consolidado/cross-cutting/templates/feature-skeleton src/features/my-new-feature
   cd src/features/my-new-feature
   ```

2. **Customize the manifest**:
   Edit `feature.template.yml` to specify your feature name, version, required dependencies, and exposed contracts.

3. **Install dependencies**:
   ```bash
   npm install
   # or yarn / pnpm
   ```

4. **Run development mode & tests**:
   ```bash
   npm run test:unit
   npm run test:integration
   ```

---

## Architectural Guardrails

- **Never import infrastructure into domain**: `src/domain` must never reference `src/infrastructure` or `src/interfaces`.
- **Structured Logging & Traceability**: Always propagate correlation IDs across commands, queries, and external requests (ADR-014).
- **Validation & Sanitization**: All inputs entering through `src/interfaces` must be strictly validated before reaching `src/application`.
