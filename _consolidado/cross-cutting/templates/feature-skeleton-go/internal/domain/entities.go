// Package domain — Core business logic, zero external dependencies
// ADR-027: Multi-language feature-skeleton (Go variant)
package domain

import (
	"time"

	"github.com/google/uuid"
)

// Entity — Base entity with ID and timestamps
type Entity struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func NewEntity() Entity {
	now := time.Now()
	return Entity{
		ID:        uuid.New().String(),
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// SampleEntity — Example domain entity
type SampleEntity struct {
	Entity
	Name     string                 `json:"name" validate:"required,min=1,max=255"`
	Status   string                 `json:"status" validate:"oneof=pending active archived"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

func NewSampleEntity(name string) *SampleEntity {
	return &SampleEntity{
		Entity:   NewEntity(),
		Name:     name,
		Status:   "pending",
		Metadata: make(map[string]interface{}),
	}
}

func (e *SampleEntity) Activate() {
	e.Status = "active"
	e.UpdatedAt = time.Now()
}

func (e *SampleEntity) Archive() {
	e.Status = "archived"
	e.UpdatedAt = time.Now()
}