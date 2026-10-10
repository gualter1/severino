# ADR-023: Skill Marketplace Governance

- **Status**: ✅ Aprovado (Grill-Me Session 5)
- **Data**: 2026-10-09
- **Autores**: Niamaia, Kaspersky, Trevor, Towards, Qualy
- **Decisores**: Severino (Líder)

## Contexto
Com SemVer (ADR-020), Three-Shape Model (ADR-021) e Zero-Dependency (ADR-022) definidos, falta o contrato de **governança do marketplace**: quem pode publicar, o que é validado automaticamente, como assinar/indexar, e como remover versões vulneráveis sem quebrar consumidores. Sem isso, o registry vira vetor de supply chain attack (skill maliciosa, secret vazado, versão yanked sem aviso).

Restrições: pipeline deve ser 100% automatizado por padrão (zero fricção para publisher legítimo), bloqueante para security findings, auditável (SLSA/Cosign, ADR-013), e com remoção segura que nunca quebre builds travados (`foo@1.2.0` fixo continua resolvendo bytes).

## Decisão
Adotar **pipeline automático `publish → validate → sign → index`** com humano apenas em exceção, mais **Yank Policy com soft-remove** como padrão de remoção.

### 1. Pipeline Automático (default, sem humano)

```
publish → validate → sign → index
```

| Stage | Checks | Fail Condition |
|-------|--------|----------------|
| **validate** | lint frontmatter/schema (SKILL.md) + SemVer check (ADR-020: version bump coerente com diff) + security scan bloqueante (secrets via gitleaks, SAST via semgrep, deps via OSV) | ❌ Block publish em qualquer High/Critical ou SemVer inválido |
| **sign** | Cosign keyless + SBOM CycloneDX (Syft) + SLSA provenance L2+ (ADR-013) | ❌ Block release se não assinado |
| **index** | Index atomizado (versão só aparece após sign OK; rollback atômico em falha) | Versão parcial nunca visível |

### 2. Exceção Humana
- **Regra**: humano só atua em exceção via label `marketplace-exception` no PR de publicação.
- Requer aprovação de **2 revisores** (um deles Kaspersky ou Trevor para security/infra).
- Waiver com expiração (máx 30 dias, padrão ADR-022) e issue linkada.

### 3. Yank Policy (remoção segura)
- **Soft-remove (yank) = padrão**: bytes permanecem no registry; **novas instalações bloqueadas**; consumidores existentes continuam resolvendo; `skill install` emite **warning**; `--allow-yanked` opt-in explícito.
- **Hard delete = proibido**, exceto **legal / secret vazado**. Neste caso, manter **tombstone** (`404 + motivo + upgrade path`) — nunca 404 mudo.
- **Yank obrigatório contém**: motivo + severidade (CVSS) + upgrade path (`>=X.Y.Z seguro`) + advisory linkado.
- **Propagação**: feed de advisories + badge no registry + `skill audit` local; SLA **<5min** do yank à visibilidade no feed.
- **Operação assinada**: todo yank/delete é operação Cosign assinada com transparência Rekor (audit trail, ADR-013).

## Consequências
- **Positivas**: Supply chain confiável (toda skill publicada é validada + assinada); remoção sem quebrar builds travados; auditabilidade total (Rekor + SBOM + SLSA); fricção zero para publisher legítimo.
- **Negativas**: Latência de publish aumenta (scan + sign, ~2-5min); yank exige disciplina de advisory (motivo + upgrade path obrigatórios); feed <5min exige infra de pub/sub no registry.
- **Riscos Mitigados**: Skill maliciosa publicada; secret vazado sem remoção rastreável; quebra em cadeia por delete hard; bypass humano não auditado.

## Ligações
- ADR-020 (SemVer) — validate checa bump coerente.
- ADR-013 (Supply Chain: SBOM + SLSA + Cosign + Gitleaks) — sign reutiliza gates.
- ADR-014 (Logging Sanitizado) — logs do pipeline nunca contêm secrets escaneados.

## Implementação de Referência
- Workflow: `.github/workflows/marketplace-publish.yml` (stages `validate`, `sign`, `index`)
- CLI: `skill publish`, `skill yank <id>@<version> --reason --severity --upgrade-path`, `skill audit`, `skill install --allow-yanked`
- Registry: endpoint `/advisories/feed` + badge `yanked` + tombstone `{ status: 'removed', reason, upgradeTo }`
