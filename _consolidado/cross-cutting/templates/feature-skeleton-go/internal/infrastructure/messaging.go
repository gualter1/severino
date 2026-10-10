// Package infrastructure — Messaging (Event Bus)
// ADR-027: Multi-language feature-skeleton (Go variant)
package infrastructure

import (
	"context"
	"sync"

	"github.com/severino/feature-skeleton-go/internal/domain"
)

// InMemoryEventBus — Simple in-memory event bus for development/testing
type InMemoryEventBus struct {
	mu       sync.RWMutex
	handlers map[string][]func(context.Context, domain.DomainEvent) error
}

func NewInMemoryEventBus() *InMemoryEventBus {
	return &InMemoryEventBus{
		handlers: make(map[string][]func(context.Context, domain.DomainEvent) error),
	}
}

func (b *InMemoryEventBus) Subscribe(eventName string, handler func(context.Context, domain.DomainEvent) error) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.handlers[eventName] = append(b.handlers[eventName], handler)
}

func (b *InMemoryEventBus) Publish(ctx context.Context, event domain.DomainEvent) error {
	b.mu.RLock()
	handlers := b.handlers[event.EventName()]
	b.mu.RUnlock()

	for _, handler := range handlers {
		if err := handler(ctx, event); err != nil {
			return err
		}
	}
	return nil
}

// EventPublisher interface compliance
var _ domain.EventPublisher = (*InMemoryEventBus)(nil)