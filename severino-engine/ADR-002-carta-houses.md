# ADR-002: Ciclo da Carta — Orquestrador → Carteiro → Casas

## Status: Proposed

## Context
O motor atual (`engine.ts` → `PostmanDecision`, `stock.ts`, `houses.ts`, `factory-adapter.ts`, `web-channel.ts`) roteia por keyword e reutiliza morador ocioso, mas não define: validação do líder da casa (ACEITA/NEGADO), pipeline interno multi-agente, relatório padrão, filas com prioridade/preempção, loja de skills com sandbox, nem o ciclo de aprendizado (Guanabara). Este ADR formaliza a visão do dono sem quebrar o ADR-001.

## Decision

### 1. Ciclo da carta (fluxo oficial)
```
[Orquestrador Central] --Carta--> [Carteiro] --entrega--> [Líder da Casa (tech-lead)]
                                                            | valida endereço
                                   ┌-- NEGADO (motivo) -----┘  (endereço errado)
                                   |                           (domínio/quarto fora da casa)
                                   v
                     [Carteiro] --> [Orquestrador redefine] --> re-roteia (nova Carta, tentativa+1)
                                   (max 3 tentativas → ARQUIVADA com erro)
[ACEITA] --> quebra em partes --> pipeline interno --> consolida --> Carteiro --> Orquestrador
```
Exemplo canônico (casa-dev): `tech-lead → turing(html/css) → towards(js) → tranquilao(review) → kaspersky(sec) → turing(fix) → tranquilao → kaspersky → qualy(teste) → towards(fix lógica) → tranquilao → kaspersky → qualy → tech-lead consolida → carteiro → orquestrador`.

### 2. Estados da carta
`CRIADA → NA_FILA_EXTERNA → EM_ROTA → ENTREGUE_CASA → EM_VALIDACAO → {NEGADA | ACEITA} → EM_EXECUCAO_INTERNA → CONSOLIDADA → DEVOLVIDA_ORQUESTRADOR → ARQUIVADA`. Regras: só o líder transita `EM_VALIDACAO → NEGADA/ACEITA`; `NEGADA` sempre volta ao Carteiro com `motivo`; `tentativa > 3` → `ARQUIVADA`.

### 3. Contratos TS (mínimos, evolutivos)
```ts
type CartaEstado = "CRIADA"|"NA_FILA_EXTERNA"|"EM_ROTA"|"ENTREGUE_CASA"|"EM_VALIDACAO"|"NEGADA"|"ACEITA"|"EM_EXECUCAO_INTERNA"|"CONSOLIDADA"|"DEVOLVIDA_ORQUESTRADOR"|"ARQUIVADA";
interface Carta { carta_id: string; tentativa: number; prioridade: number; objetivo: string; domain: string; houseId: string; room?: string; prazo_ms?: number; estado: CartaEstado; historico: {estado: CartaEstado; por: string; em: string; motivo?: string}[]; }
interface RelatorioAgente { carta_id: string; parte_id: string; agente: string; erros: string[]; acertos: string[]; resumo: string; rodou_sem_erros: boolean; skills_usadas: string[]; o_que_melhorar: string; o_que_nao_fazer: string; precisou_corrigir_antes_envio: boolean; }
interface SkillResumo { skill_id: string; tags: string[]; resumo: string; dependencias: string[]; versao_estavel: string; }
interface VereditoCasa { carta_id: string; decisao: "ACEITA"|"NEGADA"; motivo?: string; plano?: { parte_id: string; room: string; depende_de: string[] }[]; }
```
`PostmanDecision` atual vira envelope de transporte da Carta (não muda assinatura agora; Carta viaja no `reason`/payload até migração).

### 4. Duas filas
**Externa (Orquestrador/Carteiro):** fila única com prioridade (`prioridade` maior + `prazo_ms` menor primeiro), preempção (carta `urgente` pausa `EM_ROTA` não-crítica, que volta à fila com `tentativa` intacta) e starvation-guard (envelhecimento: +1 prioridade a cada N min). **Interna (por casa):** um quadro por `houseId` (`A_FAZER → FAZENDO → EM_REVIEW → PRONTO`), WIP-limit por quarto (default 1), pipeline como DAG de partes com `depende_de`. Líder é o único que move entre colunas.

### 5. Protocolo do líder da casa (tech-lead)
1. Valida endereço: `domain`/`room` pertencem a `HOUSES[houseId]`? Se não → `NEGADA` + motivo objetivo (ex: "quarto qa-engineer não existe na casa-negocios"). 2. Se ACEITA: quebra em partes mínimas verificáveis, cada parte com 1 room responsável + skills sugeridas (por tags). 3. Distribui, acompanha quadro interno, exige `RelatorioAgente` por entrega parcial. 4. Consolida (resolve conflitos, roda review final) e devolve `CONSOLIDADA` ao Carteiro. Nunca executa tarefa final sozinho — só orquestra e consolida.

### 6. Loja de skills + sandbox
Catálogo guarda só `SkillResumo`; busca por `tags`/substring de `resumo`. Execução: aluga versão completa (`versao_estavel`), runtime injeta prompt+tools no quarto, roda em `temp_workspace/<task_id>/`, ao fim devolve só artefatos + `RelatorioAgente` e apaga o resto. Relatório avalia a skill (`o_que_melhorar` / `o_que_nao_fazer` alimentam a cura).

### 7. Ciclo Guanabara (setor educação)
`absorver → curar → versionar → testar`: guanabara (chefe) lê relatórios da casa, separa joio/trigo (descarta ruído, keeps padrões repetidos ≥2 ocorrências), consolida nos arquivos da casa (atualiza loja), versiona skill (`versao_estavel+1`, mantém anterior p/ rollback), roda testes internos periódicos (suite fixa por skill; regressão bloqueia promoção). Guanabara nunca edita pipeline em voo — só propõe versão nova.

### 8. Decisão sobre grill-me (consenso opcional)
Grill-me = rodada opcional onde agentes criticam a solução antes do aceite final. **Usar** quando: decisão irreversível (schema, auth, custo), divergência entre reviews (ex: tranquilao aprova, kaspersky nega), ou pipeline >5 etapas. **Evitar** como default: custo em latência/tokens e risco de influência (âncora do primeiro a falar, bandwagon). Mitigação obrigatória quando usar: votos cegos e simultâneos + líder resume por último + limite de 1 rodada (empate → decide tech-lead, registra dissenso).

## Consequences
### Positive
- Endereço errado falha rápido (NEGADO) em vez de executar na casa errada.
- Relatórios padronizados alimentam melhoria contínua real (Guanabara).
- Sandbox + SkillResumo reduzem custo de contexto e vazamento entre tarefas.
### Negative
- Mais hops (filas, validações, consolidação) → latência maior no caso simples.
- Líder vira gargalo se WIP-limit/quadro não forem respeitados.
### Risks
- Preempção sem starvation-guard esfomeia cartas lentas; re-roteio sem teto gera loop (mitigado: teto 3).
- Grill-me mal conduzido vira teatro de consenso — por isso opt-in.

## Alternatives Considered
- **Roteamento direto sem líder (Carteiro → quarto):** mais rápido, mas sem validação nem consolidação — rejeitado.
- **Execução sem sandbox (workspace compartilhado):** simples, mas vaza estado entre tasks — rejeitado.
- **Grill-me obrigatório sempre:** qualidade marginal vs custo alto — rejeitado, virou opt-in.

## References
- `severino-engine/src/core/engine.ts`, `src/core/stock.ts`, `src/houses/houses.ts`, `ADR-001-motor.md`
- Fábrica real: `_consolidado/cross-cutting/templates/agent-factory/severino-core/src/micro-agents/`
