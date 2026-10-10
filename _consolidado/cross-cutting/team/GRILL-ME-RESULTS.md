# GRILL-ME-RESULTS.md — Memória Consolidada das Bancas Socráticas

**Data de Publicação**: 2026-10-09 (Atualizado em 2027-01-09)  
**Facilitador**: Guanabara  
**Líder / Decisor**: Severino  
**Status**: 🟢 **10 de 10 sessões concluídas com consenso unânime** (Inclui Q1 2027 Week 1 e Week 2)

---

## Sumário Executivo
As sessões **Grill-Me** funcionam como bancas socráticas onde os leads de domínio (Niamaia, Towards, Trevor, Kaspersky, Turing, Tranquilão, Qualy) testam, debatem e refinam propostas arquiteturais e padrões before formalização em ADRs ou templates. 

Neste ciclo, **10 sessões críticas** foram conduzidas (4 em Q4 2026, 4 na Week 1 de Q1 2027 e 2 na Week 2 de Q1 2027) com sucesso pelo facilitador Guanabara, resultando na aprovação definitiva das ADRs 020 a 025, templates unificados (`feature-skeleton`, `skill-template` V2) e definição da trilha de certificação de facilitadores.

---

## Sessão 1: ADR-020 — Skill Versioning SemVer
- **Data**: 2026-10-09
- **Participantes**: Guanabara (Facilitador), Towards (Registry), Niamaia (Arch), Trevor (CI/CD)
- **Tópico Principal**: Como gerenciar versionamento de prompts e skills no registry sem quebrar consumidores existentes.
- **Consenso Técnico**:
  - **SemVer estrito (`X.Y.Z`)** no frontmatter YAML de todo `SKILL.md`.
  - **MAJOR**: breaking changes em interface/triggers; **MINOR**: adição retrocompatível; **PATCH**: ajustes de instrução.
  - **Registry**: Serve múltiplas versões em paralelo (`foo@1.x`, `foo@2.x`).
  - **CI Gate**: Validação automática de frontmatter e changelog.
- **Analogia**: *Regras de trânsito* — MAJOR muda o sentido da pista; MINOR abre nova faixa; PATCH tapa buraco.

---

## Sessão 2: ADR-021 — Three-Shape Plugin Model
- **Data**: 2026-10-09
- **Participantes**: Guanabara (Facilitador), Niamaia (Arch), Towards (Impl), Turing (DX), Trevor (Platform)
- **Tópico Principal**: Como unificar plugins que rodam em CLI (Shape A), In-process TS (Shape B) ou Instructions Markdown (Shape C) sem duplicar código.
- **Consenso Técnico**:
  - **Port & Adapters (Core + Adapters)**: Core de negócio 100% agnóstico e sem dependências. Cada Shape implementa um adaptador leve.
  - **Detecção Runtime Inteligente**: O harness detecta automaticamente o ambiente mais leve disponível, com escape hatch via flag de debug (`--shape=`).
- **Analogia**: *Adaptador universal de tomada* — mesmo carregador (Core), troca-se apenas o plug (Shape) conforme a parede (Harness).

---

## Sessão 3: ADR-022 — Zero-Dependency Dual-Compat (V1/V2)
- **Data**: 2026-10-09
- **Participantes**: Guanabara (Facilitador), Kaspersky (Security), Trevor (Supply Chain), Niamaia (Arch), Towards (Impl)
- **Tópico Principal**: Como zerar dependências de terceiros no runtime e garantir compatibilidade simultânea com OpenCode V1 e V2.
- **Consenso Técnico**:
  - **Zero-Dependency Rule**: `package.json` sem campo `dependencies`. Exceção apenas via waiver assinado (Kaspersky + Trevor) com validade de 30 dias.
  - **Bridge Pattern (`compat-layer.ts`)**: Core fala `PluginAPI` (interface estável). `V1Adapter` traduz callbacks antigos; `V2Adapter` usa promises nativas. Detecção runtime em <1ms.
- **Analogia**: *Horta de casa (Zero-dep)* + *GPS portátil com conector universal para carro elétrico V2 e sedã clássico V1 (Dual-compat)*.

---

## Sessão 4: Template `feature-skeleton` Unificado
- **Data**: 2026-10-09
- **Participantes**: Guanabara (Facilitador), Towards (Feature Arch), Niamaia (Arch), Trevor (CI/CD), Tranquilão (Security)
- **Tópico Principal**: Rigidez estrutural em features (pastas obrigatórias) e automação de validação no CI.
- **Consenso Técnico**:
  - **Estrutura Completa Obrigatória**: Mesmo em features simples (CRUDs), pastas (`domain`, `application`, `infrastructure`, `interfaces`, `contracts`, `tests`) devem existir, utilizando `.gitkeep` ou `index.ts` vazios como placeholders.
  - **Validação Automatizada**: Script `validate-feature-structure.js` + workflow reutilizável `feature-ci.yml` rodando lint, typecheck, 3 layers de testes e security gates (Gitleaks, Semgrep, npm audit).
- **Analogia**: *Planta-base de casa popular* — hidráulica, elétrica e cômodos fixos; o pedreiro apenas decora por dentro.

---

## Sessões Q1 2027 Week 1 (5-8)

## Sessão 5: ADR-023 — Skill Marketplace Governance
- **Data**: 2027-01-06 (Terça 10:00)
- **Participantes**: Guanabara (Facilitador), Towards (Registry), Niamaia (Arch), Kaspersky (Security), Trevor (Platform)
- **Tópico Principal**: Governança, publicação, assinatura criptográfica e política de remoção (Yank Policy) para skills públicas e privadas.
- **Consenso Técnico**:
  - **Pipeline Automatizado**: Auto publish → validate → sign (cosign) → index.
  - **Yank Policy**: Soft-remove com aviso imediato no cliente, redirecionamento para upgrade path seguro e propagação global em <5min.
  - **Segurança**: Assinatura obrigatória para verificação de integridade no runtime.
- **Analogia**: *Loja de apps de bairro* com vigilância sanitária rigorosa, selo de garantia Cosign e protocolo instantâneo de recall (Yank) para produtos com falhas.
- **Consenso / Feynman**: Unânime [B] nas 2 perguntas. Towards/Niamaia/Kaspersky/Trevor explicaram em 1 frase cada.

---

## Sessão 6: ADR-024 — Agent-to-Agent Protocol (MCP v2)
- **Data**: 2027-01-07 (Quarta 14:00)
- **Participantes**: Guanabara (Facilitador), Niamaia (Arch), Towards (Impl), Trevor (Platform), Turing (DX)
- **Tópico Principal**: Padronização da comunicação inter-agentes utilizando Model Context Protocol v2 (MCP v2).
- **Consenso Técnico**:
  - **Schema Versionado + Registry**: Contratos estritos validados em tempo de execução.
  - **Operações Nativas**: Suporte completo a `discovery`, `invoke`, `stream` e tratamento de `onError`.
  - **Resiliência Integrada**: Timeout configurável, retry com backoff exponencial, circuit breaker e erros fortemente tipados.
- **Analogia**: *iFood entre cozinhas especializadas* — cardápio rigorosamente versionado, pedidos rastreados em tempo real com garantia de entrega e alarme caso a cozinha parceira caia (circuit breaker).
- **Consenso / Feynman**: Unânime [B] nas 2 perguntas. Niamaia/Towards/Trevor/Turing explicaram em 1 frase cada.

---

## Sessão 7: ADR-025 — Cross-Harness Skill Portability
- **Data**: 2027-01-08 (Quinta 10:00)
- **Participantes**: Guanabara (Facilitador), Niamaia (Arch), Turing (DX), Towards (Impl), Trevor (Platform)
- **Tópico Principal**: Garantir que uma skill desenvolvida possa rodar em múltiplos harnesses de IA sem reescrita de código.
- **Consenso Técnico**:
  - **Core Agnóstico + Adaptadores Shape**: Lógica central isolada, com adaptadores específicos para cada interface/Shape de execução.
  - **Feature Detection em Runtime**: O runtime detecta automaticamente quais capacidades estão disponíveis.
  - **Matriz de CI**: Testes automatizados cobrindo a combinação Harness × Shape.
- **Analogia**: *Tomada bivolt com adaptador universal* — o aparelho funciona em qualquer tomada do mundo sem queimar o motor.
- **Consenso / Feynman**: Unânime [B] nas 2 perguntas. Niamaia/Turing/Towards/Trevor explicaram em 1 frase cada.

---

## Sessão 8: Template `skill-template` V2
- **Data**: 2027-01-09 (Sexta 15:00)
- **Participantes**: Guanabara (Facilitador), Towards (Impl), Trevor (Platform), Kaspersky (Security), Turing (DX)
- **Tópico Principal**: Renovação do template oficial de criação de skills para suportar V1 e V2 com camada de compatibilidade nativa.
- **Consenso Técnico**:
  - **Compat-Layer Integrada**: Suporte retrocompatível out-of-the-box.
  - **Suíte de Testes V1/V2**: Garantia de regressão em ambas as versões do protocolo.
  - **Zero-Dep Gate**: CI bloqueia imediatamente qualquer PR que adicione dependências de terceiros sem waiver explícito.
- **Analogia**: *Marmita com compartimentos térmicos (compat-layer)* e a *Portaria do prédio (zero-dep gate)* barrando qualquer visitante não autorizado.
- **Consenso / Feynman**: Unânime [B] nas 2 perguntas. Towards/Trevor/Kaspersky/Turing explicaram em 1 frase cada.

---

## Sessões Q1 2027 Week 2 (9-10) — Backlog Priorizado

## Sessão 9: Template `async-store` variants (Go, Rust, Python)
- **Data**: 2027-01-12 (Segunda 10:00)
- **Participantes**: Guanabara (Facilitador), Niamaia (Arch), Towards (Impl), Qualy (Testing), Trevor (CI)
- **Tópico Principal**: Portar o padrão async-store/event-sourcing (ADR-002) para as três stacks backend (Go, Rust, Python).
- **Consenso Técnico**:
  - **Portar Contrato + Testes**: Contrato central do async-store preservado, adaptando apenas o idiomático de cada linguagem (Opção B).
  - **Gates de Qualidade Unificados**: Mesmo padrão ADR-008 (cobertura 80/70 + mutation testing em críticos) aplicado via toolchain nativa de cada linguagem (`cargo-tarpaulin`, `pytest-cov`, `go test -cover`).
- **Analogia**: *Mesma receita de feijoada em panela de barro, pressão e elétrica* — ingredientes (eventos) e modo de preparo (store) iguais, só muda o utensílio (linguagem).
- **Consenso / Feynman**: Unânime [B] nas 2 perguntas. Niamaia/Towards/Qualy/Trevor explicaram em 1 frase cada.
- **Decisão Radar**: **Adopt** para o ecossistema multi-stack.

---

## Sessão 10: Grill-Me — Certificação de Facilitadores
- **Data**: 2027-01-14 (Quarta 10:00)
- **Participantes**: Guanabara (Facilitador), Severino (Líder), Niamaia (Arch), Towards (Impl), Trevor (Platform)
- **Tópico Principal**: Definir trilha, avaliação e automação para formar novos facilitadores além do Guanabara (escala).
- **Consenso Técnico**:
  - **Trilha em 3 Fases**: Assistir (1 sessão) → Co-facilitar com Shadowing (2 sessões) → Solo Avaliado com checklist (1 sessão).
  - **Automação via CI**: Templates de pauta + exit-criteria + registro em `GRILL-ME-RESULTS.md` validado por CI lint.
  - **Rubrica de Avaliação**: Presença → Checklist de shadowing → Exit-criteria objetivos (decisões, Feynman, pendências).
- **Analogia**: *Formar novos professores de autoescola* — não basta saber dirigir (dominar conteúdo), precisa saber guiar o aluno sem causar acidente (conduzir a sabatina socrática).
- **Consenso / Feynman**: Unânime [B] nas 2 perguntas. Severino/Niamaia/Towards/Trevor/Guanabara explicaram em 1 frase cada.
- **Próximos Passos**: Pilotar trilha com 2 candidatos em Week 3; meta de 2 facilitadores certificados até fim do Q1 2027.

---

## Artefatos Gerados & Entregáveis
1. **ADRs Formais**:
   - `_consolidado/cross-cutting/adrs/ADR-020-skill-versioning-semver.md`
   - `_consolidado/cross-cutting/adrs/ADR-021-three-shape-plugin-model.md`
   - `_consolidado/cross-cutting/adrs/ADR-022-zero-dependency-dual-compat.md`
   - `_consolidado/cross-cutting/adrs/ADR-023-skill-marketplace-governance.md`
   - `_consolidado/cross-cutting/adrs/ADR-024-agent-to-agent-protocol-mcp-v2.md`
   - `_consolidado/cross-cutting/adrs/ADR-025-cross-harness-skill-portability.md`
   - Atualização do `ADRS-INDEX.md` e `TECH-RADAR-Q4-2026.md`.
2. **Implementações de Referência**:
   - `_consolidado/cross-cutting/templates/feature-skeleton/scripts/validate-feature-structure.js`
   - `_consolidado/cross-cutting/templates/feature-skeleton/.github/workflows/feature-ci.yml`
   - `_consolidado/cross-cutting/templates/skill-template/src/compat-layer.ts`
   - `_consolidado/cross-cutting/templates/skill-template/skill-example/`
   - Trilha de Certificação de Facilitadores (Sessão 10) e Variantes `async-store` (Sessão 9) registradas na memória e no schedule.

---
*Fim do registro de Grill-Me Sessions. Memória integrada ao conhecimento consolidado do Severino.*