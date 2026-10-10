# Async Store / Event Sourcing Template (ADR-002)

Canonical implementation of the **Async Store Pattern** combining Event Sourcing, CQRS (Command Query Responsibility Segregation), Transactional Outbox, Idempotency, Projections, and Real-time Subscriptions.

---

## Architecture Overview

```
[ Client / UI ]
       │
       ▼ (Command)
┌──────────────┐      Idempotency Check      ┌──────────────────┐
│  CommandBus  │ ──────────────────────────> │ IdempotencyStore │
└──────────────┘                             └──────────────────┘
       │ Validates & Authorizes
       ▼
┌──────────────┐
│ CommandHandler│
└──────────────┘
       │ Appends Events
       ▼
┌──────────────┐      Transaction Outbox     ┌──────────────────┐
│  EventStore  │ ──────────────────────────> │   OutboxStore    │
└──────────────┘                             └──────────────────┘
       │                                              │
       ├──────────────┐ (Async Replay)                ▼
       ▼              ▼                       [ Message Broker / SSE ]
┌──────────────┐┌──────────────┐
│  Snapshotter ││ Projection  │ ──────────────> [ Read Model DB ]
└──────────────┘└──────────────┘                       │
                                                      ▼ (Query)
                                             ┌──────────────────┐
                                             │   QueryHandler   │
                                             └──────────────────┘
```

---

## Features

1. **Append-Only Event Store**: Immutable event log ordered by sequence number and timestamp (`src/events/event-store.ts`).
2. **Projections & Read Models**: Asynchronous, replayable event projections with checkpoint tracking (`src/events/projection.ts`).
3. **Snapshot Strategy**: Performance optimization via periodic state snapshots and automatic rebuilds (`src/events/snapshot.ts`).
4. **Command Bus**: Pipeline featuring validation, authorization, and dispatching to appropriate command handlers (`src/commands/command-bus.ts`).
5. **Idempotency Middleware**: Request deduplication via Idempotency Keys across command pipelines (`src/middleware/idempotency.ts`).
6. **Transactional Outbox**: Reliable message dispatching to external brokers/subscribers without dual-write hazards (`src/middleware/outbox.ts`).
7. **Retry with Backoff**: Resilient execution handling transient failures (`src/middleware/retry.ts`).
8. **Real-time Subscriptions**: SSE/WebSocket manager for live event streaming to subscribers (`src/subscriptions/subscription-manager.ts`).

---

## When to Use

- High-throughput write workloads requiring complete audit trails and temporal query capabilities.
- Complex business domains where state transitions are as important as current state.
- Systems requiring CQRS to scale reads independently from writes.
- Distributed architectures demanding reliable message delivery via the Outbox pattern.

---

## Trade-offs

| Pros | Cons |
| :--- | :--- |
| Complete historical audit trail & replayability | Eventual consistency on read models |
| High write performance & decoupled CQRS | Event schema evolution complexity |
| Robust idempotency & outbox reliability | Steeper learning curve compared to CRUD |

---

## Cross-References

- **ADR-001**: Feature Packaging (modular boundary organization)
- **ADR-003**: Multi-Agent Integration (event stream consumers for agents)
- **ADR-014**: Structured Logging & Observability standards
