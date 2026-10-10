# ADR-027: Multi-Language `feature-skeleton` Variants (Go, Rust, Python)

**Status**: ✅ **APROVADO** (Grill-Me Session 9 Outcome) | **Data**: 2027-04-09 | **Autores**: Niamaia, Towards, Qualy, Trevor | **Decisor**: Severino

---

## Contexto

O Full Pilot validou `feature-skeleton` V2 apenas para **TypeScript/JavaScript** (Node.js, React, MCP agents). No entanto, o ecossistema inclui projetos backend em **Go** (CLI tools, microservices), **Rust** (high-performance agents, WASM) e **Python** (data pipelines, ML services, FastAPI).

A **Sessão 9 do Grill-Me (Q1 2027 Week 2)** definiu a estratégia de portabilidade: **portar contrato + testes de comportamento, adaptando apenas o idiomático de cada linguagem** (Opção B consensual).

---

## Decisão

Criar **variantes oficiais do `feature-skeleton`** para Go, Rust e Python, mantendo:
1. **Estrutura de pastas idêntica** (domain/application/infrastructure/interfaces/contracts/tests)
2. **Contrato de domínio compartilhado** (entities, value-objects, services, events)
3. **Testes parametrizados** (mesmos cenários, toolchain nativa)
4. **Quality gates unificados** (ADR-008: 80/70 coverage + mutation em críticos)

---

## Estrutura Unificada (Todas as Variantes)

```
src/features/<feature-name>/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   └── events/
├── application/
│   ├── commands/
│   ├── queries/
│   └── handlers/
├── infrastructure/
│   ├── persistence/
│   ├── messaging/
│   ├── external/
│   └── logging/
├── interfaces/
│   ├── http/      (ou cli/grpc/mcp conforme stack)
│   ├── grpc/
│   └── cli/
├── contracts/
│   ├── openapi.yaml (ou asyncapi / protobuf)
│   ├── asyncapi.yaml
│   ├── sample.schema.json
│   └── mcp-manifest.json
└── tests/
    ├── unit/
    ├── integration/
    └── contract/
```

---

## Variante Go (`feature-skeleton-go`)

### Stack
| Camada | Escolha |
|--------|---------|
| **Build** | `go build` + `golangci-lint` |
| **Testing** | `testing` + `testify` + `go test -cover` + `go-test-coverage` |
| **Mutation** | `go-mutesting` / `gremlins` |
| **DI** | `wire` (compile-time) ou manual |
| **Config** | `viper` + `koanf` |
| **Logging** | `zerolog` / `slog` (structured JSON) |
| **HTTP** | `chi` / `gin` / `fasthttp` |
| **gRPC** | `grpc-go` + `protobuf` |
| **DB** | `sqlc` + `pgx` / `gorm` |

### tsconfig.json Equivalent (go.mod)
```go
module github.com/org/feature-name

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/go-playground/validator/v10 v10.16.0
    github.com/rs/zerolog v1.32.0
    github.com/google/uuid v1.5.0
    github.com/spf13/cobra v1.8.0
    github.com/spf13/viper v1.18.0
)
```

### Coverage Gate (Makefile)
```makefile
test:
	go test -v -race -coverprofile=coverage.out ./...

coverage-check:
	go tool cover -func=coverage.out | grep total | awk '{print $$3}' | sed 's/%//' | awk '{if ($$1 < 80) exit 1}'

mutation:
	gremlins unleash --timeout=30s ./...
```

---

## Variante Rust (`feature-skeleton-rust`)

### Stack
| Camada | Escolha |
|--------|---------|
| **Build** | `cargo build --release` + `clippy` + `rustfmt` |
| **Testing** | `cargo test` + `cargo-tarpaulin` (coverage) |
| **Mutation** | `cargo-mutants` |
| **DI** | Traits + generics (compile-time) |
| **Config** | `config-rs` + `serde` |
| **Logging** | `tracing` + `tracing-subscriber` (JSON) |
| **HTTP** | `axum` / `actix-web` |
| **gRPC** | `tonic` + `prost` |
| **DB** | `sqlx` (compile-time checked) / `diesel` |

### Cargo.toml
```toml
[package]
name = "feature-name"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = { version = "0.7", features = ["macros"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["json", "env-filter"] }
thiserror = "1.0"
uuid = { version = "1.0", features = ["v4", "serde"] }
validator = { version = "0.16", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres", "uuid", "chrono"] }
```

### Coverage Gate (Makefile / justfile)
```bash
test:
	cargo test --all-features

coverage:
	cargo tarpaulin --out Xml --coverage-type line --branch --fail-under 80

mutation:
	cargo mutants --json | jq '.mutation_score' | awk '{if ($$1 < 0.8) exit 1}'
```

---

## Variante Python (`feature-skeleton-python`)

### Stack
| Camada | Escolha |
|--------|---------|
| **Build** | `uv` / `poetry` + `pyproject.toml` |
| **Testing** | `pytest` + `pytest-asyncio` + `pytest-cov` |
| **Mutation** | `mutmut` |
| **DI** | `dependency-injector` / `fastapi.Depends` |
| **Config** | `pydantic-settings` + `python-dotenv` |
| **Logging** | `structlog` + `orjson` (JSON) |
| **HTTP** | `FastAPI` + `uvicorn` |
| **gRPC** | `grpcio` + `grpcio-tools` |
| **DB** | `SQLAlchemy 2.0` + `asyncpg` / `sqlmodel` |

### pyproject.toml
```toml
[project]
name = "feature-name"
version = "0.1.0"
description = "Feature skeleton Python variant"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.109",
    "uvicorn[standard]>=0.27",
    "pydantic>=2.6",
    "pydantic-settings>=2.2",
    "structlog>=24.1",
    "python-json-logger>=2.0",
    "sqlalchemy>=2.0",
    "asyncpg>=0.29",
    "python-dotenv>=1.0",
    "httpx>=0.26",
    "tenacity>=8.2",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.23",
    "pytest-cov>=4.1",
    "mutmut>=2.4",
    "ruff>=0.3",
    "mypy>=1.8",
    "types-ujson>=5.8",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "--cov=src --cov-report=term-missing --cov-fail-under=80 --cov-branch --cov-fail-under-branch=70"

[tool.mutmut]
paths_to_mutate = "src/"
backup = false
runner = "pytest -x"
```

### Coverage Gate (pytest.ini / pyproject.toml)
```ini
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=term-missing --cov-fail-under=80 --cov-branch --cov-fail-under-branch=70"
```

### Mutation Gate
```bash
mutmut run --paths-to-mutate=src/ --runner="pytest -x"
mutmut results | grep "mutation score" | awk '{if ($NF < 80) exit 1}'
```

---

## Contract Sharing Strategy

### 1. OpenAPI / AsyncAPI como Fonte da Verdade
- `contracts/openapi.yaml` — fonte única para HTTP APIs
- `contracts/asyncapi.yaml` — fonte única para event-driven
- **Codegen por linguagem**:
  - Go: `oapi-codegen` / `go-openapi`
  - Rust: `openapi-generator` (Rust server) / `asyncapi-codegen`
  - Python: `openapi-python-client` / `fastapi-codegen`

### 2. JSON Schema para Validação Cross-Language
- `contracts/sample.schema.json` — validação de payloads em testes de contrato
- Usado por: `ajv` (JS), `gojsonschema` (Go), `jsonschema` (Rust/Python)

### 3. MCP Manifest Compartilhado
- `contracts/mcp-manifest.json` — descoberta de capabilities cross-harness (ADR-025)

---

## CI Unificado (`feature-ci.yml` Multi-Language)

```yaml
# .github/workflows/feature-ci.yml
jobs:
  detect-language:
    runs-on: ubuntu-latest
    outputs:
      language: ${{ steps.detect.outputs.language }}
    steps:
      - uses: actions/checkout@v4
      - id: detect
        run: |
          if [ -f "go.mod" ]; then echo "language=go" >> $GITHUB_OUTPUT; fi
          if [ -f "Cargo.toml" ]; then echo "language=rust" >> $GITHUB_OUTPUT; fi
          if [ -f "pyproject.toml" ]; then echo "language=python" >> $GITHUB_OUTPUT; fi
          if [ -f "package.json" ]; then echo "language=typescript" >> $GITHUB_OUTPUT; fi

  test-go:
    needs: detect-language
    if: needs.detect-language.outputs.language == 'go'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with: { go-version: '1.22' }
      - run: make test coverage-check mutation

  test-rust:
    needs: detect-language
    if: needs.detect-language.outputs.language == 'rust'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: make test coverage mutation

  test-python:
    needs: detect-language
    if: needs.detect-language.outputs.language == 'python'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v3
      - run: uv sync --dev && uv run pytest && uv run mutmut run

  test-typescript:
    needs: detect-language
    if: needs.detect-language.outputs.language == 'typescript'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci && npm run lint && npm run typecheck && npm run test:coverage
```

---

## Consequências

### Positivas
- **Write once, run anywhere**: Mesma feature structure, contracts e testes em 4 linguagens
- **Onboarding unificado**: Dev aprende 1 estrutura, aplica em qualquer stack
- **Cross-language refactoring**: Mudança no contrato → regenera codegen em todas linguagens
- **CI consistente**: Quality gates idênticos (80/70 + mutation) via toolchain nativa

### Negativas
- **Manutenção de 4 templates**: Sincronização de mudanças estruturais
- **Codegen drift**: Regeneração manual necessária após mudanças no OpenAPI
- **Idiomatic friction**: Algumas patterns não mapeiam 1:1 (ex: Rust traits vs TS interfaces)

### Riscos Mitigados
- Fragmentação de padrões por linguagem → Estrutura forçada + contrato compartilhado
- Quality gate inconsistency → Thresholds unificados no CI
- Onboarding duplicado → Documentação única + exemplos por linguagem

---

## Plano de Implementação

| Fase | Entregável | Responsável | Deadline |
|------|------------|-------------|----------|
| 1 | `feature-skeleton-go` (estrutura + go.mod + Makefile + testes) | Towards | 2027-05-15 |
| 2 | `feature-skeleton-rust` (Cargo.toml + Makefile + testes + clippy) | Towards | 2027-05-29 |
| 3 | `feature-skeleton-python` (pyproject.toml + pytest + mutmut + ruff) | Towards | 2027-06-12 |
| 4 | Codegen scripts (OpenAPI → TS/Go/Rust/Python) | Niamaia | 2027-06-26 |
| 5 | CI multi-language `feature-ci.yml` unificado | Trevor | 2027-06-19 |
| 6 | Pilotar 1 feature em cada linguagem (ex: `payment-processor`) | Towards + Qualy | 2027-07-10 |
| 7 | Grill-Me de validação multi-language | Guanabara | 2027-07-17 |

---

## Implementação de Referência

- `_consolidado/cross-cutting/templates/feature-skeleton-go/`
- `_consolidado/cross-cutting/templates/feature-skeleton-rust/`
- `_consolidado/cross-cutting/templates/feature-skeleton-python/`
- `_consolidado/cross-cutting/templates/feature-skeleton/scripts/generate-from-contract.js`

---

## Cross-References
* `ADR-001` (Feature-based Packaging) — estrutura base
* `ADR-002` (Async Store) — contrato compartilhado
* `ADR-008` (Coverage Gates) — thresholds unificados
* `ADR-025` (Cross-Harness) — MCP manifest compartilhado
* `ADR-026` (feature-skeleton V2) — base TS para portabilidade
* `TECH-RADAR-Q2-2027.md` § ASSESS — variante em observação
* `_consolidado/cross-cutting/team/GRILL-ME-RESULTS.md` — Sessão 9 outcome