// Package application — Commands (intent to change state)
// ADR-027: Multi-language feature-skeleton (Go variant)
package application

import (
	"context"

	"github.com/google/uuid"
	"github.com/severino/feature-skeleton-go/internal/domain"
)

// Command — Base command interface
type Command interface {
	CommandName() string
	Payload() interface{}
	CorrelationID() string
}

// CreateSampleCommand
type CreateSampleCommand struct {
	commandName   string
	payload       CreateSampleCommandPayload
	correlationID string
}

type CreateSampleCommandPayload struct {
	Name     string                 `json:"name" validate:"required,min=1,max=255"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

func NewCreateSampleCommand(payload CreateSampleCommandPayload) *CreateSampleCommand {
	return &CreateSampleCommand{
		commandName:   "feature.sample.create",
		payload:       payload,
		correlationID: uuid.New().String(),
	}
}

func (c *CreateSampleCommand) CommandName() string   { return c.commandName }
func (c *CreateSampleCommand) Payload() interface{}  { return c.payload }
func (c *CreateSampleCommand) CorrelationID() string { return c.correlationID }

// ActivateSampleCommand
type ActivateSampleCommand struct {
	commandName   string
	payload       ActivateSampleCommandPayload
	correlationID string
}

type ActivateSampleCommandPayload struct {
	EntityID string `json:"entity_id" validate:"required"`
}

func NewActivateSampleCommand(payload ActivateSampleCommandPayload) *ActivateSampleCommand {
	return &ActivateSampleCommand{
		commandName:   "feature.sample.activate",
		payload:       payload,
		correlationID: uuid.New().String(),
	}
}

func (c *ActivateSampleCommand) CommandName() string   { return c.commandName }
func (c *ActivateSampleCommand) Payload() interface{}  { return c.payload }
func (c *ActivateSampleCommand) CorrelationID() string { return c.correlationID }

// Command Handler Interface
type CommandHandler interface {
	Handle(ctx context.Context, cmd Command) (interface{}, error)
}