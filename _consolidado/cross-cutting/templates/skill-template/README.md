# Skill Template

> O padrão canônico para criação, empacotamento, validação e avaliação de skills no ecosistema Severino / OpenCode / Claude Code / Cursor.

## 🍳 A Analogia da Receita de Bolo

Imagine que criar uma skill para um agente de IA é como **escrever uma receita de bolo masterizada em uma confeitaria industrial**.
- Se você deixar a receita vaga ("misture o chocolate até dar ponto"), cada padeiro vai fazer de um jeito e o bolo pode solar.
- Se você usar o **Skill Template**, você define exatamente: os ingredientes exatos (frontmatter), a ordem dos passos com checagem visual (validação observável), o que **não** fazer (tabela ❌/✅), e até uma prova cega (eval harness) para garantir que o bolo cresceu antes de ir para a vitrine (Marketplace / Skillpper).

## 📁 Estrutura do Template

```
skill-template/
├── README.md                    # Este guia (Analogia + Como Usar)
├── SKILL.md                     # Template canônico (metadata + doc)
├── references/                  # Pasta para referências (markdown, pdfs, specs)
│   └── .gitkeep
├── scripts/                     # Scripts auxiliares e automações
│   └── .gitkeep
├── assets/                      # Assets visuais (diagramas, screenshots)
│   └── .gitkeep
├── skill-review.yaml            # Config de validação estática (skillpper style)
├── CHANGELOG.md                 # Keep-a-Changelog para prompts e skills
├── eval/
│   ├── cases.yaml               # Casos de teste (input → expected output)
│   └── harness.sh               # Script de avaliação automatizada
├── .skillignore                 # Arquivos a excluir do bundle .skill
└── package.json                 # Para skills Node/TS / dependências npm
```

## 🚀 Como Criar uma Nova Skill

1. **Copie** esta pasta para o seu registry com o nome exato da skill (lowercase-hyphen, ex: `minha-nova-skill`).
2. **Atualize o frontmatter** em `SKILL.md` — `name` deve ser === nome da pasta (regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`).
3. **Preencha a Analogia Guanabara** em `## Como Funciona (Analogy)`.
4. **Escreva passos + validações observáveis** (cada passo tem `**Validação**:` verificável).
5. **Valide**: `npx skill-review --config skill-review.yaml` (ou validador skillpper).
6. **Teste**: `./eval/harness.sh`.
7. **Multiformato** (karpathy single-source): derive `CLAUDE.md`, `.mdc`, plugin a partir do mesmo `SKILL.md` — nunca edite os derivados na mão.

## 🔄 Single-Source-Multiformat

```
SKILL.md (fonte única)
  ├── CLAUDE.md   # gerado: Quando Usar + Workflow resumido
  ├── .mdc        # gerado: regras Cursor
  └── plugin/     # gerado: bundle .skill (respeita .skillignore)
```

## 📚 Cross-refs
- skillpper: registry, validation, voting, waivers
- obsidian-skills: SKILL.md template, CLI devtools
- karpathy: pedagogia ❌/✅, multiformat
- ECC: escala (293 skills patterns)