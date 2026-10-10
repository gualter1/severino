# Grill-Me Questions — Onboarding

**Método**: socrático, 1 pergunta por vez, 2-4 opções concretas quando o novato travar (grill-me-skill).
**Ritmo**: acknowledge em 1-2 frases → próxima pergunta imediata. Sem palestra.
**Analogia**: churrasco — cada ramo da decision tree é um lado da carne; shared understanding é o ponto ideal.

## S1 — Arquitetura em 5 min (Dia 1)

1. "Desenhe os 3-5 blocos principais do sistema e 1 seta entre cada. O que passa na seta?"
2. "Onde mora a regra de negócio — e como você prova isso apontando 1 arquivo?"
3. "Se eu desligar [dependência X], o que quebra primeiro? Por quê?"
4. Travou? Opções: (a) monólito em camadas (b) features fatiadas (c) microsserviços — "qual desenho se parece mais, e onde ele mente?"

## S2 — Hotfix em produção (Dia 2)

1. "Produção quebrou agora. Qual branch você cria, a partir de onde?"
2. "Quem revisa, quais checks precisam passar, quem dá deploy?"
3. "O que você NÃO faz num hotfix? (ex.: refatorar junto, pular teste)"
4. Travou? Opções: (a) commita na main (b) branch `hotfix/` da tag prod (c) reverte o deploy primeiro — "qual e por quê?"

## S3 — Teste bom vs ruim (Dia 3)

1. "Mostre 1 teste bom do repo. O que o torna bom? (AAA? 1 motivo de falha? sem mock interno?)"
2. "Mostre 1 teste ruim (ou invente o anti-pattern). O que quebra nele?"
3. "Onde mora o gate de coverage e o que acontece se furar?"
4. Formato ❌/✅ exigido na resposta (padrão Karpathy).

## S4 — Comando → Evento → Projeção (Dia 4)

1. "Desenhe: comando entra onde → quem valida → que evento sai → quem projeta/consome?"
2. "O que é async aqui e o que o usuário vê enquanto isso? (optimistic UI? loading? retry?)"
3. "Se o evento duplicar, o sistema quebra? Como é idempotente?"

## S5 — Final + Melhoria (Dia 5, com Líder)

1. "O que você mudaria neste onboarding? 1 coisa para cortar, 1 para manter."
2. "Explique para um leigo: o que o projeto faz e por que importa?" (Feynman)
3. "Qual parte do consolidado mais te confundiu? Aponte o arquivo/linha." → vira bug do consolidado.

## Grill-me mensal (Mês 1+)

1. "Explique 1 decisão cross-cutting (ADR) que afetou sua feature."
2. "Que trade-off você fez e o que sacrificou?"
3. Quiz adaptativo `study-quiz` (skillpper): 10 perguntas iniciante→avançado + 2-3 de reforço onde errar.

## Exit Criteria (grill-exit-criteria)

- [ ] Todos os ramos da decision tree cobertos (sem "lado cru")
- [ ] Sem dependência pendente ("falta o motor do LEGO" — se faltar, declara explicitamente, não finge que anda)
- [ ] Resumo final aceito pelo facilitador + Líder
- [ ] Feedback registrado (retro ou issue)