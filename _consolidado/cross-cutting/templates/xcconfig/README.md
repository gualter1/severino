# xcconfig Template – Mobile Patterns

## 📖 O que é este repositório?
Este é um **template canônico** de arquivos `.xcconfig` para projetos iOS/macOS. Ele traz boas‑práticas extraídas de:
- `ios-good-practices`
- `android-best-practices` (adaptado ao mundo Apple)
- `claude-code-best-practice`

O objetivo é **centralizar** todas as configurações de build, **evitar segredos no git** e **facilitar a verificação automática** via CI.

---

## 📂 Estrutura
```
xcconfig/
├─ README.md                # Este documento
├─ Config/
│   ├─ Common.xcconfig      # Configurações globais
│   ├─ Debug.xcconfig       # Overrides para Debug
│   ├─ Release.xcconfig     # Overrides para Release
│   ├─ Test.xcconfig        # Overrides para Testes unitários
│   ├─ Development.xcconfig  # (Opcional) ambiente dev
│   └─ Production.xcconfig  # (Opcional) ambiente prod
├─ Secrets/
│   ├─ .env.example         # Modelo de variáveis de ambiente (commitado)
│   └─ Secrets.xcconfig     # Gerado a partir do .env – **git‑ignored**
├─ Modules/
│   ├─ Networking.xcconfig
│   ├─ Logging.xcconfig
│   ├─ Analytics.xcconfig
│   └─ FeatureFlags.xcconfig
├─ scripts/
│   ├─ generate-secrets.sh   # Converte .env → Secrets.xcconfig
│   └─ validate-configs.sh    # Falha CI se chaves obrigatórias faltarem
├─ xcconfig.yml               # Schema de validação (yamllint‑like)
└─ package.json               # npm wrappers para os scripts acima
```

---

## 🚀 Como usar
1. **Copie** a pasta `xcconfig` para o seu projeto (ex.: `./xcconfig`).
2. **Inclua** o arquivo desejado no seu *project* ou *target*:
   ```
   #include "$(PROJECT_DIR)/xcconfig/Config/Debug.xcconfig"
   ```
   Cada `*.xcconfig` *inclui* `Common.xcconfig` e, por fim, `Secrets.xcconfig` – veja a seção **Herança** abaixo.
3. **Configure** as variáveis de ambiente em `.env.example`, copie para `.env` (não versionado) e rode:
   ```bash
   npm run generate-secrets
   ```
   Isso cria/atualiza `Secrets.xcconfig` que será automaticamente incluído.
4. **CI** – adicione ao seu workflow:
   ```yaml
   - name: Validate xcconfigs
     run: npm run validate-configs
   ```
   O script falha caso alguma chave requerida esteja ausente.

---

## 🔗 Herança baseada em `#include`
```text
# Config/Debug.xcconfig
#include "../Config/Common.xcconfig"
#include "../Secrets/Secrets.xcconfig"

// Overrides específicos de Debug …
```
A ordem importa: `Common` primeiro (valores padrão), depois `Secrets` (segredos) e, finalmente, os *overrides* específicos da configuração.

---

## 🛡️ Segurança
- **Segredos nunca são versionados** – `Secrets.xcconfig` deve estar no `.gitignore` (exemplo incluído no ADR‑009).
- **ADR‑009 – Mobile Security** descreve a política de armazenamento de credenciais.
- **ADR‑013 – Supply Chain** recomenda a validação automática dos arquivos de configuração antes de merge.
- O script de validação (`validate-configs.sh`) pode ser integrado ao **Dependabot** ou ao **GitHub Actions** para garantir consistência.

---

## 📦 Integração com Feature Flags
Os módulos `FeatureFlags.xcconfig` e `Analytics.xcconfig` expõem flags que podem ser habilitadas por configuração (Debug, Release, etc.):
```text
ENABLE_LOGGING = YES   // ou NO
ENABLE_ANALYTICS = YES // ou NO
MOCK_API = NO          // útil em testes
```
Essas flags são consumidas no código Swift via `ProcessInfo.processInfo.environment["ENABLE_LOGGING"]` ou, preferencialmente, por um *wrapper* tipado.

---

## 🛠️ Desenvolvimento futuro
- Emular a mesma estrutura para **Android** usando Gradle `gradle.properties`/`local.properties`.
- Automatizar a geração de *schema* a partir de um único fonte (ex.: `zod` ou `swift‑gen`).

---

## 📚 Referências
- **ADR‑009** – Mobile Security (secrets handling)
- **ADR‑013** – Supply‑Chain hardening
- Guanabara: "Segredos são como a marmita em um buffet – se deixados à vista, todo mundo pode comer."
