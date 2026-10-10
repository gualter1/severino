# 📡 Severino Core API Documentation

Base URL: `http://localhost:3000`

## Authentication
Currently no authentication required for local development. For production, deploy behind reverse proxy with auth.

---

## Health & System

### GET /health
```json
{
  "status": "ok",
  "timestamp": "2026-10-10T19:30:00.000Z"
}
```

### GET /model/models
```json
{
  "models": ["anthropic/claude-3.5-sonnet", "openai/gpt-4o", "..."]
}
```

### GET /adapters
```json
{
  "adapters": [
    {"name": "telegram", "status": "running", "error": null},
    {"name": "whatsapp", "status": "stopped", "error": "not configured"}
  ]
}
```

---

## Teams

### GET /teams
```json
{
  "teams": [
    {
      "teamId": "sales-team-001",
      "name": "Sales Outbound",
      "domain": "sales",
      "robotIds": ["robot-sales-team-001-backend-1", "..."],
      "status": "active",
      "totalTasksCompleted": 42
    }
  ]
}
```

### GET /teams/:teamId
```json
{
  "teamId": "sales-team-001",
  "name": "Sales Outbound",
  "domain": "sales",
  "robotIds": [...],
  "status": "active",
  "totalTasksCompleted": 42
}
```

### POST /teams
```json
// Request
{
  "teamId": "sales-team-001",
  "name": "Sales Outbound",
  "domain": "sales",
  "roles": ["backend", "qa", "devops"]
}

// Response
{
  "success": true,
  "teamId": "sales-team-001",
  "robots": [
    {"robotId": "robot-sales-team-001-backend-1", "role": "backend", "teamId": "sales-team-001", "name": "Sales Outbound backend", "roomDir": "...", "capabilities": [...], "status": "idle"}
  ]
}
```

### GET /robots
```json
{
  "robots": [
    {"robotId": "robot-1", "role": "backend", "teamId": "team-1", "status": "idle", "capabilities": ["typescript", "fastify"]}
  ]
}
```

---

## Tasks

### POST /tasks
Execute a task. Can run ad-hoc (creates temporary robot) or on existing team.

```json
// Request (ad-hoc)
{
  "domain": "backend",
  "objective": "Create REST endpoint for user authentication",
  "robotId": "optional-existing-robot-id"
}

// Request (team)
{
  "domain": "backend",
  "objective": "Refactor authentication module",
  "teamId": "backend-team-001"
}

// Response
{
  "taskId": "task-123",
  "robotId": "robot-backend-1",
  "teamId": "backend-team-001",
  "status": "completed",
  "reportSummary": "Created POST /auth/login with JWT...",
  "result": {"filesCreated": ["src/routes/auth.ts"], "testsPassed": true},
  "metrics": {
    "durationMs": 15420,
    "contextVersion": 3,
    "tokensUsed": 8234
  }
}
```

---

## Skills

### GET /skills
```json
{
  "skills": [
    {
      "name": "code-review",
      "type": "tool",
      "description": "Performs automated code review",
      "trigger": "review-code",
      "domain": "backend",
      "version": "1.0.0",
      "status": "available",
      "config": {}
    }
  ]
}
```

### POST /skills
```json
// Request
{
  "name": "stripe-webhook",
  "type": "integration",
  "description": "Handles Stripe webhook events",
  "trigger": "stripe-webhook",
  "domain": "backend",
  "version": "1.0.0",
  "config": {"events": ["payment_intent.succeeded", "invoice.paid"]}
}

// Response
{"success": true, "skill": {...}}
```

### POST /skills/:name/assign/:robotId
```json
{"success": true}
```

---

## Resources (Porteiro)

### GET /resources
```json
{
  "resources": [
    {
      "resourceId": "skill:code-review",
      "name": "code-review",
      "type": "skill",
      "description": "Performs automated code review",
      "status": "checked-out",
      "checkedOutBy": {
        "robotId": "robot-1",
        "token": "abc123...",
        "expiresAt": "2026-10-10T20:30:00.000Z"
      },
      "metadata": {"trigger": "review-code", "domain": "backend"}
    }
  ]
}
```

### POST /resources/checkout
```json
// Request
{
  "resourceId": "skill:code-review",
  "robotId": "robot-backend-1",
  "teamId": "backend-team",
  "ttlMs": 3600000
}

// Response
{
  "success": true,
  "token": "a1b2c3d4.sha256signature",
  "expiresAt": "2026-10-10T20:30:00.000Z",
  "resource": {...}
}
```

### POST /resources/checkin
```json
// Request
{"token": "a1b2c3d4.sha256signature"}

// Response
{"success": true}
```

### POST /resources/validate
```json
// Request
{"token": "a1b2c3d4.sha256signature"}

// Response
{
  "valid": true,
  "resourceToken": {
    "token": "a1b2c3d4.sha256signature",
    "resourceId": "skill:code-review",
    "resourceType": "skill",
    "robotId": "robot-backend-1",
    "teamId": "backend-team",
    "issuedAt": "2026-10-10T19:30:00.000Z",
    "expiresAt": "2026-10-10T20:30:00.000Z",
    "scope": ["read", "execute"]
  }
}
```

---

## Learning Contexts

### GET /learning/contexts
```json
{
  "contexts": [
    {
      "domain": "backend",
      "taskSignature": "create-rest-api",
      "version": 5,
      "patterns": [...],
      "traps": [...],
      "shortcuts": [...],
      "metrics": {
        "reportsAbsorbed": 47,
        "avgTimeWithContextMs": 1200,
        "avgTimeWithoutContextMs": 11280,
        "successRateWithContext": 0.94,
        "successRateWithoutContext": 0.67
      },
      "updatedAt": "2026-10-10T18:00:00.000Z"
    }
  ]
}
```

### GET /learning/contexts/:domain/:signature
Returns single context object.

---

## Model Router

### POST /model/complete
```json
// Request
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "How to implement JWT in Fastify?"}
  ],
  "options": {"temperature": 0.3, "maxTokens": 2048}
}

// Response
{
  "content": "To implement JWT in Fastify...",
  "usage": {"promptTokens": 150, "completionTokens": 800, "totalTokens": 950},
  "model": "anthropic/claude-3.5-sonnet"
}
```

### GET /model/models
See Health section.

---

## Grill Me

### POST /grill-me
```json
// Request (run now)
{
  "topic": "API Design Patterns Review",
  "runNow": true
}

// Request (schedule)
{
  "topic": "Weekly Alignment",
  "runNow": false
}

// Response
{
  "success": true,
  "session": {
    "id": "grill-1234567890-abc123",
    "topic": "API Design Patterns Review",
    "scheduledAt": "2026-10-10T19:30:00.000Z",
    "status": "completed",
    "completedAt": "2026-10-10T19:30:05.000Z",
    "summary": "Identified 3 key patterns...",
    "insights": ["Use Zod for validation", "Standardize error responses"],
    "actionItems": ["Create validation middleware", "Document error codes"],
    "recommendations": [...]
  }
}
```

### GET /grill
```json
{
  "sessions": [
    {"id": "grill-1", "topic": "API Design", "scheduledAt": "...", "status": "completed", "summary": "..."}
  ]
}
```

### GET /grill/:sessionId
Returns single session object.

---

## WebSocket

### Connect
```
ws://localhost:3000/ws
```

### Messages

**Ping/Pong**
```json
// Client -> Server
{"type": "ping"}
// Server -> Client
{"type": "pong", "timestamp": 1697000000000}
```

**Execute Task**
```json
// Client -> Server
{
  "type": "task",
  "robotId": "robot-backend-1",
  "task": {
    "id": "task-123",
    "domain": "backend",
    "objective": "Create endpoint",
    "teamId": "backend-team"
  }
}

// Server -> Client
{
  "type": "task-result",
  "response": {
    "taskId": "task-123",
    "status": "completed",
    ...
  }
}
```

**Error**
```json
{"type": "error", "message": "Robot not found"}
```

---

## Error Responses

All endpoints return consistent error format:
```json
{
  "message": "Descriptive error message",
  "error": "ErrorType",
  "statusCode": 400
}
```

Common codes:
- `400` — Bad Request (validation failed)
- `404` — Not Found (team, robot, resource, session)
- `409` — Conflict (resource already checked out)
- `500` — Internal Server Error

---

## Rate Limits
No built-in rate limiting. Implement at reverse proxy level for production.
