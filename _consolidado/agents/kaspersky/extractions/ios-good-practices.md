## METADADOS
- **Repositório**: `ios-good-practices`
- **Lead Responsável**: `kaspersky`
- **Funcionário (Subagente)**: `kaspersky`
- **Data**: `2026-10-08`
- **Tempo gasto**: `55min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Boas práticas iOS: Swift/ObjC, arquitetura, UI, testes, segurança |
| Público | iOS devs, reviewers |
| Tamanho | README extenso + exemplos; ~1.5k linhas |
| Tech | Markdown, Swift, Xcode configs |
| Freshness | Estável, pré-SPM-first em trechos, base válida |

---

## 2. O QUE PRESTA PARA **THREAT MODELING/SAST/DAST/COMPLIANCE**
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| App Sandbox + entitlements hardening (`com.apple.security.*`) | `README.md:200-280` | Threat model | `agents/kaspersky/threat-models/ios-sandbox.md` | 🔴 Alta |
| Keychain `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` + access groups | `README.md:300-340` | Guideline | `agents/kaspersky/hardening-guides/ios-keychain.md` | 🔴 Alta |
| ATS strict (`NSAllowsArbitraryLoads=false`) + Certificate Pinning (TrustKit/Alamofire) | `README.md:380-420` | Pattern | `agents/kaspersky/sast-dast/ios-ats-pinning.md` | 🔴 Alta |
| Biometria LocalAuthentication + Keychain accessControl (Secure Enclave) | `README.md:430-460` | Pattern | `agents/kaspersky/hardening-guides/ios-biometric.md` | 🟠 Média |
| Jailbreak detection (não como única defesa) + debugger detection | `README.md:470-490` | Anti-pattern | `agents/kaspersky/hardening-guides/ios-tamper.md` | 🟢 Baixa |
| Privacy Manifests (`PrivacyInfo.xcprivacy`) LGPD/GDPR — **GAP** | — | Gap | `agents/kaspersky/compliance/ios-privacy-manifest.md` | 🔴 Alta |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| Keychain `kSecAttrAccessibleAlways` | `README.md:320` | Deprecated/inseguro | `WhenUnlockedThisDeviceOnly` |
| `NSAllowsArbitraryLoads=true` em debug | `README.md:390` | Abre HTTP | Exceções por domínio |
| CocoaPods como default | `README.md:83-108` | SPM padrão | SPM + Package.resolved |

---

## 4. GAPS
- [ ] Gap 1: Privacy Manifests obrigatórias iOS 17+ — Sugestão: template + checklist
- [ ] Gap 2: MASVS mapping iOS — Sugestão: `compliance/masvs-matrix-ios.md`
- [ ] Gap 3: App Attestation (DeviceCheck/App Attest) — Sugestão: `hardening-guides/ios-app-attest.md`
- [ ] Gap 4: SAST Swift (semgrep/swiftlint security rules) — Sugestão: `sast-dast/ios-semgrep-rules.md`

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: Sandbox + Keychain + ATS + biometric + privacy manifest gap
- [ ] **Criar Threat Model**: `ios-sandbox-full.md`
- [ ] **Criar Template**: `PrivacyInfo.xcprivacy.template`
- [ ] **Criar Checklist**: `ios-security-pr-checklist.md`

---

## 6. CITAÇÕES
> `README.md:220` — "App Sandbox restricts filesystem, network, IPC; declare only needed entitlements."
> `README.md:310` — "Keychain with `WhenUnlockedThisDeviceOnly` — never `Always`."
> `README.md:385` — "ATS: no arbitrary loads in production; pin certs for critical endpoints."

---

## 7. SCORE
| Relevância | 4 | Sandbox, Keychain, ATS |
| Qualidade | 4 | Oficial Apple patterns |
| Atualidade | 3 | Falta Privacy Manifests/App Attest |
| Ação | 4 | Templates imediatos |
| Completude | 3 | Sem MASVS/SAST rules |
| **TOTAL** | **18/25** | Extrair completo |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/ios-good-practices.md`