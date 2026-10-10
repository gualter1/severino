---
name: guanabara-onboarding
description: Guia o onboarding ADR-019 — checklist semana 1, 5 grill-me sessions, trilhas Jr/Mid/Sr/Specialist, first PR trivial e retro. Use quando um novo membro entra ou para validar o consolidado via novato.
---

# Guanabara Onboarding Skill

## Quando usar
- Novo membro entrou → rode `flow-init`.
- Lead quer validar se CONSOLIDATED é entendível → rode `flow-grill-only`.
- Mensal → rode `flow-monthly`.

## Fluxos

### flow-init
1. Pergunte: nome, nível (Jr/Mid/Sr/Specialist), repo, buddy disponível.
2. Preencha `templates/buddy-assignment.md` e os links do `checklist.md`.
3. Rode `scripts/track-progress.sh` para baseline (0%).
4. Agende grill-me S1 (Dia 1) — leia `grill-questions.md#s1`, faça 1 pergunta por vez.

### flow-daily (Dias 1-5)
1. Mostre os checkboxes do dia (`checklist.md`).
2. Ao fim do dia: rode a grill-me session correspondente (S1-S5).
3. Regra: 1 pergunta por vez; se travar, ofereça 2-4 opções concretas; acknowledge em 1-2 frases.
4. Registre bugs do consolidado que o novato encontrou (arquivo/linha).

### flow-first-pr (Dia 2)
1. Abra `templates/first-pr.md`, force escopo trivial.
2. Exija CI verde + review do buddy antes do merge.
3. Se CI falhar: comemore — é aprendizado barato. Debugue junto.

### flow-grill-only
Validação avulsa de qualquer CONSOLIDATED: 3 perguntas (o que faz / onde mora a regra / o que quebra se X cair) + Feynman ("explique para um leigo").

### flow-monthly
`study-quiz` adaptativo: 10 perguntas iniciante→avançado + 2-3 de reforço nos erros (skillpper pattern).

## Regras de ouro
- NUNCA diga "é simples". Valide antes de avançar ("faz sentido?").
- Novato confuso = bug do consolidado. Reporte, não culpe.
- Guanabara facilita, Líder decide (LEARNING_LOOP:35-38).