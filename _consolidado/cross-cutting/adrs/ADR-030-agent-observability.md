# ADR-030: Agent Observability Padrão (OpenTelemetry + JSONL Audit + Trace Correlation)

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Trevor, Towards, Kaspersky, Niamaia, Qualy | **Decisor**: Severino

---

## Contexto

O Full Pilot e ADRs 010/014/024 revelaram **gap crítico de observabilidade** para agentes em produção:

- **ADR-010 (Sandbox)**: Exige audit log JSONL com `trace_id`, mas não padroniza formato
- **ADR-014 (Logging Sanitization)**: Define redaction, mas não correlação cross-agent
- **ADR-024 (MCP v2)**: Define `trace_id` no handshake, mas não propagação completa
- **Pilot ECC**: Agentes rodando sem visibilidade unificada de latência, erros, token usage, tool calls

Sem padrão, cada agente implementa observabilidade própria → silos, debugging impossível, compliance gaps.

---

## Decisão

Adotar **Agent Observability Stack** unificado baseado em **OpenTelemetry (OTel) + JSONL Audit + Trace Correlation**:

### 1. Three-Pillar Observability

| Pilar | Implementação | Propósito |
|-------|---------------|-----------|
| **Metrics** | OTel Metrics (Prometheus exporter) | Latência, throughput, error rate, token usage, tool call duration |
| **Logs** | JSONL estruturado + sanitization (ADR-014) | Audit trail, debugging, compliance |
| **Traces** | OTel Traces (W3C TraceContext) | Correlação cross-agent, bottleneck detection |

### 2. Trace Correlation (W3C TraceContext)

```typescript
// Propagação obrigatória em TODO hop agent-to-agent
interface TraceHeaders {
  'traceparent': string;  // version-trace-id-parent-id-flags
  'tracestate': string;   // vendor-specific state
}

// Exemplo traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
// Geração no entrypoint (HTTP request, CLI, scheduled job, MCP handshake)
function ensureTraceContext(headers: Record<string, string>): TraceHeaders {
  if (!headers['traceparent']) {
    headers['traceparent'] = generateTraceParent(); // OTel SDK
  }
  return headers as TraceHeaders;
}
```

### 3. JSONL Audit Log Schema (ADR-010 + ADR-014 Extended)

```json
{
  "timestamp": "2027-04-09T10:23:45.123Z",
  "level": "INFO",
  "service": "payment-processor",
  "trace_id": "0af7651916cd43dd8448eb211c80319c",
  "span_id": "b7ad6b7169203331",
  "agent_id": "payment-processor-v1.2.3",
  "event": "tool_call",
  "tool": "payment.charge",
  "duration_ms": 245,
  "input_hash": "sha256:a1b2c3d4...",
  "output_hash": "sha256:e5f6g7h8...",
  "status": "success",
  "tokens": { "input": 156, "output": 89, "total": 245 },
  "cost_usd": 0.0012,
  "user_id": "user_abc (hashed)",
  "sanitized": true
}
```

**Campos Obrigatórios**:
- `timestamp` (ISO 8601 UTC)
- `level` (DEBUG/INFO/WARN/ERROR)
- `service` (nome do agent/feature)
- `trace_id` + `span_id` (W3C)
- `agent_id` (nome + versão SemVer ADR-020)
- `event` (enum: `tool_call`, `tool_result`, `agent_start`, `agent_end`, `handoff`, `error`, `security_event`)
- `sanitized: true` (confirma redaction ADR-014)

### 4. OTel Metrics Padrão (Prometheus)

```prometheus
# HELP agent_tool_call_duration_ms Latência de tool calls por agent/tool
# TYPE agent_tool_call_duration_ms histogram
agent_tool_call_duration_ms_bucket{agent="payment-processor",tool="payment.charge",le="100"} 124
agent_tool_call_duration_ms_bucket{agent="payment-processor",tool="payment.charge",le="500"} 987
agent_tool_call_duration_ms_bucket{agent="payment-processor",tool="payment.charge",le="+Inf"} 1000

# HELP agent_tokens_total Tokens consumidos (input/output/total)
# TYPE agent_tokens_total counter
agent_tokens_total{agent="payment-processor",type="input"} 156000
agent_tokens_total{agent="payment-processor",type="output"} 89000

# HELP agent_errors_total Erros por tipo
# TYPE agent_errors_total counter
agent_errors_total{agent="payment-processor",type="timeout"} 3
agent_errors_total{agent="payment-processor",type="validation"} 12

# HELP agent_handoff_total Hand-offs entre agents
# TYPE agent_handoff_total counter
agent_handoff_total{from="orchestrator",to="payment-processor",status="success"} 450
```

### 5. Instrumentação no Template (`feature-skeleton` V2)

```typescript
// src/infrastructure/observability/otel.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function initOtel(serviceName: string): NodeSDK {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
    }),
    traceExporter: new ConsoleSpanExporter(), // Dev; produção → OTLP/Jaeger
    metricReader: new PrometheusExporter({ port: 9464 }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new HttpInstrumentation(),
      new GrpcInstrumentation(),
    ],
  });
  sdk.start();
  return sdk;
}
```

```typescript
// src/infrastructure/observability/audit-logger.ts
import { createWriteStream } from 'fs';
import { trace } from '@opentelemetry/api';

export class AuditLogger {
  private stream = createWriteStream('audit.log', { flags: 'a' });

  log(event: AuditEvent): void {
    const span = trace.getActiveSpan();
    const entry = {
      timestamp: new Date().toISOString(),
      level: event.level || 'INFO',
      service: process.env.SERVICE_NAME,
      trace_id: span?.spanContext().traceId,
      span_id: span?.spanContext().spanId,
      agent_id: `${process.env.SERVICE_NAME}@${process.env.npm_package_version}`,
      ...event,
      sanitized: true,
    };
    this.stream.write(JSON.stringify(entry) + '\n');
  }

  toolCall(tool: string, input: unknown, output: unknown, durationMs: number): void {
    this.log({
      event: 'tool_call',
      tool,
      duration_ms: durationMs,
      input_hash: hash(JSON.stringify(input)),
      output_hash: hash(JSON.stringify(output)),
      status: 'success',
    });
  }
}
```

### 6. MCP v2 Integration (ADR-024)

```typescript
// Handshake propaga trace context
interface AgentCard {
  capabilities: Capability[];
  trace_context: { traceparent: string; tracestate: string }; // W3C
}

// Tool call inclui trace context no payload
interface ToolCallRequest {
  method: string;
  params: unknown;
  traceparent: string;
  tracestate: string;
}
```

### 7. Dashboard & Alertas (Grafana)

| Painel | Métricas | Alerta |
|--------|----------|--------|
| **Agent Health** | `up`, `error_rate`, `p99_latency` | `error_rate > 5%` por 5m |
| **Token Economics** | `tokens_total`, `cost_usd`, `cost_per_request` | `cost_usd > $10/hr` |
| **Tool Performance** | `tool_call_duration_ms` (p50/p95/p99) | `p99 > 10s` |
| **Cross-Agent Flow** | `handoff_total`, `handoff_failure_rate` | `failure_rate > 2%` |
| **Security** | `security_event_total`, `sanitization_failures` | `sanitization_failures > 0` |

---

## Consequências

### Positivas
- **Debugging cross-agent**: Trace completo de request usuário → orchestrator → workers
- **Compliance ready**: Audit log imutável + sanitizado atende LGPD/SOC2 (ADR-017)
- **Cost control**: Token usage por agent/feature em tempo real
- **SLA observability**: Latência p99, error rate, availability por agent

### Negativas
- **Instrumentation overhead**: ~2-5% CPU/memória (mitigado por sampling adaptativo)
- **Complexidade OTel**: Curva de aprendizado (mitigado por template V2 com `initOtel()`)
- **Storage costs**: JSONL + metrics + traces (mitigado por retention policies: 30d hot / 1y cold)

### Riscos Mitigados
- PII em traces/logs → `sanitized: true` obrigatório + redaction pipeline (ADR-014)
- Trace context loss → Middleware automático em HTTP/gRPC/MCP transports
- Cardinality explosion → Labels controlados (agent, tool, status) — sem user_id em metrics

---

## Plano de Implementação

| Fase | Entregável | Responsável | Deadline |
|------|------------|-------------|----------|
| 1 | `observability` package no `feature-skeleton` V2 (otel + audit-logger) | Towards | 2027-04-23 |
| 2 | OTel Collector config (receivers: otlp, prometheus; exporters: loki, tempo, prometheus) | Trevor | 2027-05-07 |
| 3 | Grafana dashboards + alertas + runbooks | Trevor + Qualy | 2027-05-21 |
| 4 | Integrar no MCP v2 SDK (ADR-029) auto-instrumentation | Towards | 2027-06-12 |
| 5 | Pilotar em 3 agents produção (ECC, AionUi, nodebestpractices) | Towards | 2027-06-26 |
| 6 | Compliance review (LGPD/SOC2 audit log) | Kaspersky + Tranquilão | 2027-07-10 |

---

## Implementação de Referência

- `_consolidado/cross-cutting/templates/feature-skeleton/src/infrastructure/observability/`
- `_consolidado/cross-cutting/templates/feature-skeleton/.github/workflows/feature-ci.yml` (OTel Collector sidecar)
- `docker/otel-collector-config.yaml`
- `grafana/dashboards/agent-observability.json`

---

## Cross-References
* `ADR-010` (Agent Sandbox) — audit log requirement
* `ADR-014` (Logging Sanitization) — redaction pipeline
* `ADR-017` (Compliance) — LGPD/SOC2 audit trail
* `ADR-024` (MCP v2) — trace context propagation
* `ADR-026` (feature-skeleton V2) — onde observability é integrada
* `ADR-028` (DX Metrics) — telemetria de observabilidade adoption
* `ADR-029` (MCP v2 SDK) — auto-instrumentation
* `TECH-RADAR-Q2-2027.md` — Agent Observability como tendência ADOPT