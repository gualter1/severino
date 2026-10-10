# ADR-021: Three-Shape Plugin Model

- **Status**: ✅ Aprovado (Grill-Me Session 2)
- **Data**: 2026-10-09
- **Autores**: Guanabara, Niamaia, Towards, Turing, Trevor
- **Decisores**: Severino (Líder)

## Contexto
Plugins e skills em agentes podem rodar em diferentes ambientes (CLI shell hooks, in-process TypeScript runtime, ou arquivos estáticos de instruções Markdown). Falta de padronização gerava duplicação de lógica e incompatibilidade entre harness environments (Claude Code, OpenCode, Cursor).

## Decisão
Adotar o **Three-Shape Plugin Model**:
- **Shape A (Shell-Hook)**: CLI scripts e ganchos de sistema executados via shell.
- **Shape B (In-Process)**: Runtime direto em TypeScript/JavaScript com acesso completo a APIs.
- **Shape C (Instructions-File)**: Arquivos `.md` puros (SKILL.md / .mdc) injetados no contexto do LLM.
- **Arquitetura (Core + Adapters)**: Port & Adapters. O núcleo do plugin (`PluginCore`) é 100% agnóstico e sem dependências. Cada Shape implementa um adaptador fino que traduz o contexto do harness para o Core.
- **Prioridade Runtime**: O harness detecta automaticamente o ambiente mais leve disponível, com suporte a override explícito via flag de debug.

## Consequências
- **Positivas**: Reúso máximo de código de negócio; suporte a múltiplos harnesses com 1 único codebase; testabilidade isolada do Core.
- **Negativas**: Complexidade inicial de scaffolding de adaptadores.
- **Riscos Mitigados**: Lock-in a um único harness de IA; duplicação de lógica de negócio entre plugins CLI e Web.
