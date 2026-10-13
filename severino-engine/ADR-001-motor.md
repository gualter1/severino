# ADR-001: Arquitetura do Motor Severino Engine

## Status
Accepted

## 1. Visão
O Severino Engine é um motor autônomo e modular para orquestração de agentes de IA baseados em microrrobôs especializados. Ele unifica o fluxo orientado a tarefas (pedido → busca no estoque → fabricação dinâmica se ausente → execução via canais unificados) combinando a robustez de roteamento do `severino-core`, o ciclo de turnos e WAL do `hermes-agent`, a arquitetura WS RPC e gateways do `openclaw`, e o design minimalistamente filesystem-first do `eve`.

---

## 2. Componentes e Proveniência de Padrões

| Componente | Descrição | Proveniência / Origem |
| :--- | :--- | :--- |
| **Engine Core** | Orquestração do ciclo de vida de tarefas, dispatch e machine state. | `severino-core` (adaptado) + `hermes-agent` (turn loop fatiado) |
| **Estoque & Broker** | Registro centralizado de agentes disponíveis, controle de checkout/checkin de recursos. | `severino-core` (`resource-broker`, `houses.ts`, `teams.json`) |
| **Fábrica Adapter** | Instanciação dinâmica de robôs sob demanda com base no perfil/role exigido pela tarefa. | `severino-core` (`robot-factory.ts`) + `eve` (metadados e instruções por filesystem) |
| **Gateway / Canais** | Camada unificada de comunicação (Telegram, WhatsApp, WebSockets RPC). | `openclaw` (gateway dono SQLite + WS RPC) + `severino-core` (adapters) |
| **Providers Locais / Flex** | Conectividade agnóstica de LLMs orientada a custo/local-first, sem vendor lock-in. | `severino-core` (`model-router.ts`) + 9router / custom local endpoints |

---

## 3. Fluxo Operacional: Pedido → Estoque → Criação → Execução

```
[Cliente / Canal] 
       │
       ▼ (POST /tasks ou Webhook)
 ┌───────────────┐
 │  Gateway / API │
 └───────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Engine Core  │ ──► Analisa demanda (splitDemand)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐      Existe?
  │   ESTOQUE    │ ─────────────────┐
  │ (Broker/DB)  │                  │ (Sim)
  └──────┬───────┘                  ▼
         │ (Não)             ┌──────────────┐
         ▼                   │ Check-out    │
  ┌──────────────┐           │ do Robô      │
  │FÁBRICA-ADAPTER│          └──────┬───────┘
  │ Cria Robô    │                 │
  └──────┬───────┘                 │
         │                         │
         ▼                         ▼
  ┌──────────────────────────────────┐
  │          EXECUÇÃO                │
  │ (Turn Loop + LLM Provider local) │
  └────────────────┬─────────────────┘
                   │
                   ▼
         [Resposta ao Canal / Cliente]
```

---

## 4. O que Reutiliza do `severino-core` vs O que é Novo

### Reutilizado via `import` direto (sem duplicação):
- `model-router.ts`: Lógica de roteamento de modelos de IA.
- `comms/` e adapters existentes: Lógica base para Telegram e WhatsApp.
- `types.ts`: Tipagens base de mensagens, demandas e contextos.

### Desenvolvido de forma nova / refinada em `severino-engine/`:
- **Estrutura modular limpa**: Pastas `src/core`, `src/factory`, `src/gateway`, `src/houses`.
- **Turn Loop Fatiado**: Integração com o padrão de loop e SessionDB WAL (inspirado no `hermes-agent`).
- **Gateway Central de Controle**: Camada de RPC desacoplada de amarras externas (inspirada no `openclaw`).

---

## 5. Lista Explícita de Amarras Removidas
Para garantir total soberania, ausência de vazamento de dados e independência de infraestruturas de terceiros, foram banidas do motor:
1. **Telemetria e Phone-home**: Removidas chamadas a `telemetry.staging`, `clawhub`, `catalog.openclaw.ai` e quaisquer endpoints de diagnóstico externos.
2. **Hardcoding de Diretórios e Portas**: Eliminados caminhos fixos (`~/.hermes`, `~/.openclaw`) e portas hardcoded (`18789`). A configuração passa a ser injetada via variáveis de ambiente/config file flexível.
3. **Vendor Locks Padrão**: Removida a obrigatoriedade de defaults para ecossistemas fechados (NousResearch, OpenAI direta, Anthropic direta, Vercel workflows).
4. **Atualizações Autônomas de Telemetria**: Bloqueado qualquer mecanismo nativo de checagem de versão com envio de metadados de uso.

---

## 6. Estrutura de Pastas Final e Contratos Principais

### Estrutura de Diretórios
```
severino-engine/
├── package.json
├── tsconfig.json
├── ADR-001-motor.md
└── src/
    ├── index.ts
    ├── core/
    │   ├── engine.ts           # Orquestrador principal do ciclo de tarefas
    │   ├── broker.ts           # Controle de estoque, checkout e checkin de robôs
    │   └── turn-loop.ts        # Turn loop fatiado com suporte a WAL/SessionDB
    ├── factory/
    │   ├── robot-factory.ts    # Fábrica dinâmica de robôs (foundHouse, ensureRoom, splitDemand)
    │   └── templates.ts        # Templates de instruções e arquivos dos robôs
    ├── gateway/
    │   ├── server.ts           # Servidor HTTP/WS RPC unificado
    │   └── channels.ts         # Adaptadores de canais (Telegram, WhatsApp)
    └── houses/
        ├── index.ts            # Gerenciamento das casas (dev, negocios, dados)
        └── registry.ts         # Registro dos microrrobôs ativos por casa
```

### Contratos TypeScript Principais

```typescript
export type RobotRole = 'dev' | 'negocios' | 'dados' | string;
export type HouseName = 'casa-dev' | 'casa-negocios' | 'casa-dados';

export interface TaskDemand {
  id: string;
  title: string;
  description: string;
  requiredRole: RobotRole;
  payload?: Record<string, any>;
}

export interface AgentRobot {
  id: string;
  name: string;
  role: RobotRole;
  house: HouseName;
  status: 'idle' | 'busy' | 'offline';
  metadata: Record<string, any>;
}

export interface IResourceBroker {
  checkout(role: RobotRole): Promise<AgentRobot>;
  checkin(robotId: string): Promise<void>;
  listAvailable(): AgentRobot[];
}

export interface IRobotFactory {
  ensureRobotForDemand(demand: TaskDemand): Promise<AgentRobot>;
}
```

## References
- `_consolidado/cross-cutting/templates/agent-factory/severino-core/src`
- Repositórios de Referência: `hermes-agent`, `openclaw`, `eve`.
