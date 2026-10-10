---
description: Inicia onboarding interativo (Guanabara)
---

# `/onboard` — Onboarding Interativo

Invoca a skill `guanabara-onboarding`.

## Execução
1. Carrega `LEARNING_LOOP.md` (seções 35-38, 56-59).
2. Carrega `ADR-019` (Onboarding Standard).
3. Executa `flow-init` da skill `guanabara-onboarding`:
   - Pergunta: nome, nível (Jr/Mid/Sr/Specialist), repo, buddy disponível.
   - Preenche `templates/buddy-assignment.md` e links do `checklist.md`.
   - Agenda grill-me S1 (Dia 1).
4. Fallback: se sem `AskUserQuestion`, usa formato A/B/C/D da skill `guanabara-grill-me`.