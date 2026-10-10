# 🗓️ Plano de Sessões Grill-Me (Learning Loop)

> **Facilitador**: Guanabara (Professor Particular / Validador Pedagógico & Técnico)
> **Objetivo**: Conduzir sabatinas socráticas (Grill-Me) para validação rigorosa de ADRs e Templates arquiteturais, garantindo alinhamento técnico, clareza conceitual e critérios de saída objetivos.

---

## 🏛️ Histórico Concluído (Q4 2026)

| # | Tópico | Alvo | Participantes Principais | Data | Status |
|---|---|---|---|---|---|
| **1** | ADR-020: Skill Versioning SemVer | `skillpper` | Guanabara, Towards, Niamaia, Trevor | Q4 2026, Terça 10:00 | ✅ **Concluído** |
| **2** | ADR-021: Three-Shape Plugin Model | `superpowers` | Niamaia, Towards, Turing, Trevor | Q4 2026, Quarta 14:00 | ✅ **Concluído** |
| **3** | ADR-022: Zero-Dependency Dual-Compat | `superpowers` | Kaspersky, Trevor, Niamaia, Towards | Q4 2026, Quinta 10:00 | ✅ **Concluído** |
| **4** | Template `feature-skeleton` Unificado | Cross-Cutting | Towards, Niamaia, Trevor, Tranquilão | Q4 2026, Sexta 15:00 | ✅ **Concluído** |

> Detalhes das sessões Q4 2026 preservados no histórico de commits. Ver `TECH-RADAR-Q4-2026.md` §1 e `GRILL-ME-RESULTS.md` para resultados e lições aprendidas.

---

## 📋 Visão Geral das Sessões — Q1 2027

| # | Tópico | Alvo | Participantes Principais | Data Sugerida | Status |
|---|---|---|---|---|---|
| **5** | ADR-023: Skill Marketplace Governance | `skillpper` + ECC registry | Towards, Niamaia, Kaspersky, Trevor | Jan/27 Semana 1, Terça 10:00 | ✅ **Concluído** |
| **6** | ADR-024: Agent-to-Agent Protocol (MCP v2) | ECC agents + context-mode | Trevor, Niamaia, Towards, Turing | Jan/27 Semana 1, Quarta 14:00 | ✅ **Concluído** |
| **7** | ADR-025: Cross-Harness Skill Portability | Three-Shape Model (ADR-021) | Turing, Niamaia, Towards, Guanabara | Jan/27 Semana 1, Quinta 10:00 | ✅ **Concluído** |
| **8** | Template `skill-template` V2 (compat-layer integrado) | `skill-template` + ADR-022 | Towards, Kaspersky, Trevor, Turing | Jan/27 Semana 1, Sexta 15:00 | ✅ **Concluído** |
| **9** | Template `async-store` variants (Go, Rust, Python) | ADR-002 + Tech Radar migração | Niamaia, Towards, Qualy, Trevor | Jan/27 Semana 2, Segunda 10:00 | ✅ **Concluído** |
| **10** | Grill-Me: Certificação de Facilitadores | LEARNING_LOOP.md | Guanabara, Líder, Todos Leads | Jan/27 Semana 2, Quarta 10:00 | ✅ **Concluído** |

> Prioridades conforme `TECH-RADAR-Q4-2026.md` §5 + briefing: ADR-023 🔴 Alta, ADR-024 🔴 Alta, ADR-025 🟡 Média, skill-template V2 🟡 Média, async-store variants 🟢 Baixa, Certificação 🟢 Baixa. Sessões 5-8 são o MVP do ciclo (Semana 1); 9-10 estendem para Semana 2 se houver capacidade.

---

## 🎯 Sessão 5: ADR-023 — Skill Marketplace Governance

- **Origem**: `skillpper` + ECC registry (`TECH-RADAR-Q4-2026.md` §2 TRIAL: Skill Marketplace + §5 "MVP do Skill Registry").
- **Proposta**: Governança de publicação, versionamento, confiança e revogação de skills no registry consolidado.
- **Facilitador**: Guanabara
- **Participantes obrigatórios**: Towards (registry), Niamaia (arch), Kaspersky (security), Trevor (CI/signing)
- **Data/Hora**: Janeiro 2027, Semana 1, Terça 10:00 (45 min)

### Analogia do Dia a Dia
Pense numa **loja de aplicativos de bairro**: qualquer um pode cadastrar um app, mas antes de ir pra vitrine ele passa pela vigilância sanitária (lint + scan), ganha selo de procedência (assinatura Cosign + SBOM) e, se der problema, sai da prateleira com recall (revogação).

### ❓ Perguntas-Chave (A/B/C/D)
1. **Publicação e validação:**
   - [A] PR manual com revisão humana em tudo.
   - [B] Pipeline automático: lint frontmatter + SemVer (ADR-020) + scan + assinatura, humano só em exceção. (Recomendado)
   - [C] Publicação direta sem gate, moderação pós-fato.
   - [D] Só curadoria central, sem contribuição comunitária.
2. **Confiança e revogação:**
   - [A] Sem revogação — versão publicada é imutável para sempre.
   - [B] Yank + blacklist com aviso aos consumidores + caminho de upgrade. (Recomendado)
   - [C] Deleta a versão quebrada silenciosamente.
   - [D] Revoga o registry inteiro e republica do zero.

### ✅ Critérios de Saída
- [ ] Fluxo publish → validate → sign → index definido.
- [ ] Política yank/revogação aprovada por Kaspersky.
- [ ] Ligação ADR-020 (SemVer) + ADR-013 (SLSA/Cosign) explicitada.
- [ ] Feynman: cada lead explica governança em 1 frase.

---

## 🎯 Sessão 6: ADR-024 — Agent-to-Agent Protocol (MCP v2)

- **Origem**: ECC agents + context-mode (`TECH-RADAR-Q4-2026.md` §ASSESS: Agent Skills Registry + tendência Agentic Engineering).
- **Proposta**: Protocolo padrão para agentes se comunicarem (descoberta, chamada, streaming, erro) sobre MCP v2.
- **Facilitador**: Guanabara
- **Participantes obrigatórios**: Niamaia (arch), Towards (impl), Trevor (platform), Turing (DX)
- **Data/Hora**: Janeiro 2027, Semana 1, Quarta 14:00 (45 min)

### Analogia do Dia a Dia
É o **iFood entre cozinhas**: cada agente é um restaurante com cardápio (manifesto de capabilities). O protocolo é o app que padroniza pedido, acompanhamento e reclamação — ninguém entra na cozinha do outro.

### ❓ Perguntas-Chave (A/B/C/D)
1. **Transporte e contrato:**
   - [A] Chamada direta em memória sem contrato.
   - [B] MCP v2 com schema versionado + descoberta via registry. (Recomendado)
   - [C] Fila genérica sem tipagem, cada um se vira.
   - [D] Arquivo compartilhado como meio de comunicação.
2. **Falhas e timeouts:**
   - [A] Espera infinita até responder.
   - [B] Timeout + retry com backoff + circuit breaker + erro tipado propagado. (Recomendado)
   - [C] Silencia erro e finge sucesso.
   - [D] Derruba o orquestrador junto.

### ✅ Critérios de Saída
- [ ] Operações discovery/invoke/stream/error esboçadas.
- [ ] Compatibilidade com sandbox (ADR-010) e logging sanitizado (ADR-014) checada.
- [ ] Donos de implementação definidos.
- [ ] Feynman concluído.

---

## 🎯 Sessão 7: ADR-025 — Cross-Harness Skill Portability

- **Origem**: Evolução direta do Three-Shape Plugin Model (ADR-021).
- **Proposta**: Garantir que a mesma skill rode em Claude Code, OpenCode e outros harnesses sem fork.
- **Facilitador**: Guanabara
- **Participantes obrigatórios**: Niamaia (arch), Turing (DX), Towards (impl), Trevor (compat CI)
- **Data/Hora**: Janeiro 2027, Semana 1, Quinta 10:00 (45 min)

### Analogia do Dia a Dia
Igual **tomada bivolt com adaptador universal** (revisitando ADR-021): o carregador (skill core) é um só; o que muda é o plug (Shape A/B/C) conforme o país (harness). Portabilidade é garantir que o adaptador existe pra cada país.

### ❓ Perguntas-Chave (A/B/C/D)
1. **Núcleo vs adaptadores:**
   - [A] Um código por harness (fork por plataforma).
   - [B] Core agnóstico + adaptadores finos por Shape/harness, testados em matriz CI. (Recomendado)
   - [C] Só Shape C (instructions-file) e ignora os demais.
   - [D] Gera adaptadores por IA sem teste.
2. **Detecção de capability:**
   - [A] Assume que todo harness tem tudo.
   - [B] Feature-detection em runtime + fallback degradado documentado. (Recomendado)
   - [C] Falha dura se faltar recurso.
   - [D] Desabilita a skill inteira no harness mais fraco.

### ✅ Critérios de Saída
- [ ] Matriz harness × Shape definida.
- [ ] Regra core/adaptador aprovada por Niamaia.
- [ ] Guia DX de portabilidade validado por Turing.
- [ ] Feynman concluído.

---

## 🎯 Sessão 8: Template `skill-template` V2 (com compat-layer integrado)

- **Origem**: `skill-template` + ADR-022 (Zero-Dependency Dual-Compat).
- **Proposta**: Evoluir o template canônico de skill para já nascer com compat-layer V1/V2 e zero-dep.
- **Facilitador**: Guanabara
- **Participantes obrigatórios**: Towards (template owner), Trevor (CI), Kaspersky (supply chain), Turing (DX)
- **Data/Hora**: Janeiro 2027, Semana 1, Sexta 15:00 (45 min)

### Analogia do Dia a Dia
É a **marmita que serve no micro-ondas e no fogão a lenha** (revisitando ADR-022): a mesma comida (skill), embalagem (compat-layer) que funciona nos dois sem contaminar (zero-dep).

### ❓ Perguntas-Chave (A/B/C/D)
1. **Compat-layer no template:**
   - [A] Cada skill reinventa sua compatibilidade.
   - [B] Template já traz `compat-layer` + testes V1/V2 de exemplo. (Recomendado)
   - [C] Compat via dependência externa pesada.
   - [D] Suporta só V2 e quebra V1.
2. **Zero-dep enforcement:**
   - [A] Confia no autor.
   - [B] CI bloqueia `dependencies` + sugere `devDependencies` só para teste. (Recomendado)
   - [C] Permite deps pequenas sem auditoria.
   - [D] Audita uma vez por ano.

### ✅ Critérios de Saída
- [ ] Estrutura V2 do template aprovada (pastas, frontmatter, compat-layer, testes).
- [ ] Gate zero-dep no CI validado por Trevor + Kaspersky.
- [ ] Exemplo gerado via template passa em V1 e V2.
- [ ] Feynman concluído.

---

## 🎯 Sessão 9 (extensão Semana 2): Template `async-store` variants (Go, Rust, Python)

- **Origem**: ADR-002 + `TECH-RADAR-Q4-2026.md` §5 "Expandir `feature-skeleton` para Go, Rust e Python".
- **Proposta**: Portar o padrão async-store/event-sourcing para as três stacks backend.
- **Facilitador**: Guanabara
- **Participantes obrigatórios**: Niamaia (arch), Towards (impl), Qualy (testing), Trevor (CI)
- **Data/Hora**: Janeiro 2027, Semana 2, Segunda 10:00 (45 min) — prioridade 🟢 Baixa, faz se sobrar fôlego da Semana 1.

### Analogia do Dia a Dia
Mesma **receita de feijoada em panela de barro, pressão e elétrica**: ingredientes (eventos) e modo de preparo (store) iguais, só muda o utensílio (linguagem).

### ❓ Perguntas-Chave (A/B/C/D)
1. **Escopo da variante:**
   - [A] Reescrever tudo idiomático do zero por linguagem.
   - [B] Portar contrato + testes de comportamento, adaptando só o idiomático. (Recomendado)
   - [C] Transpilar automaticamente sem revisão.
   - [D] Só documentar, sem código.
2. **Gates de qualidade:**
   - [A] Sem gate, cada linguagem se autorregula.
   - [B] Mesmo gate ADR-008 (80/70 + mutation em críticos) adaptado à toolchain. (Recomendado)
   - [C] Só compila, sem teste.
   - [D] Teste manual antes do release.

### ✅ Critérios de Saída
- [ ] Contrato async-store portado para as 3 linguagens.
- [ ] CI por linguagem verde.
- [ ] Decisão Adopt/Trial/Hold por variante registrada no Radar Q1 2027.
- [ ] Feynman concluído.

---

## 🎯 Sessão 10 (extensão Semana 2): Grill-Me — Certificação de Facilitadores

- **Origem**: `LEARNING_LOOP.md` § "Grill-Me como cerimônia" + `TECH-RADAR-Q4-2026.md` §5 "Automatizar a trilha de certificação de facilitadores".
- **Proposta**: Definir trilha, avaliação e automação para formar novos facilitadores além do Guanabara (escala).
- **Facilitador**: Guanabara
- **Participantes obrigatórios**: Guanabara, Líder, 1+ lead voluntário (shadowing)
- **Data/Hora**: Janeiro 2027, Semana 2, Quarta 10:00 (45 min) — prioridade 🟢 Baixa.

### Analogia do Dia a Dia
Como **formar novos professores de autoescola**: não basta saber dirigir (dominar o conteúdo), precisa saber dar bronca construtiva no aluno sem causar acidente (conduzir a sabatina socrática).

### ❓ Perguntas-Chave (A/B/C/D)
1. **Trilha de certificação:**
   - [A] Título automático por tempo de casa.
   - [B] Assistir → co-facilitar com shadowing → facilitar solo avaliado + checklist. (Recomendado)
   - [C] Prova teórica apenas.
   - [D] Auto-declaração.
2. **Automação:**
   - [A] Tudo manual em docs soltos.
   - [B] Templates de pauta + exit-criteria + registro em `GRILL-ME-RESULTS.md` via CI lint. (Recomendado)
   - [C] Bot que facilita sozinho sem humano.
   - [D] Planilha externa desconectada.

### ✅ Critérios de Saída
- [ ] Trilha assistir/co-facilitar/solo definida.
- [ ] Rubrica de avaliação + local de registro definidos.
- [ ] 1+ candidato a facilitador inscrito para shadowing no ciclo.
- [ ] Feynman concluído.

---

## 🎓 Metodologia (Guanabara CONSOLIDATED §7 + LEARNING_LOOP.md:35-38)
- Socrático: 1 pergunta por vez, 2-4 opções concretas.
- Analogia antes do detalhe técnico.
- Feynman: 1 frase simples por lead ao final.
- Saída global: ramos cobertos + sem dependência pendente + resumo aceito.
- Nada avança p/ implementação sem 100% ticado.

---
*Cross-ref: Guanabara CONSOLIDATED (seção 7), `_governance/LEARNING_LOOP.md`, `_consolidado/cross-cutting/adrs/ADRS-INDEX.md`, `_consolidado/cross-cutting/adrs/TECH-RADAR-Q4-2026.md`, `_consolidado/cross-cutting/team/TEAM-ROLES.md`, `_consolidado/cross-cutting/team/GRILL-ME-RESULTS.md`, `_consolidado/cross-cutting/templates/TEMPLATES-INDEX.md`*