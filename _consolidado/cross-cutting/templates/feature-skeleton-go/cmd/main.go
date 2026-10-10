// Package main — Entry point for feature-skeleton-go
// ADR-027: Multi-language feature-skeleton (Go variant)
package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"

	"github.com/severino/feature-skeleton-go/internal/application"
	"github.com/severino/feature-skeleton-go/internal/domain"
	"github.com/severino/feature-skeleton-go/internal/infrastructure"
	"github.com/severino/feature-skeleton-go/internal/infrastructure/observability"
	"github.com/severino/feature-skeleton-go/internal/interfaces/http"
)

func main() {
	// Initialize config
	initConfig()

	// Initialize logger
	initLogger()

	// Initialize OpenTelemetry (ADR-030)
	otelShutdown := observability.InitOtel(observability.OtelConfig{
		ServiceName:    "feature-skeleton-go",
		ServiceVersion: "2.0.0",
		Environment:    viper.GetString("ENVIRONMENT"),
		MetricsPort:    viper.GetInt("METRICS_PORT"),
	})
	defer otelShutdown(context.Background())

	// Initialize audit logger (ADR-030)
	auditLogger := observability.NewAuditLogger("feature-skeleton-go", "logs", "2.0.0")
	defer auditLogger.Close()

	// Log startup
	auditLogger.AgentStart("Application starting")

	// Initialize domain layer
	domainService := domain.NewSampleDomainService()

	// Initialize infrastructure layer
	repo := infrastructure.NewPostgresSampleRepository()
	eventBus := infrastructure.NewInMemoryEventBus()

	// Initialize application layer
	createHandler := application.NewCreateSampleHandler(repo, eventBus, domainService)
	activateHandler := application.NewActivateSampleHandler(repo, eventBus, domainService)
	queryHandler := application.NewSampleQueryHandler(repo)

	// Initialize HTTP server
	router := gin.Default()
	http.RegisterRoutes(router, createHandler, activateHandler, queryHandler)

	// Start server
	port := viper.GetString("PORT")
	if port == "" {
		port = "8080"
	}

	serverAddr := ":" + port
	log.Info().Str("addr", serverAddr).Msg("Starting HTTP server")

	// Graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		if err := router.Run(serverAddr); err != nil && err != context.Canceled {
			log.Fatal().Err(err).Msg("Server error")
		}
	}()

	<-ctx.Done()
	stop()
	log.Info().Msg("Shutting down gracefully...")

	// Give time for in-flight requests
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	auditLogger.AgentEnd("Application stopped")
	_ = shutdownCtx
}

func initConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")
	viper.AutomaticEnv()

	// Defaults
	viper.SetDefault("PORT", "8080")
	viper.SetDefault("ENVIRONMENT", "development")
	viper.SetDefault("METRICS_PORT", 9464)
	viper.SetDefault("LOG_LEVEL", "info")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			log.Warn().Err(err).Msg("Config file not found, using defaults")
		}
	}
}

func initLogger() {
	level, err := zerolog.ParseLevel(viper.GetString("LOG_LEVEL"))
	if err != nil {
		level = zerolog.InfoLevel
	}
	zerolog.SetGlobalLevel(level)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}