---
description: Scaffold de nova skill (karpathy single-source)
---

# `/skill-add` — Criar Nova Skill

Cria estrutura `skills/<nome>/` seguindo `skill-template`.

## Execução
1. Pergunta: nome da skill (lowercase-hyphen), descrição one-line, tags.
2. Cria pasta `skills/<nome>/` com:
   - `SKILL.md` (frontmatter name/description/version/license/author/tags/dependencies/compatibility + doc template)
   - `references/` + `.gitkeep`
   - `scripts/` + `.gitkeep`
   - `assets/` + `.gitkeep`
   - `skill-review.yaml` (META/STR/CONT/SEC/DUP)
   - `CHANGELOG.md` (Keep-a-Changelog)
   - `eval/cases.yaml` + `eval/harness.sh`
   - `.skillignore`
   - `package.json`
3. Princípio Karpathy: **Single Source** (`SKILL.md`) → **Multiformat** (deriva `CLAUDE.md`, `.mdc`, plugin).
4. Valida: `npx skill-review --config skill-review.yaml` + `./eval/harness.sh`.