# Template `claude-settings` — Kit de Crachá de Acesso para o Claude Code

**Status**: Template cross-cutting | **Owner**: Guanabara | **Decide**: Severino (Líder)
**Refs**: ADR-019 (Onboarding) · LEARNING_LOOP.md (grill-me, onboarding-como-teste) · Towards/Turing (DX patterns)

---

## Analogia do Dia a Dia

Este template é um **kit de crachá de acesso** para o agente de código:

| Componente | Analogia |
|------------|----------|
| `settings.json` | **Política da catraca** (allow/ask/deny) — regras da empresa, valem para todos |
| `settings.local.json` | **Cordão personalizado com seus tokens** — gitignored, só você usa |
| `skills/` | **Manual do funcionário** — onboarding, grill-me, marketplace 101 |
| `commands/` | **Atalhos do interfone** — `/onboard`, `/grill-me`, `/skill-add` |
| `hooks/` | **Inspetor de qualidade na porta** — pre-commit, post-merge |
| `scripts/setup-claude.sh` | **Instalação one-shot** — "bem-vindo, seu crachá está pronto" |

---

## Estrutura

```
claude-settings/
├── README.md                    # Este guia
├── settings.json                # Configuração compartilhada (comitada)
├── settings.local.json.example  # Template local (gitignored → copia p/ settings.local.json)
├── skills/
│   ├── guanabara-onboarding/    # Skill de onboarding do projeto
│   ├── guanabara-grill-me/      # Skill grill-me (fallback A/B/C/D)
│   └── guanabara-skill-marketplace-101/ # Skill packaging 101
├── commands/
│   ├── onboard.md               # Comando /onboard
│   ├── grill-me.md              # Comando /grill-me
│   └── skill-add.md             # Comando /skill-add
├── hooks/
│   ├── pre-commit.sh            # Quality gate local (ADR-008/016/018)
│   └── post-merge.sh            # Sync deps/index
└── scripts/
    └── setup-claude.sh          # Instalação one-shot
```

---

## Como Usar

```bash
# 1. No root do repo
cp -r _consolidado/cross-cutting/templates/claude-settings .claude

# 2. Instalação one-shot (cria settings.local.json se ausente, valida JSON, chmod hooks)
./.claude/scripts/setup-claude.sh

# 3. Use os comandos
# /onboard      → onboarding interativo (Guanabara)
# /grill-me     → validação socrática (A/B/C/D)
# /skill-add    → scaffold de nova skill (karpathy single-source)
```

---

## Cross-refs

- ADR-019: Onboarding Standard (curriculum 10 dias)
- LEARNING_LOOP.md:35-38 (grill-me antes de ADR/template cross-cutting)
- LEARNING_LOOP.md:56-59 (onboarding como teste do consolidado)
- Guanabara: skill-packaging, grill-me, skillpper marketplace, karpathy 4 princípios
- Towards: feature-skeleton, async-store, cc-switch live write engine
- Trevor: universal dev setup, QA sandbox