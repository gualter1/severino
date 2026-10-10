# ADR-024: Agent-to-Agent Protocol (MCP v2)

- **Status**: ✅ Aprovado (Grill-Me Session 6)
- **Data**: 2027-01-08
- **Autores**: Niamaia, Towards, Trevor, Turing, Kaspersky
- **Decisores**: Severino (Líder) — Donos: Niamaia+Twards (Registry/Schema), Trevor+Twards (Transporte/Resiliência), Turing (SDK/DX)

## Contexto
Skills e agents precisam compor entre si (ex: `planner → executor → critic`, `skill A invoca skill B`). Sem contrato formal, cada integração vira ad-hoc (HTTP livre, JSON sem schema, sem descoberta, sem resiliência), gerando acoplamento, falhas silenciosas e impossibilidade de evoluir o protocolo sem quebrar consumidores. Precisamos de um protocolo **versionado, descobrível, resiliente e sandbox-aware** que permita evolução sem breaking changes e observabilidade fim-a-fim.

Restrições: deve respeitar ADR-010 (Sandbox — isolamento por permissão/capability) e ADR-014 (Logging Sanitizado — nunca logar PII/secrets em args/results). Transporte deve ser agnóstico (in-process, stdio, HTTP/SSE) mas contrato deve ser único.

## Decisão
Adotar **MCP v2** como protocolo único para comunicação agent-to-agent, com **schema versionado + descoberta via registry** e semântica de resiliência padronizada.

### 1. Schema Versionado + Descoberta via Registry
- **Schema**: toda mensagem MCP v2 carrega `mcpVersion: '2.x'` (SemVer, ADR-020) e é validada contra JSON Schema versionado no registry.
- **Registry como source of truth**: agents/skills registram `capabilities` + `mcpVersion` suportada no marketplace registry (ADR-023). Descoberta é dinâmica — sem hardcode de endpoints.
- **Evolução compatível**: MINOR adiciona campos opcionais; MAJOR quebra contrato e exige negociação de versão no handshake (`discovery` retorna `compatibleVersions`).

### 2. Operações Padronizadas

| Operação | Semântica |
|----------|-----------|
| `discovery` | Lista agents/skills disponíveis + capabilities + `mcpVersion` compatível, **filtrada por permissão do chamador** (ADR-010) |
| `invoke` | Chamada request/response única (idempotente quando `idempotencyKey` presente) |
| `stream` | Canal SSE/WebSocket para respostas incrementais (tokens, progresso, logs) com `streamId` e backpressure |
| `onError` | Propagação de erro tipado com contrato fixo (ver abaixo); nunca stack trace cru |

```typescript
// Contrato de erro tipado (propagado + logado sanitizado)
type MCPError = {
  code: 'TIMEOUT' | 'NOT_FOUND' | 'SANDBOX_DENIED' | 'RATE_LIMITED';
  retryable: boolean;
  retryAfter?: number; // segundos, presente quando RATE_LIMITED ou TIMEOUT retryable
  message: string;     // sanitizado (ADR-014) — sem PII/secret
  traceId?: string;
};
```

### 3. Resiliência Obrigatória (Transporte)
- **Timeout**: default 30s por `invoke`, configurável por capability (`timeoutMs` no registry). `TIMEOUT` → `retryable: true` se idempotente.
- **Retry com backoff**: exponential backoff + jitter (base 500ms, max 30s, max 3 tentativas) apenas quando `retryable: true`.
- **Circuit Breaker**: por target agent (threshold: 5 falhas em 60s → open 30s → half-open probe). Estado exposto em `discovery` (`circuit: 'open' | 'closed'`).
- **Erro tipado propagado**: todo erro de transporte é mapeado para `MCPError`; chamador decide retry via `retryable` + `retryAfter`.

### 4. Compatibilidade Transversal
- **ADR-010 (Sandbox)**: `discovery` retorna apenas targets que o chamador tem permissão para invocar (filtrado por `settings.json` allowlist). `invoke` executa **na sandbox do alvo**, nunca na do chamador — isolamento preservado.
- **ADR-014 (Logging Sanitizado)**: `args` e `results` são sanitizados (PII/secrets → `[REDACTED]`) antes de qualquer log/trace. Logs estruturados obrigatórios: `trace_id`, `span_id`, `mcpVersion`, `operation`, `target`, `duration_ms`, `error.code`.

## Consequências
- **Positivas**: Composição desacoplada (qualquer agent descobre e invoca qualquer outro via contrato único); evolução segura (versionamento + registry); resiliência padronizada (timeout/retry/circuit breaker); observabilidade (traces + erro tipado); segurança (sandbox + log sanitizado).
- **Negativas**: Overhead de schema validation por mensagem (~1-2ms); registry vira dependência crítica (requer HA + cache local); circuit breaker exige tuning por workload.
- **Riscos Mitigados**: Integração ad-hoc frágil; vazamento de PII em logs de tool calls; cascata de falhas sem circuit breaker; bypass de sandbox via invoke direto.

## Alternativas Consideradas
| Alternativa | Por que não |
|-------------|-------------|
| HTTP REST livre sem schema | Sem contrato, sem descoberta, quebra silenciosa em evolução |
| gRPC puro | Excelente performance, mas exige toolchain pesada e não roda em Shape C (Instructions-File, ADR-021) |
| Manter MCP v1 | Sem versionamento, sem `stream`, sem erro tipado — insuficiente para composição multi-agente |

## Implementação de Referência
- **Schema**: `_consolidado/cross-cutting/schemas/mcp-v2/*.json` (versionado, validado no CI)
- **Registry**: `POST /mcp/discovery`, `POST /mcp/invoke`, `GET /mcp/stream/:id` — filtra por permissão (ADR-010)
- **SDK (Turing)**: `@severino/mcp-sdk` — `discover()`, `invoke()`, `stream()`, `onError()` + sanitizer `sanitizeForLog()` (ADR-014)
- **Transporte (Trevor+Twards)**: wrapper com timeout + retry + circuit breaker (`cockatiel`/`opossum` ou impl própria zero-dep, ADR-022)
- **Observabilidade**: OpenTelemetry spans `mcp.invoke` + métricas RED (Rate/Errors/Duration) por target
