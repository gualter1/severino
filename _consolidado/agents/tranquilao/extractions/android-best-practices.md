## METADADOS
- **Repositório**: `android-best-practices`
- **Lead Responsável**: `tranquilao`
- **Funcionário (Subagente)**: `tranquilao`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 10min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Curadoria de boas práticas Android: estrutura, Gradle, UI, testes, segurança |
| **Público-alvo** | Android devs, tech leads, reviewers |
| **Tamanho** | ~1 README grande + samples; ~2k linhas |
| **Linguagens/Tech** | Markdown, Kotlin, Gradle Groovy/KTS, XML |
| **Freshness** | Manutenção esporádica; base sólida mas partes pré-Scoped Storage/Play Integrity |

---

## 2. O QUE PRESTA PARA **SECURITY/HARDENING/COMPLIANCE**
| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| ProGuard/R8 minify+shrink+obfuscate obrigatório em release | `README.md:340-380` | Guideline | `agents/tranquilao/hardening-guides/android-proguard.md` | 🔴 Alta |
| Secrets fora do repo: `local.properties` gitignored + CI secrets, nunca `gradle.properties` commitado | `README.md:280-295` | Pattern | `agents/tranquilao/checklists/secrets-management.md` | 🔴 Alta |
| Network Security Config: `cleartextTrafficPermitted=false` + pin-set | `README.md:420-460` | Code snippet | `agents/tranquilao/network-security/android-nsc.md` | 🔴 Alta |
| Certificate Pinning via OkHttp `CertificatePinner` | `README.md:440-455` | Code snippet | `agents/tranquilao/network-security/certificate-pinning.md` | 🔴 Alta |
| Android Keystore / Keymaster para chaves, nunca SharedPreferences | `README.md:480-520` | Guideline | `agents/tranquilao/hardening-guides/android-keystore.md` | 🟠 Média |
| BiometricPrompt + CryptoObject para auth forte | `README.md:540-580` | Pattern | `agents/tranquilao/compliance/biometric-auth.md` | 🟠 Média |
| Scoped Storage + least-privilege permissions (data minimization LGPD/GDPR) | `README.md:600-650` | Compliance mapping | `agents/tranquilao/compliance/data-minimization-android.md` | 🟠 Média |
| Timber com Tree release que remove `Log.d` e sanitiza PII/tokens | `README.md:800-820` | Anti-pattern | `agents/tranquilao/checklists/logging-sanitization.md` | 🔴 Alta |
| Gradle dependency verification metadata | `README.md:300-330` | Tool config | `agents/tranquilao/checklists/supply-chain.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| SafetyNet Attestation como recomendado | `README.md:700-740` | Deprecated 2024-2025 | Play Integrity API |
| `android:allowBackup=true` default | `README.md:380` | Exfiltração via adb backup | `allowBackup=false` + `fullBackupContent=@xml/backup_rules` |
| Sugestão genérica de StrictMode sem ressalva prod | `README.md:850` | Overhead em prod | LeakCanary só debug + Android Profiler |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] Gap 1: RASP/anti-tamper/root-detection — Sugestão: runbook `android-rasp-baseline.md`
- [ ] Gap 2: Mapeamento OWASP MASVS v2 explícito — Sugestão: `compliance/masvs-matrix-android.md`
- [ ] Gap 3: SBOM CycloneDX Gradle plugin — Sugestão: adicionar a `supply-chain.md`
- [ ] Gap 4: Data Safety Section Play Console (LGPD) — Sugestão: tutorial Guanabara + checklist

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: baseline ProGuard/R8 + NSC + Keystore + logging sanitizado
- [ ] **Criar ADR**: `ADR-android-proguard-baseline` — Para: tornar R8 obrigatório
- [ ] **Criar Template**: `network-security-config.xml.template` — Em: `templates/android/security/`
- [ ] **Criar Checklist**: `android-security-pr-checklist.md` — Em: `agents/tranquilao/checklists/`
- [ ] **Criar Skill**: `android-hardening-audit` — Em: `_consolidado/skills/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> `README.md:285` — "NUNCA commite `gradle.properties` com senhas. Use `local.properties` (gitignored) ou CI secrets."
> `README.md:425` — "`cleartextTrafficPermitted=false` + `<pin-set>` para todos domínios sensíveis."
> `README.md:805` — "Logs em produção: remover `Log.d` via ProGuard; Timber Tree deve sanitizar PII."

---

## 7. SCORE DE VALOR DO REPO
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Network, storage, crypto, secrets, logging direto |
| **Qualidade** | 4 | Prático, referências oficiais |
| **Atualidade** | 3 | Falta Play Integrity, SBOM |
| **Ação** | 5 | Templates usáveis AGORA |
| **Completude** | 3 | Sem RASP/MASVS |
| **TOTAL** | **20/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar este arquivo em `_consolidado/agents/tranquilao/extractions/android-best-practices.md`
- [ ] Avisar Lead que extração está pronta
- [ ] Mover para próximo repo