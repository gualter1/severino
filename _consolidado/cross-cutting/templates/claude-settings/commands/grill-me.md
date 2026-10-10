---
description: Sabatina técnica A/B/C/D (Guanabara)
---

# `/grill-me` — Validação Socrática

Invoca a skill `guanabara-grill-me` (fallback sem AskUserQuestion).

## Execução
1. Apresenta 3 perguntas A/B/C/D:
   - P1: Arquitetura (o que faz, onde mora a regra, o que quebra se X cai).
   - P2: Segurança (input validation, secrets, authz paths).
   - P3: Workflow (como abre PR, hotfix, deploy).
2. Feedback didático com analogia Guanabara para cada resposta.
3. Se travar: oferece 2-4 opções concretas, acknowledge 1-2 frases, próxima pergunta.