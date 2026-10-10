# ADR-029: MCP v2 SDK para Desenvolvedores de Agentes

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Towards, Trevor, Turing, Niamaia | **Decisor**: Severino

---

## Contexto

O **ADR-024 (MCP v2 Agent-to-Agent Protocol)** foi implementado com sucesso no ECC pilot (`agent-harness-exec`). No entanto, desenvolvedores externos que queiram criar agents compatíveis com MCP v2 enfrentam:

1. **Sem SDK oficial** — precisa implementar JSON-RPC 2.0, WebSocket, mTLS, capability negotiation do zero
2. **Boilerplate alto** — ~500 linhas de setup antes da lógica de negócio
3. **Inconsistência** — cada implementação tem bugs sutis de handshake, retry, circuit breaker
4. **Testabilidade** — sem mocks/test utilities para development local

---

## Decisão

Publicar **MCP v2 SDK oficial** (`@severino/mcp-v2-sdk`) com:

### 1. Pacotes (Monorepo pnpm + Turborepo)
```
packages/
├── core/              # Core types, interfaces, schemas (zero-dep)
├── client/            # AgentClient — conecta a outros agents
├── server/            # AgentServer — expõe capabilities
├── transport/
│   ├── websocket/     # WebSocket transport
│   ├── stdio/         # STDIO fallback (compat V1)
│   └── http/          # HTTP polling (opcional)
├── crypto/            # mTLS helpers, JWT agent_token, key rotation
├── resilience/        # Retry, circuit breaker, timeout, keepalive
├── testing/           # MockServer, MockClient, fixtures, contract tests
├── cli/               # `mcp-v2 dev`, `mcp-v2 inspect`, `mcp-v2 certify`
└── docs/              # Guides, examples, migration V1→V2
```

### 2. API Surface (TypeScript)

```typescript
// @severino/mcp-v2-sdk/client
import { AgentClient, createAgentClient } from '@severino/mcp-v2-sdk/client';

const client = createAgentClient({
  agentCard: {
    id: 'payment-processor',
    role: 'worker',
    skills: ['payment.charge', 'payment.refund'],
    models: ['gpt-4o'],
    permissions: ['network:stripe.com', 'fs:/tmp'],
  },
  transport: 'websocket',
  endpoint: 'ws://localhost:8080/mcp',
});

// Descoberta de capacidades
const peers = await client.discover({ role: 'orchestrator' });

// Invocação com retry/circuit breaker automático
const result = await client.invoke('payment.charge', {
  amount: 1000,
  currency: 'BRL',
  customer_id: 'cus_123',
}, { timeout: 5000, retries: 3 });

// Streaming
for await (const chunk of client.stream('report.generate', { format: 'pdf' })) {
  console.log(chunk);
}
```

```typescript
// @severino/mcp-v2-sdk/server
import { AgentServer, defineTool } from '@severino/mcp-v2-sdk/server';

const server = new AgentServer({
  agentCard: { /* ... */ },
  transport: 'websocket',
  port: 8080,
  tls: { cert: 'cert.pem', key: 'key.pem' }, // mTLS
});

server.tool(
  defineTool({
    name: 'payment.charge',
    description: 'Processa cobrança via Stripe',
    inputSchema: z.object({ amount: z.number(), currency: z.string() }),
    outputSchema: z.object({ charge_id: z.string(), status: z.enum(['succeeded', 'failed']) }),
    permissions: ['network:stripe.com'],
  }),
  async (input, context) => {
    // Lógica de negócio
    const charge = await stripe.charges.create({ ... });
    return { charge_id: charge.id, status: charge.status };
  }
);

await server.start();
```

### 3. Testing Utilities
```typescript
// @severino/mcp-v2-sdk/testing
import { createMockServer, createMockClient, fixture } from '@severino/mcp-v2-sdk/testing';

const mockServer = createMockServer({
  tools: {
    'payment.charge': fixture('payment.charge.success'),
    'payment.refund': fixture('payment.refund.success'),
  },
});

const client = createMockClient({ server: mockServer });
const result = await client.invoke('payment.charge', { amount: 100 });
expect(result.charge_id).toBe('ch_test_123');
```

### 4. CLI Developer Experience
```bash
# Desenvolvimento local com mock server
mcp-v2 dev --agent=payment-processor --mock

# Inspecionar tráfego JSON-RPC
mcp-v2 inspect --port=8080

# Certificar compatibilidade (roda conformance suite)
mcp-v2 certify --agent=./dist --harness=opencode,v2

# Gerar scaffolding de novo agent
mcp-v2 init my-agent --template=worker --transport=websocket
```

### 5. Compatibilidade V1→V2
```typescript
// Bridge automático incluído no SDK
import { V1CompatLayer } from '@severino/mcp-v2-sdk/compat';

const server = new AgentServer({
  compat: new V1CompatLayer(), // Detecta V1 clients e traduz callbacks→promises
});
```

---

## Distribuição & Governança

| Aspecto | Detalhe |
|---------|---------|
| **Registry** | npm (`@severino/mcp-v2-sdk`) + GitHub Packages |
| **Versionamento** | SemVer (ADR-020) — `core`, `client`, `server` versionados juntos |
| **Publicação** | Pipeline `skill-marketplace.yml` (ADR-023) — SLSA L2+, cosign |
| **Documentação** | `docs.severino.dev/mcp-v2` + OpenAPI spec auto-gerada |
| **Suporte** | Issues no `Repositorios/mcp-v2-sdk`, Discord #mcp-v2 |

---

## Consequências

### Positivas
- **Barreira de entrada near-zero**: `npm i @severino/mcp-v2-sdk` → agent funcional em minutos
- **Consistência garantida**: Todos agents usam mesma resilience, security, observability
- **Testabilidade**: Mock server/client eliminam flakiness em testes de integração
- **Evolução segura**: Breaking changes apenas em MAJOR, migração via compat layer

### Negativas
- **Manutenção de SDK**: Surface API grows, precisa de changelog rigoroso
- **Vendor lock-in percebido**: Mitigado por spec aberta + implementations em Go/Rust/Python (futuro)
- **Bundle size**: Core zero-dep, mas `transport/websocket` traz `ws` dependency

### Riscos Mitigados
- Protocol drift → Conformance suite obrigatória no `mcp-v2 certify`
- Security regression → `crypto/` auditado por Kaspersky a cada release
- Breaking changes não comunicados → `changesets` + auto-changelog + Slack notify

---

## Plano de Implementação

| Fase | Entregável | Responsável | Deadline |
|------|------------|-------------|----------|
| 1 | `core` + `transport/websocket` + `transport/stdio` + types | Towards | 2027-05-15 |
| 2 | `client` + `server` + `resilience` (retry/CB/timeout) | Towards | 2027-05-29 |
| 3 | `crypto` (mTLS, JWT, key rotation) + audit Kaspersky | Kaspersky + Trevor | 2027-06-12 |
| 4 | `testing` (MockServer, MockClient, fixtures, contract tests) | Qualy + Towards | 2027-06-26 |
| 5 | `cli` (`dev`, `inspect`, `certify`, `init`) | Turing | 2027-07-10 |
| 6 | Go/Rust/Python bindings (via codegen ADR-027) | Niamaia | 2027-08-07 |
| 7 | Publicar v1.0.0 + documentação + exemplos | Towards | 2027-08-21 |
| 8 | Grill-Me de validação do SDK | Guanabara | 2027-08-28 |

---

## Implementação de Referência

- `Repositorios/mcp-v2-sdk/` (monorepo pnpm + Turborepo)
- `_consolidado/cross-cutting/templates/mcp-v2-sdk/` (template para novo agent)
- `docs.severino.dev/mcp-v2` (documentação pública)

---

## Cross-References
* `ADR-024` (MCP v2 Protocol) — especificação base
* `ADR-025` (Cross-Harness) — SDK habilita portabilidade
* `ADR-023` (Marketplace) — pipeline de publicação do SDK
* `ADR-010` (Agent Sandbox) — SDK integra com sandbox permissions
* `ADR-028` (DX Metrics) — telemetria de uso do SDK
* `TECH-RADAR-Q2-2027.md` § TRIAL — MCP v2 SDK em avaliação