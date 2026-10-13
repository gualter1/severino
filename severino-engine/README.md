# 🏭 Severino Engine

Motor próprio estilo Eve, **filesystem-first**: o Carteiro roteia, o estoque
decide, a fábrica cria, o robô executa. Local-first, zero telemetria,
zero vendor lock.

## Como rodar

```bash
cd severino-engine
npm install
npx tsx src/index.ts
```

## ENVs

| Variável | Default | Descrição |
|----------|---------|-----------|
| `ENGINE_PORT` | `3100` | Porta do canal web HTTP |
| `ROOMS_DIR` | `../../rooms` | Onde moram `teams.json` + `rooms/<robotId>/agent.json` (estoque) |
| `SEVERINO_MODEL` | `Tech` | Modelo do agente (local-first via 9router; **NUNCA** OpenAI/Anthropic) |
| `TELEGRAM_BOT_TOKEN` | — | Token do bot Telegram (opcional; sem ele o canal fica desabilitado) |

## Fluxo: pedido → estoque → fábrica → execução

```
pedido ("criar endpoint de login")
  → Carteiro (SeverinoEngine.handleTask): infere domínio `backend` → casa-dev
  → Estoque (checkStock): tem backend-developer ocioso? reutiliza : create-new
  → Fábrica (ensureRobot): garante o robô (robot-backend-developer-dev-01)
  → Execução (runTask): roda a tarefa e devolve o resultado
```

Exemplo:

```bash
curl -X POST http://localhost:3100/tasks \
  -H 'Content-Type: application/json' \
  -d '{"objective": "criar endpoint de login"}'
```

Resposta (resumo):

```json
{
  "routingDecision": {
    "action": "use-existing",
    "teamId": "casa-dev",
    "robotId": "robot-backend-developer-dev-01",
    "domain": "backend",
    "houseId": "casa-dev"
  },
  "execution": { "status": "completed" }
}
```

## O que foi removido dos 3 repos

- ❌ Telemetria / analytics / phone-home (PostHog, Sentry e afins)
- ❌ Branding de terceiros (Nous, openclaw, Vercel)
- ❌ Paths proprietários (`~/.hermes`, `~/.openclaw`)
- ❌ Porta `18789` do openclaw → usamos `ENGINE_PORT` default `3100`
- ❌ Vendor lock (OpenAI/Anthropic como default; modelo padrão é `Tech` via 9router local-first)
- ❌ Factory complexa / herança profunda → funções puras + classes pequenas

## Estrutura de pastas

```
severino-engine/
├── agent/
│   ├── instructions.md        # persona Severino motor (PT-BR)
│   ├── agent.ts               # defineAgent({ model, reasoning, houses }) + defaultAgent
│   ├── tools/
│   │   └── check-stock.ts     # defineTool → moradores do estoque (nome deriva do arquivo)
│   └── connections/
│       └── README.md          # convenção: cada *.ts vira namespace (linear.ts → linear__*)
├── src/
│   ├── core/
│   │   ├── engine.ts          # SeverinoEngine.handleTask (Carteiro determinístico)
│   │   ├── stock.ts           # queryStock / checkStock (filesystem, ROOMS_DIR)
│   │   └── index.ts           # dispatch() — pedido → estoque → fábrica → execução
│   ├── houses/
│   │   └── houses.ts          # HOUSES: casa-dev, casa-negocios, casa-dados
│   ├── factory/
│   │   └── factory-adapter.ts # ponte p/ robotFactory real (stub local se ausente)
│   └── gateway/               # canais (web/telegram) — feito em paralelo
│       └── ...
└── rooms/                     # ESTADO (fora do pacote): teams.json + agent.json por robô
```
