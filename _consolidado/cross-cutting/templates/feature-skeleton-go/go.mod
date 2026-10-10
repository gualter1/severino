module github.com/severino/feature-skeleton-go

go 1.22

require (
	github.com/gin-gonic/gin v1.9.1
	github.com/go-playground/validator/v10 v10.16.0
	github.com/rs/zerolog v1.32.0
	github.com/google/uuid v1.5.0
	github.com/spf13/cobra v1.8.0
	github.com/spf13/viper v1.18.0
	go.opentelemetry.io/otel v1.21.0
	go.opentelemetry.io/otel/exporters/prometheus v0.45.0
	go.opentelemetry.io/otel/exporters/stdout/stdouttrace v1.21.0
	go.opentelemetry.io/otel/sdk v1.21.0
	go.opentelemetry.io/otel/sdk/metric v1.21.0
	go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp v0.46.0
	go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc v0.46.0
	gopkg.in/yaml.v3 v3.0.1
)