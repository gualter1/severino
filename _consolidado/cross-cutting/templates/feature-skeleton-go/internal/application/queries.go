// Package application — Queries (read operations)
// ADR-027: Multi-language feature-skeleton (Go variant)
package application

import (
	"context"

	"github.com/google/uuid"
)

// Query — Base query interface
type Query interface {
	QueryName() string
	Payload() interface{}
	CorrelationID() string
}

// GetSampleQuery
type GetSampleQuery struct {
	queryName     string
	payload       GetSampleQueryPayload
	correlationID string
}

type GetSampleQueryPayload struct {
	EntityID string `json:"entity_id" validate:"required"`
}

func NewGetSampleQuery(payload GetSampleQueryPayload) *GetSampleQuery {
	return &GetSampleQuery{
		queryName:     "feature.sample.get",
		payload:       payload,
		correlationID: uuid.New().String(),
	}
}

func (q *GetSampleQuery) QueryName() string   { return q.queryName }
func (q *GetSampleQuery) Payload() interface{} { return q.payload }
func (q *GetSampleQuery) CorrelationID() string { return q.correlationID }

// ListSamplesQuery
type ListSamplesQuery struct {
	queryName     string
	payload       ListSamplesQueryPayload
	correlationID string
}

type ListSamplesQueryPayload struct {
	Limit  int    `json:"limit" validate:"min=1,max=100"`
	Offset int    `json:"offset" validate:"min=0"`
	Status string `json:"status,omitempty" validate:"omitempty,oneof=pending active archived"`
}

func NewListSamplesQuery(payload ListSamplesQueryPayload) *ListSamplesQuery {
	if payload.Limit == 0 {
		payload.Limit = 20
	}
	return &ListSamplesQuery{
		queryName:     "feature.sample.list",
		payload:       payload,
		correlationID: uuid.New().String(),
	}
}

func (q *ListSamplesQuery) QueryName() string   { return q.queryName }
func (q *ListSamplesQuery) Payload() interface{} { return q.payload }
func (q *ListSamplesQuery) CorrelationID() string { return q.correlationID }

// Query Handler Interface
type QueryHandler interface {
	Handle(ctx context.Context, query Query) (interface{}, error)
}