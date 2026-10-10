# Onboarding Checklist — Template Canônico (ADR-019)

**Status**: Template cross-cutting | **Owner**: Guanabara | **Decide**: Severino (Líder)
**Refs**: ADR-019 (Onboarding Standard 10 dias) · `LEARNING_LOOP.md` (grill-me cerimônia + onboarding-como-teste) · Guanabara CONSOLIDATED

## Como usar

1. Copie esta pasta para o repo do projeto: `docs/onboarding/` ou use como referência central.
2. Preencha `checklist.md` com links reais do projeto (repo, CI, `.env.example`, CONSOLIDATEDs relevantes).
3. Atribua um **buddy** (template `templates/buddy-assignment.md`) **antes do Dia 1**.
4. Siga a trilha do nível (`tracks/junior.md|mid.md|senior.md|specialist.md`).
5. Rode as **5 grill-me sessões da semana 1** (Guanabara facilita, buddy executa, Líder valida saída).
6. Acompanhe progresso com `scripts/track-progress.sh`.

## Papel de cada ator

| Ator | Papel | Responsabilidade no onboarding |
|------|-------|-------------------------------|
| **Novo membro** | Aluno | Executa checklist, abre First PR trivial no Dia 1-2, explica conceitos em voz alta (Feynman) |
| **Buddy** | Guia diário | Desbloqueia ambiente, faz tour do repo, revisa First PR, facilita grill-me 1-4 |
| **Guanabara** | Professor / facilitador | Fornece analogias, roteiros grill-me (`grill-questions.md`), valida Dia 10, certifica facilitadores |
| **Lead do domínio** | Dono do conteúdo | Mantém CONSOLIDATED.md legível; se novato não entende → **bug do consolidado** (LEARNING_LOOP:56-59), Lead corrige |
| **Líder (Severino)** | Decide | Aprova saída do onboarding (grill exit criteria), valida feedback "o que mudaria no onboarding" |

## Estrutura

```
onboarding-checklist/
├── README.md · checklist.md · grill-questions.md
├── tracks/ junior.md mid.md senior.md specialist.md
├── templates/ buddy-assignment.md first-pr.md week-1-retro.md
├── scripts/ assign-buddy.sh track-progress.sh
└── skills/ guanabara-onboarding/SKILL.md
```

## Critério de saída (resumo)

Onboarding completo = checklist semana 1 100% + First PR merged + retro semana 1 preenchida + grill-me final aprovado pelo Líder (ver `grill-questions.md` → Exit Criteria).

> Se o novato não entendeu algo, o consolidado tem bug. Guanabara reporta → Lead corrige → Líder valida.