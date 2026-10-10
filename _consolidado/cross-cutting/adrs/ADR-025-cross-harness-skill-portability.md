# ADR-025: Cross-Harness Skill Portability

- **Status**: ✅ Aprovado (Grill-Me Session 7)
- **Data**: 2027-01-08
- **Autores**: Niamaia, Turing, Towards, Trevor, Guanabara
- **Decisores**: Severino (Líder) — Donos: Niamaia (arch), Turing (DX guide), Towards (impl), Trevor (CI matrix)

## Contexto
Com Three-Shape Plugin Model (ADR-021) e Zero-Dependency Dual-Compat (ADR-022), um único skill deve rodar em **Claude Code (Shape A)**, **OpenCode V2 (Shape B)** e **Cursor/vscode .mdc (Shape C)** sem duplicação de lógica. O problema: cada harness expõe APIs, formatos de configuração, sistemas de permissão e ciclos de vida diferentes. Sem portabilidade, times mantêm 3 codebases paralelos, quebram DRY, e feature detection vira ad-hoc.

Restrições: core **zero-dependency** (ADR-022); adapters **finos** (sem lógica de negócio); feature detection **runtime + testável**; CI matrix cobre combinações reais.

## Decisão
Adotar **Core Agnóstico + Adaptadores Finos por Shape/Harness + Feature Detection Runtime** como padrão obrigatório de portabilidade cross-harness.

### 1. Arquitetura: Core + Adapter + Detector

```
┌─────────────────────────────────────────────────────────────┐
│                        SkillCore                              │
│  100% agnóstico, zero deps, lógica de negócio pura           │
│  Exporta: execute(input, ctx) → output                        │
└──────────────────────────┬────────────────────────────────────┘
                           │ (importa apenas types)
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ ShapeAdapter<A> │ │ ShapeAdapter<B> │ │ ShapeAdapter<C> │
│ (Claude Code)   │ │ (OpenCode V2)   │ │ (Cursor/.mdc)   │
│ Thin: hooks     │ │ Thin: in-proc   │ │ Thin: markdown  │
│ shell env,      │ │ runtime, TS API │ │ injection,      │
│ permissions     │ │ + sandbox       │ │ frontmatter     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │ CapabilityDetector  │
                  │ Runtime feature     │
                  │ detection API       │
                  └─────────────────────┘
```

- **SkillCore**: único, testável isoladamente (unit tests sem harness).
- **ShapeAdapter\<A|B|C\>**: *apenas* tradução harness → Core (ex: ler `process.env` no A, `opencode.config` no B, frontmatter no C). **Nenhuma lógica de negócio**.
- **CapabilityDetector**: API síncrona `hasFeature(feature: string): boolean` — expõe o que o harness *realmente* suporta no momento da execução.

### 2. Feature Detection Runtime (Pattern Obrigatório)
```typescript
// Core usa detector — NUNCA if (harness === 'claude')
if (capabilityDetector.hasFeature('workspaceEdit')) {
  return editFiles(ops);
}
// fallback determinístico, testável
return emitInstructions(ops); // Shape C fallback
```
- **Catálogo de features** (estável, versionado no registry):
  - `workspaceEdit` — escrita de arquivos via API
  - `shellExec` — execução de comandos
  - `networkFetch` — HTTP allowlist
  - `sandboxWrite` — escrita dentro do sandbox
  - `streamingOutput` — tokens/progresso incremental
  - `toolCall` — invocação de tools nativas do harness
- **Detector por adapter**: cada `ShapeAdapter` implementa `CapabilityDetector` com base no que aquele harness expõe. Cache em memória (<1ms lookup).

### 3. Matriz CI Obrigatória
Pipeline roda **todas** combinações a cada PR:

| Harness | Shape | Capability Set | Job ID |
|---------|-------|----------------|--------|
| `claude` | A (Shell-Hook) | `min` (apenas `shellExec`) | `ci/claude-min` |
| `claude` | A (Shell-Hook) | `full` (todas features) | `ci/claude-full` |
| `opencode` | B (In-Process) | `min` (`toolCall` + `sandboxWrite`) | `ci/opencode-min` |
| `opencode` | B (In-Process) | `full` (todas) | `ci/opencode-full` |
| `generic` | C (Instructions-File) | `min` (`workspaceEdit` simulado via diff) | `ci/generic-min` |
| `generic` | C (Instructions-File) | `full` (todas simuladas) | `ci/generic-full` |

- **`min`**: subset mínimo viável para skill rodar (gates de entry).
- **`full`**: todas features habilitadas — testa paths avançados.
- **Fail fast**: qualquer job vermelho bloqueia merge. Matrix roda em paralelo (~8min total).

### 4. Regra Core/Adapter (Enforced by Lint)
- **Lint rule `PORT001`**: `SkillCore` **não pode** importar de `ShapeAdapter*`, `CapabilityDetector`, nem `process.env`, `opencode`, `vscode`, `fs/promises` (apenas `fs` via interface `FileSystem` injetada).
- **Lint rule `PORT002`**: `ShapeAdapter` **não pode** conter lógica de negócio (complexidade ciclomática > 3 → fail). Apenas mapeamento 1:1 harness → Core types.
- **Entry points**: 3 arquivos gerados (`cli.ts`, `inproc.ts`, `instructions.md`) que apenas instanciam `SkillCore` + `ShapeAdapter` + `CapabilityDetector` correto.

## Consequências
- **Positivas**: 1 codebase → 3 harnesses (zero duplicação); testabilidade Core isolada (unit tests rápidos, sem mock de harness); feature detection explícita elimina bugs de "funciona no meu harness"; CI matrix garante regressão zero cross-harness.
- **Negativas**: Boilerplate inicial de 3 adapters + detector; feature catalog exige governança (novas features = PR no catálogo + implementação nos 3 adapters); CI matrix consome 6x recursos vs single harness.
- **Riscos Mitigados**: Lock-in a harness único; drift de comportamento entre harnesses; lógica de negócio vazando em adapter (quebra testabilidade/portabilidade); feature detection ad-hoc não testável.

## Alternativas Consideradas
| Alternativa | Por que não |
|-------------|-------------|
| 3 codebases separados | DRY violado, bugs divergentes, manutenção 3x |
| Adapter "gordo" com lógica compartilhada | Quebra isolamento, testa mal, core não é reusável |
| Feature detection via `process.env.HARNESS` | Frágil, não detecta capability real (ex: sandbox disabled), não testável unitário |

## Implementação de Referência
- **Template**: `_consolidado/cross-cutting/templates/skill-template/`
  - `src/core/skill-core.ts` (exporta `execute`, `SkillInput`, `SkillOutput`)
  - `src/adapters/claude-adapter.ts`, `opencode-adapter.ts`, `generic-adapter.ts`
  - `src/detector/capability-detector.ts` (interface + 3 impls)
  - `src/entrypoints/cli.ts`, `inproc.ts`, `instructions.ts`
- **CI**: `.github/workflows/skill-portability.yml` (matrix 6 jobs, `pnpm test:core` + `pnpm test:adapter:<shape>`)
- **DX Guide (Turing)**: `_consolidado/cross-cutting/docs/skill-portability-guide.md` — "Como criar skill portável do zero", exemplos de feature detection, troubleshooting matrix.
- **Lint**: `eslint-plugin-skill-portability` rules `PORT001`, `PORT002` no `skill-review.yaml` (ADR-022).