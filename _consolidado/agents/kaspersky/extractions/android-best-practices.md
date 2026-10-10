## METADADOS
- **Repositório**: `android-best-practices`
- **Lead Responsável**: `kaspersky`
- **Funcionário (Subagente)**: `kaspersky`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 00min`

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

## 2. O QUE PRESTA PARA **THREAT MODELING/SAST/DAST/COMPLIANCE**
| Item | Localização (arquivo:linha) | Tipo | Destino sugerido | Prioridade |
|------|----------------------------|------|------------------|------------|
| IPC/Intent security: `exported=false` default, signature-level permissions | `README.md:500-560` | Threat model | `agents/kaspersky/threat-models/android-ipc.md` | 🔴 Alta |
| Deep link / App Link validation (host verification) | `README.md:580-620` | Pattern | `agents/kaspersky/threat-models/android-deeplinks.md` | 🔴 Alta |
| Permission model: least privilege, runtime requests, dangerous permissions audit | `README.md:600-680` | Guideline | `agents/kaspersky/compliance/android-permissions.md` | 🟠 Média |
| Network Security Config + Certificate Pinning (OkHttp) | `README.md:420-460` | Code snippet | `agents/kaspersky/sast-dast/android-nsc-pinning.md` | 🔴 Alta |
| Keystore/Keymaster para chaves, EncryptedSharedPreferences | `README.md:480-520` | Guideline | `agents/kaspersky/hardening-guides/android-crypto.md` | 🔴 Alta |
| SafetyNet → Play Integrity API migration | `README.md:700-740` | Compliance mapping | `agents/kaspersky/compliance/play-integrity.md` | 🟠 Média |
| ProGuard/R8 obfuscation + mapping.txt retention | `README.md:340-380` | Tool config | `agents/kaspersky/sast-dast/android-proguard.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| SafetyNet Attestation | `README.md:700-740` | Deprecated 2024 | Play Integrity API |
| `allowBackup=true` default | `README.md:380` | Data exfiltration via adb | `allowBackup=false` + backup rules |
| WebView `setJavaScriptEnabled(true)` sem validação | `README.md:450` | XSS surface | `SafeBrowsing` + CSP + input validation |

---

## 4. GAPS
- [ ] Gap 1: Threat model STRIDE completo para app Android típico — Sugestão: `threat-models/android-full-stride.md`
- [ ] Gap 2: OWASP MASVS v2 mapping explícito — Sugestão: `compliance/masvs-matrix-android.md`
- [ ] Gap 3: RASP/anti-tamper/root detection baseline — Sugestão: `hardening-guides/android-rasp.md`
- [ ] Gap 4: SAST rules custom para Android (semgrep rules) — Sugestão: `sast-dast/android-semgrep-rules.md`

---

## 5. AÇÕES PROPOSTAS
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: IPC/Intent threat model + Play Integrity + crypto baseline
- [ ] **Criar Threat Model**: `android-full-stride.md` — Em: `agents/kaspersky/threat-models/`
- [ ] **Criar Checklist**: `android-threat-review.md` — Em: `agents/kaspersky/compliance/`
- [ ] **Criar SAST Rules**: semgrep rules para Android — Em: `agents/kaspersky/sast-dast/`

---

## 6. CITAÇÕES TEXTUAIS
> `README.md:510` — "Never export components unless explicitly needed; use signature-level permissions for IPC."
> `README.md:590` — "Verify deep links with `autoVerify` and assetlinks.json."
> `README.md:720` — "Migrate from SafetyNet to Play Integrity API for device attestation."

---

## 7. SCORE DE VALOR
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | IPC, deeplinks, permissions, crypto |
| **Qualidade** | 4 | Referências oficiais Android |
| **Atualidade** | 3 | SafetyNet deprecated, falta Play Integrity |
| **Ação** | 4 | Threat models usáveis |
| **Completude** | 3 | Sem STRIDE completo/MASVS |
| **TOTAL** | **18/25** | Extrair completo |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `_consolidado/agents/kaspersky/extractions/android-best-practices.md`