/**
 * OpenTelemetry SDK initialization for agent/feature observability.
 * Integrates with ADR-030 (Agent Observability) + ADR-024 (MCP v2 trace correlation).
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';

export interface OtelConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  traceExporter?: 'console' | 'otlp';
  metricsPort?: number;
}

let sdkInstance: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry SDK.
 * Call once at application startup (e.g., in src/index.ts).
 */
export function initOtel(config: OtelConfig): NodeSDK {
  if (sdkInstance) {
    console.warn('[Otel] Already initialized, returning existing instance');
    return sdkInstance;
  }

  const exporter = config.traceExporter === 'otlp'
    ? new ConsoleSpanExporter() // Replace with OTLP exporter in production
    : new ConsoleSpanExporter();

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || process.env.npm_package_version || '0.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || process.env.NODE_ENV || 'development',
    }),
    traceExporter: exporter,
    metricReader: new PrometheusExporter({ port: config.metricsPort || 9464 }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new HttpInstrumentation(),
      new GrpcInstrumentation(),
    ],
  });

  sdk.start();
  sdkInstance = sdk;

  // Graceful shutdown
  process.on('SIGTERM', () => {
    sdk.shutdown().catch(console.error);
  });

  console.log(`[Otel] Initialized for ${config.serviceName} (env: ${config.environment})`);
  return sdk;
}

/**
 * Get current trace context for propagation (W3C TraceContext).
 * Use in MCP v2 handshake, HTTP headers, gRPC metadata.
 */
export function getTraceContext(): { traceparent?: string; tracestate?: string } {
  const { trace } = require('@opentelemetry/api');
  const span = trace.getActiveSpan();
  if (!span) return {};

  const spanContext = span.spanContext();
  return {
    traceparent: `00-${spanContext.traceId}-${spanContext.spanId}-01`,
    tracestate: undefined, // Add vendor-specific state if needed
  };
}

/**
 * Inject trace context into carrier (headers, metadata).
 */
export function injectTraceContext(carrier: Record<string, string>): void {
  const { propagation, trace } = require('@opentelemetry/api');
  const span = trace.getActiveSpan();
  if (!span) return;

  propagation.inject(trace.setSpan(require('@opentelemetry/api').context.active(), span), carrier);
}

/**
 * Extract trace context from carrier and create child span.
 */
export function extractTraceContext(carrier: Record<string, string>, name: string) {
  const { propagation, trace, context } = require('@opentelemetry/api');
  const extractedContext = propagation.extract(context.active(), carrier);
  return trace.getTracer('feature-skeleton').startSpan(name, undefined, extractedContext);
}