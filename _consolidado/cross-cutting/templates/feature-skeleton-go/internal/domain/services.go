// Package domain — Domain Services
// ADR-027: Multi-language feature-skeleton (Go variant)
package domain

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

var (
	ErrEntityNotFound = errors.New("entity not found")
	ErrInvalidState   = errors.New("invalid entity state for operation")
)

// SampleDomainService — Core domain logic
type SampleDomainService struct{}

func NewSampleDomainService() *SampleDomainService {
	return &SampleDomainService{}
}

// CreateSample — Domain logic for creating a sample entity
func (s *SampleDomainService) CreateSample(ctx context.Context, name string, metadata map[string]interface{}) (*SampleEntity, error) {
	if name == "" {
		return nil, errors.New("name is required")
	}

	entity := NewSampleEntity(name)
	entity.Metadata = metadata
	entity.CreatedAt = time.Now()
	entity.UpdatedAt = time.Now()

	return entity, nil
}

// ActivateSample — Domain logic for activating a sample entity
func (s *SampleDomainService) ActivateSample(ctx context.Context, entity *SampleEntity) error {
	if entity == nil {
		return ErrEntityNotFound
	}
	if entity.Status == "active" {
		return ErrInvalidState
	}
	if entity.Status == "archived" {
		return errors.New("cannot activate archived entity")
	}

	entity.Activate()
	return nil
}

// ValidateSample — Domain validation
func (s *SampleDomainService) ValidateSample(entity *SampleEntity) error {
	if entity == nil {
		return ErrEntityNotFound
	}
	if entity.Name == "" {
		return errors.New("name is required")
	}
	if entity.Status != "pending" && entity.Status != "active" && entity.Status != "archived" {
		return errors.New("invalid status")
	}
	return nil
}

// Domain Events
type DomainEvent interface {
	EventName() string
	AggregateID() string
	OccurredAt() time.Time
	Payload() interface{}
	CorrelationID() string
}

type SampleEntityCreatedEvent struct {
	eventName     string
	aggregateID   string
	occurredAt    time.Time
	payload       SampleEntityCreatedPayload
	correlationID string
}

type SampleEntityCreatedPayload struct {
	EntityID string `json:"entity_id"`
	Name     string `json:"name"`
}

func NewSampleEntityCreatedEvent(aggregateID, name, correlationID string) *SampleEntityCreatedEvent {
	return &SampleEntityCreatedEvent{
		eventName:     "feature.sample.created.v1",
		aggregateID:   aggregateID,
		occurredAt:    time.Now(),
		payload:       SampleEntityCreatedPayload{EntityID: aggregateID, Name: name},
		correlationID: correlationID,
	}
}

func (e *SampleEntityCreatedEvent) EventName() string      { return e.eventName }
func (e *SampleEntityCreatedEvent) AggregateID() string    { return e.aggregateID }
func (e *SampleEntityCreatedEvent) OccurredAt() time.Time  { return e.occurredAt }
func (e *SampleEntityCreatedEvent) Payload() interface{}   { return e.payload }
func (e *SampleEntityCreatedEvent) CorrelationID() string  { return e.correlationID }

type SampleEntityActivatedEvent struct {
	eventName     string
	aggregateID   string
	occurredAt    time.Time
	payload       SampleEntityActivatedPayload
	correlationID string
}

type SampleEntityActivatedPayload struct {
	EntityID       string `json:"entity_id"`
	PreviousStatus string `json:"previous_status"`
}

func NewSampleEntityActivatedEvent(aggregateID, previousStatus, correlationID string) *SampleEntityActivatedEvent {
	return &SampleEntityActivatedEvent{
		eventName:     "feature.sample.activated.v1",
		aggregateID:   aggregateID,
		occurredAt:    time.Now(),
		payload:       SampleEntityActivatedPayload{EntityID: aggregateID, PreviousStatus: previousStatus},
		correlationID: correlationID,
	}
}

func (e *SampleEntityActivatedEvent) EventName() string      { return e.eventName }
func (e *SampleEntityActivatedEvent) AggregateID() string    { return e.aggregateID }
func (e *SampleEntityActivatedEvent) OccurredAt() time.Time  { return e.occurredAt }
func (e *SampleEntityActivatedEvent) Payload() interface{}   { return e.payload }
func (e *SampleEntityActivatedEvent) CorrelationID() string  { return e.correlationID }

// Event Publisher Interface (implemented by infrastructure)
type EventPublisher interface {
	Publish(ctx context.Context, event DomainEvent) error
}