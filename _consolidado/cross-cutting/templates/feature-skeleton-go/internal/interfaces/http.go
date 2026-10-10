// Package http — HTTP interface (Gin)
// ADR-027: Multi-language feature-skeleton (Go variant)
package http

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/severino/feature-skeleton-go/internal/application"
	"github.com/severino/feature-skeleton-go/internal/infrastructure/observability"
)

// SampleController — HTTP handlers for sample feature
type SampleController struct {
	createHandler  *application.CreateSampleHandler
	activateHandler *application.ActivateSampleHandler
	queryHandler   *application.SampleQueryHandler
	auditLogger    *observability.AuditLogger
}

func NewSampleController(
	createHandler *application.CreateSampleHandler,
	activateHandler *application.ActivateSampleHandler,
	queryHandler *application.SampleQueryHandler,
	auditLogger *observability.AuditLogger,
) *SampleController {
	return &SampleController{
		createHandler:    createHandler,
		activateHandler:  activateHandler,
		queryHandler:     queryHandler,
		auditLogger:      auditLogger,
	}
}

func (c *SampleController) CreateSample(ctx *gin.Context) {
	start := time.Now()
	var req struct {
		Name     string                 `json:"name" binding:"required,min=1,max=255"`
		Metadata map[string]interface{} `json:"metadata,omitempty"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := application.NewCreateSampleCommand(application.CreateSampleCommandPayload{
		Name:     req.Name,
		Metadata: req.Metadata,
	})

	result, err := c.createHandler.Handle(ctx.Request.Context(), cmd)
	duration := time.Since(start).Milliseconds()

	if err != nil {
		c.auditLogger.ToolCall("feature.sample.create", req, nil, duration, "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.auditLogger.ToolCall("feature.sample.create", req, result, duration, "success", nil)
	ctx.JSON(http.StatusCreated, result)
}

func (c *SampleController) ActivateSample(ctx *gin.Context) {
	start := time.Now()
	var req struct {
		EntityID string `json:"entity_id" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := application.NewActivateSampleCommand(application.ActivateSampleCommandPayload{
		EntityID: req.EntityID,
	})

	_, err := c.activateHandler.Handle(ctx.Request.Context(), cmd)
	duration := time.Since(start).Milliseconds()

	if err != nil {
		c.auditLogger.ToolCall("feature.sample.activate", req, nil, duration, "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.auditLogger.ToolCall("feature.sample.activate", req, gin.H{"status": "activated"}, duration, "success", nil)
	ctx.JSON(http.StatusOK, gin.H{"status": "activated"})
}

func (c *SampleController) GetSample(ctx *gin.Context) {
	entityID := ctx.Param("id")
	if entityID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "entity_id required"})
		return
	}

	query := application.NewGetSampleQuery(application.GetSampleQueryPayload{EntityID: entityID})
	result, err := c.queryHandler.Handle(ctx.Request.Context(), query)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if result == nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *SampleController) ListSamples(ctx *gin.Context) {
	limit := 20
	offset := 0
	status := ctx.Query("status")

	query := application.NewListSamplesQuery(application.ListSamplesQueryPayload{
		Limit:  limit,
		Offset: offset,
		Status: status,
	})

	result, err := c.queryHandler.Handle(ctx.Request.Context(), query)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

// RegisterRoutes registers all HTTP routes
func RegisterRoutes(router *gin.Engine, createHandler *application.CreateSampleHandler, activateHandler *application.ActivateSampleHandler, queryHandler *application.SampleQueryHandler) {
	// Initialize audit logger
	auditLogger, err := observability.NewAuditLogger("feature-skeleton-go", "logs", "2.0.0")
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to init audit logger")
	}

	controller := NewSampleController(createHandler, activateHandler, queryHandler, auditLogger)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "feature-skeleton-go"})
	})

	// Metrics endpoint (Prometheus)
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API routes
	api := router.Group("/api/v1")
	{
		api.POST("/samples", controller.CreateSample)
		api.POST("/samples/activate", controller.ActivateSample)
		api.GET("/samples/:id", controller.GetSample)
		api.GET("/samples", controller.ListSamples)
	}
}