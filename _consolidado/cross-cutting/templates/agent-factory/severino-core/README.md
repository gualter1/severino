# 🏭 Severino Master — AI Agent Platform

Orchestration engine connecting 9router model router, HTTP/WebSocket/Telegram/WhatsApp comms, micro-agents, and resource broker to enable persistent teams with learning loops.

## 🎯 Overview

Severino Master is a platform for building and managing persistent AI agent teams. It provides:

- **Model Router** — Pluggable 9router integration with fallback support
- **Robot Factory** — Creates isolated agent rooms with `agent.json` + `instructions.md`
- **Learning Loop** — Report-based knowledge absorption (tested 9.4x speedup T1→T10)
- **Resource Broker** — Secure checkout/checkin of skills, MCPs, tools via JWT tokens
- **Communication Adapters** — HTTP API, WebSocket, Telegram Bot, WhatsApp (via whatsapp-web.js)
- **Grill Me Scheduler** — Periodic alignment consuming accumulated contexts

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SEVERINO MASTER CORE                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Robot Factory│  │ Skill Manager│  │Learning Eng. │  │  Reporter  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                 │                 │                 │         │
│         └─────────────────┼─────────────────┼─────────────────┘         │
│                           ▼                 ▼                           │
│                  ┌──────────────────────────────────┐                   │
│                  │      RESOURCE BROKER (Porteiro)  │                   │
│                  │  checkout/checkin skills/MCPs    │                   │
│                  │  via short-lived HMAC tokens     │                   │
│                  └──────────────────┬───────────────┘                   │
│                                     │                                   │
├─────────────────────────────────────┼───────────────────────────────────┤
│  COMMUNICATION LAYER                │                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────▼──────┐  ┌──────────┐             │
│  │HTTP API  │  │WebSocket │  │ Telegram Bot│  │ WhatsApp │             │
│  └──────────┘  └──────────┘  └─────────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation
```bash
cd severino-core
npm install
```

### Configuration
Copy `.env.example` to `.env` and configure:

```env
# 9router (optional - runs in mock mode without)
NINEROUTER_API_KEY=sk-xxxx
NINEROUTER_BASE_URL=https://api.9router.com/v1
DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# Communication Adapters
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
WHATSAPP_SESSION_PATH=./whatsapp-session

# Server
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# Storage
ROOMS_DIR=./rooms
TEMPLATES_DIR=../templates
```

### Run
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### Access Dashboard
Open http://localhost:3000/ui/

## 📚 API Reference

### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/model/models` | List available models |
| GET | `/adapters` | Communication adapters status |

### Teams & Robots
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams` | List all teams |
| GET | `/teams/:teamId` | Get team details |
| POST | `/teams` | Create new team |
| GET | `/robots` | List all robots |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Execute task (ad-hoc or team) |
| GET | `/tasks/:taskId` | Get task result |

### Skills & Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skills` | List skills |
| POST | `/skills` | Register skill |
| POST | `/skills/:name/assign/:robotId` | Assign skill to robot |
| GET | `/resources` | List all resources |
| POST | `/resources/checkout` | Checkout resource (returns token) |
| POST | `/resources/checkin` | Checkin resource (requires token) |
| POST | `/resources/validate` | Validate token |

### Learning
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/learning/contexts` | List curated contexts |
| GET | `/learning/contexts/:domain/:signature` | Get specific context |

### Grill Me
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/grill-me` | Schedule or run Grill Me session |
| GET | `/grill` | List all Grill Me sessions |
| GET | `/grill/:sessionId` | Get session details |

### WebSocket
Connect to `ws://localhost:3000/ws` for real-time updates.

```json
// Ping
{"type": "ping"}

// Execute task
{"type": "task", "robotId": "robot-1", "task": {...}}

// Response
{"type": "task-result", "response": {...}}
```

## 🤖 Communication Adapters

### Telegram
1. Create bot via @BotFather
2. Set `TELEGRAM_BOT_TOKEN` in `.env`
3. Bot commands:
   - `/help` — Show commands
   - `/status` — System status
   - `/teams` — List teams
   - `/task <objective>` — Execute task
   - `/task @teamId <objective>` — Execute in team
   - `/model <question>` — Ask model directly
   - `/grill <topic>` — Schedule Grill Me

### WhatsApp
1. Set `WHATSAPP_SESSION_PATH` in `.env`
2. First run generates QR code — scan with phone
3. Same commands as Telegram

## 🔐 Resource Broker (Porteiro)

The Porteiro manages concurrent access to skills, MCPs, tools, and sandboxes.

### Checkout Flow
```bash
POST /resources/checkout
{
  "resourceId": "skill:code-review",
  "robotId": "robot-backend-1",
  "teamId": "backend-team",
  "ttlMs": 3600000  # 1 hour default
}
```

Response:
```json
{
  "success": true,
  "token": "abc123.sha256signature",
  "expiresAt": "2026-10-10T20:30:00.000Z",
  "resource": { ... }
}
```

### Checkin Flow
```bash
POST /resources/checkin
{
  "token": "abc123.sha256signature"
}
```

### Token Validation
```bash
POST /resources/validate
{
  "token": "abc123.sha256signature"
}
```

Tokens are HMAC-SHA256 signed with server secret, containing: `resourceId`, `robotId`, `teamId`, `issuedAt`, `expiresAt`, `scope[]`.

## 🧠 Learning Loop

Severino implements a **report-based learning loop**:

1. **Robot executes task** → Generates execution report (JSON)
2. **Reporter formats report** → Extracts patterns, traps, shortcuts
3. **Learning Engine absorbs** → Updates curated contexts per domain/task signature
4. **Next task** → Context injected via `buildContextForRobot()`
5. **Speedup achieved** → Measured: 9.4x T1→T10 in tests

### Curated Context Structure
```json
{
  "domain": "backend",
  "taskSignature": "create-rest-api",
  "version": 3,
  "patterns": [{"pattern": "Use Fastify + Zod", "confidence": 0.95, ...}],
  "traps": [{"description": "Don't forget CORS", "severity": "high", ...}],
  "shortcuts": [{"description": "Use @fastify/swagger", "timeSavedMs": 5000, ...}],
  "metrics": {
    "reportsAbsorbed": 47,
    "avgTimeWithContextMs": 1200,
    "avgTimeWithoutContextMs": 11280
  }
}
```

## 🔥 Grill Me Scheduler

Periodic alignment sessions that consume accumulated contexts and produce actionable insights.

### Manual Run
```bash
curl -X POST http://localhost:3000/grill-me \
  -H "Content-Type: application/json" \
  -d '{"topic": "API Design Patterns", "runNow": true}'
```

### Schedule Periodic
```bash
curl -X POST http://localhost:3000/grill-me \
  -H "Content-Type: application/json" \
  -d '{"topic": "Weekly Alignment", "runNow": false}'
```

### Auto-Grill (in code)
```typescript
import { grillScheduler } from "./micro-agents/grill-scheduler.js";

await grillScheduler.initialize();
grillScheduler.startAutoGrill("0 */6 * * *"); // Every 6 hours
```

## 🏗 Development

### Project Structure
```
severino-core/
├── public/
│   └── index.html          # Dashboard UI
├── src/
│   ├── index.ts            # Bootstrap
│   ├── config.ts           # Environment config
│   ├── types.ts            # Shared Zod schemas
│   ├── model-router.ts     # 9router integration
│   ├── comms/
│   │   ├── http-api.ts     # REST endpoints
│   │   ├── web-server.ts   # Fastify + WebSocket
│   │   ├── html-ui.ts      # HTML loader
│   │   └── adapters/       # Telegram/WhatsApp
│   └── micro-agents/
│       ├── robot-factory.ts
│       ├── skill-manager.ts
│       ├── learning-engine.ts
│       ├── reporter.ts
│       ├── resource-broker.ts
│       ├── resource-manager.ts
│       └── grill-scheduler.ts
├── package.json
└── tsconfig.json
```

### Running Tests
```bash
# Test Grill Scheduler
npx tsx src/micro-agents/grill-scheduler.test.ts

# Test endpoints manually
curl http://localhost:3000/health
curl http://localhost:3000/teams
```

## 📦 Deployment

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
docker build -t severino-core .
docker run -p 3000:3000 --env-file .env severino-core
```

### Environment Variables for Production
```env
NODE_ENV=production
LOG_LEVEL=warn
# Use reverse proxy (nginx) for SSL termination
```

### Systemd Service
```ini
[Unit]
Description=Severino Master
After=network.target

[Service]
Type=simple
User=severino
WorkingDirectory=/opt/severino-core
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
EnvironmentFile=/opt/severino-core/.env

[Install]
WantedBy=multi-user.target
```

## 🛠 Extending

### Add New Skill
```typescript
import { skillManager } from "./micro-agents/skill-manager.js";

await skillManager.registerSkill({
  name: "my-custom-skill",
  type: "tool",
  description: "Does something useful",
  trigger: "my-skill-trigger",
  domain: "backend",
  version: "1.0.0",
  config: { /* skill-specific config */ }
});
```

### Add New Adapter
```typescript
import { BaseAdapter, AdapterConfig } from "./comms/adapters/base-adapter.js";

class MyAdapter extends BaseAdapter {
  async start() { /* connect */ }
  async stop() { /* disconnect */ }
  async sendMessage(chatId: string, text: string) { /* send */ }
}
```

### Custom Model Router
Extend `ModelRouter` class to add provider-specific logic.

## 📄 License

MIT — Use freely for building AI agent platforms.

---

**Built with ❤️ for autonomous agent orchestration**
