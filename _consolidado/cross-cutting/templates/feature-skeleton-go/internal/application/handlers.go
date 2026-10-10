// Package application — Command/Query Handlers
// ADR-027: Multi-language feature-skeleton (Go variant)
package application

import (
	"context"
	"errors"

	"github.com/severino/feature-skeleton-go/internal/domain"
	"github.com/severino/feature-skeleton-go/internal/infrastructure"
)

// Repository Interface (defined here, implemented in infrastructure)
type SampleRepository interface {
	Save(ctx context.Context, entity *domain.SampleEntity) error
	FindByID(ctx context.Context, id string) (*domain.SampleEntity, error)
	List(ctx context.Context, limit, offset int, status string) ([]*domain.SampleEntity, error)
}

// CreateSampleHandler
type CreateSampleHandler struct {
	repo       SampleRepository
	eventBus   infrastructure.EventPublisher
	domainSvc  *domain.SampleDomainService
}

func NewCreateSampleHandler(repo SampleRepository, eventBus infrastructure.EventPublisher, domainSvc *domain.SampleDomainService) *CreateSampleHandler {
	return &CreateSampleHandler{
		repo:      repo,
		eventBus:  eventBus,
		domainSvc: domainSvc,
	}
}

func (h *CreateSampleHandler) Handle(ctx context.Context, cmd Command) (interface{}, error) {
	createCmd, ok := cmd.(*CreateSampleCommand)
	if !ok {
		return nil, errors.New("invalid command type")
	}

	payload := createCmd.Payload.(CreateSampleCommandPayload)

	// Domain logic
	entity, err := h.domainSvc.CreateSample(ctx, payload.Name, payload.Metadata)
	if err != nil {
		return nil, err
	}

	// Persist
	if err := h.repo.Save(ctx, entity); err != nil {
		return nil, err
	}

	// Publish domain event
	event := domain.NewSampleEntityCreatedEvent(entity.ID, entity.Name, createCmd.CorrelationID())
	if err := h.eventBus.Publish(ctx, event); err != nil {
		// Log but don't fail the command
		// In production, this would go to a dead letter queue
	}

	return entity, nil
}

// ActivateSampleHandler
type ActivateSampleHandler struct {
	repo       SampleRepository
	eventBus   infrastructure.EventPublisher
	domainSvc  *domain.SampleDomainService
}

func NewActivateSampleHandler(repo SampleRepository, eventBus infrastructure.EventPublisher, domainSvc *domain.SampleDomainService) *ActivateSampleHandler {
	return &ActivateSampleHandler{
		repo:      repo,
		eventBus:  eventBus,
		domainSvc: domainSvc,
	}
}

func (h *ActivateSampleHandler) Handle(ctx context.Context, cmd Command) (interface{}, error) {
	activateCmd, ok := cmd.(*ActivateSampleCommand)
	if !ok {
		return nil, errors.New("invalid command type")
	}

	payload := activateCmd.Payload.(ActivateSampleCommandPayload)

	// Find entity
	entity, err := h.repo.FindByID(ctx, payload.EntityID)
	if err != nil {
		return nil, err
	}
	if entity == nil {
		return nil, domain.ErrEntityNotFound
	}

	// Domain logic
	if err := h.domainSvc.ActivateSample(ctx, entity); err != nil {
		return nil, err
	}

	// Persist
	if err := h.repo.Save(ctx, entity); err != nil {
		return nil, err
	}

	// Publish domain event
	event := domain.NewSampleEntityActivatedEvent(entity.ID, "pending", activateCmd.CorrelationID())
	if err := h.eventBus.Publish(ctx, event); err != nil {
		// Log but don't fail
	}

	return nil, nil
}

// SampleQueryHandler
type SampleQueryHandler struct {
	repo SampleRepository
}

func NewSampleQueryHandler(repo SampleRepository) *SampleQueryHandler {
	return &SampleQueryHandler{repo: repo}
}

func (h *SampleQueryHandler) Handle(ctx context.Context, query Query) (interface{}, error) {
	switch q := query.(type) {
	case *GetSampleQuery:
		payload := q.Payload.(GetSampleQueryPayload)
		return h.repo.FindByID(ctx, payload.EntityID)
	case *ListSamplesQuery:
		payload := q.Payload.(ListSamplesQueryPayload)
		return h.repo.List(ctx, payload.Limit, payload.Offset, payload.Status)
	default:
		return nil, errors.New("unknown query type")
	}
}