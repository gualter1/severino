# ADR-024: Agent-to-Agent Protocol (MCP v2)

## Status: Accepted

## Context
Necessidade de protocolo de comunicação inter-agentes padronizado, com schema versionado, descoberta via registry, resiliência e segurança.

## Decision
Implementar **MCP v2** sobre TypeScript com:
- Schema versionado (`protocols/mcp-v2/schema/`)
- Registry in-memory com descoberta filtrada por permissões (ADR-010)
- Resiliência: timeout + retry com backoff exponencial + circuit breaker (3 falhas -> OPEN, 2s reset)
- Erros tipados propagados: TIMEOUT, NOT_FOUND, SANDBOX_DENIED, RATE_LIMITED, INTERNAL_ERROR
- Logging sanitizado conforme ADR-014 (remove PII, tokens, secrets)

## Consequences
### Positive
- Interoperabilidade entre agentes com contrato claro
- Discovery controlado por permissões
- Observabilidade sem vazamento de segredos

### Negative
- Overhead de circuit breaker e retry precisa tunar para produção
- Registry in-memory: evoluir para distribuído em sistemas grandes

### Risks
- Circuit breaker compartilha threshold único por client (por ora)

## Alternatives Considered
- gRPC direto - Rejeitado: acoplamento alto, sem descoberta
- REST + OpenAPI gateway - Rejeitado: sem streaming eficiente

## References
- Grill-Me Session 6 decision: MCP v2 with registry + resilience
- ADR-010 (Sandbox), ADR-014 (Logging Sanitizado)
