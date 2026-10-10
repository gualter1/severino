## METADADOS
- **Repositório**: `ios-good-practices`
- **Lead Responsável**: `tranquilao`
- **Funcionário (Subagente)**: `tranquilao`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 05min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Boas práticas iOS: Swift/ObjC, arquitetura, UI, testes, segurança |
| **Público-alvo** | iOS devs, reviewers |
| **Tamanho** | README extenso + exemplos; ~1.5k linhas |
| **Linguagens/Tech** | Markdown, Swift, Xcode configs |
| **Freshness** | Estável, pré-SPM-first em trechos, base válida |

---

## 2. O QUE PRESTA PARA **SECURITY/HARDENING/COMPLIANCE**
| Item | Localização (arquivo:linha) | Tipo | Destino sugerido | Prioridade |
|------|----------------------------|------|------------------|------------|
| Keychain (`kSecClassGenericPassword`, `kSecAttrAccessibleWhenUnlocked`) em vez de UserDefaults | `README.md:300-340` | Guideline | `agents/tranquilao/hardening-guides/ios-keychain.md` | 🔴 Alta |
| ATS (`NSAppTransportSecurity`, sem `NSAllowsArbitraryLoads`) + TLS pinning | `README.md:380-420` | Code snippet | `agents/tranquilao/network-security/ios-ats-pinning.md` | 🔴 Alta |
| Biometria via LocalAuthentication + Keychain accessControl | `README.md:430-460` | Pattern | `agents/tranquilao/compliance/biometric-auth.md` | 🟠 Média |
| Nunca logar PII/tokens; `os_log` com privacy modifiers | `README.md:520-540` | Anti-pattern | `agents/tranquilao/checklists/logging-sanitization.md` | 🔴 Alta |
| Data Protection entitlement (`NSFileProtectionComplete`) | `README.md:350-370` | Guideline | `agents/tranquilao/compliance/data-protection-ios.md` | 🟠 Média |
| Jailbreak/debugger detection ressalvas (não como única defesa) | `README.md:470-490` | Guideline | `agents/tranquilao/hardening-guides/ios-tamper.md` | 🟢 Baixa |
| SPM + `Package.resolved` commitado, dependências pinnadas | `README.md:83-108` | Tool config | `agents/tranquilao/checklists/supply-chain.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| CocoaPods como default | `README.md:83-108` | SPM é padrão | SPM + Package.resolved |
| `NSAllowsArbitraryLoads=true` em exemplos debug | `README.md:390` | Abre HTTP | Exceções por domínio + justificativa |
| Keychain `kSecAttrAccessibleAlways` citado | `README.md:320` | Deprecated/inseguro | `WhenUnlockedThisDeviceOnly` |

---

## 4. GAPS
- [ ] Gap 1: MASVS mapping iOS — Sugestão: `compliance/masvs-matrix-ios.md`
- [ ] Gap 2: Privacy Manifests (`PrivacyInfo.xcprivacy`) LGPD/GDPR — Sugestão: checklist + template
- [ ] Gap 3: SBOM + `npm`-like audit para SPM — Sugestão: `supply-chain.md`

---

## 5. AÇÕES PROPOSTAS
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Keychain baseline + ATS + logging privacy
- [ ] **Criar Template**: `Info.plist-security-baseline` — Em: `templates/ios/security/`
- [ ] **Criar Checklist**: `ios-security-pr-checklist.md` — Em: `agents/tranquilao/checklists/`

---

## 6. CITAÇÕES
> `README.md:310` — "Sensitive data belongs in Keychain, never UserDefaults or plist."
> `README.md:385` — "ATS: no `NSAllowsArbitraryLoads` in production."
> `README.md:530` — "Strip `print()` logs in release; use `os_log` with `%{private}@`."

---

## 7. SCORE
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| Relevância | 5 | Keychain, ATS, DP alinhado |
| Qualidade | 4 | Prático |
| Atualidade | 3 | CocoaPods legacy, sem Privacy Manifests |
| Ação | 4 | Templates imediatos |
| Completude | 3 | Sem MASVS/SBOM |
| **TOTAL** | **19/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `_consolidado/agents/tranquilao/extractions/ios-good-practices.md`
- [ ] Avisar Lead