// Package observability — OpenTelemetry + JSONL Audit Logger (ADR-030)
// ADR-027: Multi-language feature-skeleton (Go variant)
package observability

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sync"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/prometheus"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

type OtelConfig struct {
	ServiceName    string
	ServiceVersion string
	Environment    string
	MetricsPort    int
}

type AuditEventType string

const (
	EventToolCall     AuditEventType = "tool_call"
	EventAgentStart   AuditEventType = "agent_start"
	EventAgentEnd     AuditEventType = "agent_end"
	EventHandoff      AuditEventType = "handoff"
	EventSecurity     AuditEventType = "security_event"
)

type AuditEvent struct {
	Timestamp  string         `json:"timestamp"`
	Level      string         `json:"level"`
	Service    string         `json:"service"`
	TraceID    string         `json:"trace_id,omitempty"`
	SpanID     string         `json:"span_id,omitempty"`
	AgentID    string         `json:"agent_id"`
	Event      AuditEventType `json:"event"`
	Sanitized  bool           `json:"sanitized"`

	// Tool call fields
	Tool         string `json:"tool,omitempty"`
	DurationMs   int64  `json:"duration_ms,omitempty"`
	InputHash    string `json:"input_hash,omitempty"`
	OutputHash   string `json:"output_hash,omitempty"`
	Status       string `json:"status,omitempty"`
	TokensInput  int    `json:"tokens_input,omitempty"`
	TokensOutput int    `json:"tokens_output,omitempty"`
	CostUSD      float64 `json:"cost_usd,omitempty"`
	Error        string `json:"error,omitempty"`

	// Lifecycle fields
	FromAgent string `json:"from_agent,omitempty"`
	ToAgent   string `json:"to_agent,omitempty"`
	Reason    string `json:"reason,omitempty"`

	// Security fields
	SecurityType string                 `json:"security_type,omitempty"`
	Details      map[string]interface{} `json:"details,omitempty"`
}

var piiPatterns = []*regexp.Regexp{
	regexp.MustCompile(`\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b`),
	regexp.MustCompile(`\b\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}\b`),
	regexp.MustCompile(`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`),
	regexp.MustCompile(`\b(?:\+55\s?)?(?:\(\d{2}\)\s?)?\d{4,5}-?\d{4}\b`),
	regexp.MustCompile(`\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b`),
	regexp.MustCompile(`(?i)(password|secret|token|api[_-]?key|auth[_-]?token)\s*[:=]\s*\S+`),
	regexp.MustCompile(`Bearer\s+[A-Za-z0-9\-_.]+`),
}

func sanitize(obj interface{}) interface{} {
	data, _ := json.Marshal(obj)
	str := string(data)
	for _, pattern := range piiPatterns {
		str = pattern.ReplaceAllString(str, "[REDACTED]")
	}
	var result interface{}
	json.Unmarshal([]byte(str), &result)
	return result
}

func hash(input string) string {
	h := sha256.Sum256([]byte(input))
	return "sha256:" + hex.EncodeToString(h[:])[:8]
}

// AuditLogger — JSONL audit logger with PII sanitization + trace correlation
type AuditLogger struct {
	mu         sync.Mutex
	file       *os.File
	serviceName string
	agentVersion string
}

func NewAuditLogger(serviceName, logDir, agentVersion string) (*AuditLogger, error) {
	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, err
	}
	logPath := filepath.Join(logDir, "audit.log")
	f, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return nil, err
	}
	return &AuditLogger{
		file:         f,
		serviceName:  serviceName,
		agentVersion: agentVersion,
	}, nil
}

func (l *AuditLogger) write(event AuditEvent) {
	l.mu.Lock()
	defer l.mu.Unlock()

	// Get trace context from OpenTelemetry
	span := otel.Tracer(l.serviceName).StartSpan("audit")
	defer span.End()
	spanCtx := span.SpanContext()

	event.Timestamp = time.Now().UTC().Format(time.RFC3339)
	event.Service = l.serviceName
	event.AgentID = fmt.Sprintf("%s@%s", l.serviceName, l.agentVersion)
	event.TraceID = spanCtx.TraceID().String()
	event.SpanID = spanCtx.SpanID().String()
	event.Sanitized = true

	data, _ := json.Marshal(event)
	l.file.Write(append(data, '\n'))
}

func (l *AuditLogger) ToolCall(tool string, input, output interface{}, durationMs int64, status string, err error) {
	sanitizedInput := sanitize(input)
	sanitizedOutput := sanitize(output)

	event := AuditEvent{
		Level:       "INFO",
		Event:       EventToolCall,
		Tool:        tool,
		DurationMs:  durationMs,
		InputHash:   hash(fmt.Sprintf("%v", sanitizedInput)),
		OutputHash:  hash(fmt.Sprintf("%v", sanitizedOutput)),
		Status:      status,
	}
	if err != nil {
		event.Error = err.Error()
		event.Status = "error"
	}
	l.write(event)
}

func (l *AuditLogger) AgentStart(reason string) {
	l.write(AuditEvent{Level: "INFO", Event: EventAgentStart, Reason: reason})
}

func (l *AuditLogger) AgentEnd(reason string) {
	l.write(AuditEvent{Level: "INFO", Event: EventAgentEnd, Reason: reason})
}

func (l *AuditLogger) Handoff(fromAgent, toAgent, reason string) {
	l.write(AuditEvent{Level: "INFO", Event: EventHandoff, FromAgent: fromAgent, ToAgent: toAgent, Reason: reason})
}

func (l *AuditLogger) SecurityEvent(secType string, details map[string]interface{}) {
	l.write(AuditEvent{Level: "WARN", Event: EventSecurity, SecurityType: secType, Details: sanitize(details)})
}

func (l *AuditLogger) Close() error {
	return l.file.Close()
}

// InitOtel initializes OpenTelemetry SDK with Prometheus exporter
func InitOtel(config OtelConfig) (func(context.Context) error, error) {
	// Resource
	res, err := resource.New(context.Background(),
		resource.WithAttributes(
			semconv.ServiceName(config.ServiceName),
			semconv.ServiceVersion(config.ServiceVersion),
			semconv.DeploymentEnvironment(config.Environment),
		),
	)
	if err != nil {
		return nil, err
	}

	// Trace exporter (stdout for dev, OTLP for prod)
	traceExporter, err := stdouttrace.New(stdouttrace.WithPrettyPrint())
	if err != nil {
		return nil, err
	}

	// Metric exporter (Prometheus)
	promExporter, err := prometheus.New(prometheus.WithNamespace(config.ServiceName))
	if err != nil {
		return nil, err
	}

	// Tracer provider
	tp := trace.NewTracerProvider(
		trace.WithBatcher(traceExporter),
		trace.WithResource(res),
	)
	otel.SetTracerProvider(tp)

	// Meter provider
	mp := metric.NewMeterProvider(
		metric.WithReader(promExporter),
		metric.WithResource(res),
	)
	otel.SetMeterProvider(mp)

	// Propagator (W3C TraceContext)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	return tp.Shutdown, nil
}

// GetTraceContext returns W3C TraceContext headers for propagation
func GetTraceContext() (traceparent, tracestate string) {
	span := otel.Tracer("feature-skeleton").StartSpan("get-trace-context")
	defer span.End()
	ctx := span.SpanContext()

	return fmt.Sprintf("00-%s-%s-01", ctx.TraceID().String(), ctx.SpanID().String()), ""
}

// InjectTraceContext injects trace context into carrier
func InjectTraceContext(carrier propagation.MapCarrier) {
	otel.GetTextMapPropagator().Inject(context.Background(), carrier)
}

// ExtractTraceContext extracts trace context from carrier and creates child span
func ExtractTraceContext(carrier propagation.MapCarrier, name string) (context.Context, trace.Span) {
	ctx := otel.GetTextMapPropagator().Extract(context.Background(), carrier)
	return otel.Tracer("feature-skeleton").Start(ctx, name)
}