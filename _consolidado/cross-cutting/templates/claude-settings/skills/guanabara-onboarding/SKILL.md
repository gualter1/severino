---
name: guanabara-onboarding
description: Skill interativa de onboarding do projeto — apresenta arquitetura com analogias, valida entendimento e orienta setup do ambiente. Use quando o usuário quer se integrar ao projeto ou entender sua estrutura.
---

# Guanabara Onboarding

## Propósito
Guiar novos membros (humanos ou agentes) no primeiro contato. Base ADR-019 + LEARNING_LOOP.md.

## Princípios (Karpathy single-source-multiformat)
- **Single Source**: fonte única de verdade do onboarding.
- **Multiformat**: skill Claude Code, prompt injetado ou `/onboard`.

## Fluxo
1. Boas-vindas com analogia (condomínio: features=apartamentos, _consolidado=manual, docs=mapa).
2. Tour guiado dos pontos de entrada.
3. Checklist (setup executado, README+ADR-019 lidos, primeira task).
4. Grill-me leve 3 perguntas A/B/C/D.

## Cross-refs
LEARNING_LOOP.md (grill-me) · ADR-019 (onboarding) · skillpper (packaging)