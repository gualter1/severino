# ADR-020: Skill Versioning com SemVer para Prompts

- **Status**: ✅ Aprovado (Grill-Me Session 1)
- **Data**: 2026-10-09
- **Autores**: Guanabara, Towards, Niamaia, Trevor
- **Decisores**: Severino (Líder)

## Contexto
No ecossistema de agent skills (`skillpper`, ECC, etc.), as skills evoluem como código. No entanto, faltava um contrato de versionamento consistente (`version` no frontmatter), o que causava quebras em cadeia quando prompts ou dependências mudavam de comportamento sem aviso prévio aos consumidores.

## Decisão
Adotar **Semantic Versioning (SemVer) estrito** no frontmatter YAML de todo `SKILL.md`:
- **MAJOR (`X.0.0`)**: Mudança breaking em interface, triggers, ou contrato de output.
- **MINOR (`0.X.0`)**: Adição de nova capacidade ou comportamento retrocompatível.
- **PATCH (`0.0.X`)**: Correção de bug, ajuste de instrução ou melhoria de texto sem mudança de contrato.
- **Registry / Consumidor**: O registry serve múltiplas versões simultaneamente. Consumidores podem fixar versão (`foo@1.2.0`) ou usar ranges (`foo@^1.0.0`).
- **Validação CI**: Workflow `.github/workflows/skill-lint.yml` valida frontmatter contra schema JSON e obriga changelog entry.

## Consequências
- **Positivas**: Fim de quebras surpresas em agentes; rastreabilidade de mudanças; suporte a rollbacks determinísticos.
- **Negativas**: Pequeno overhead de manutenção de versão em cada skill (mitigado por automação no CI).
- **Riscos Mitigados**: Quebra silenciosa de prompts em produção.
