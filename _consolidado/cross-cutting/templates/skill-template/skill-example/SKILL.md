---
name: "file-vault-skill"
description: "Secure file vault skill with dual-compat V1/V2 support, state storage, and tool execution"
version: "1.0.0"
license: "MIT"
author: "Towards"
tags:
  - "file-vault"
  - "dual-compat"
  - "storage"
  - "security"
dependencies: []
compatibility:
  - "claude-code"
  - "codex"
  - "opencode"
  - "cursor"
---

# File Vault Skill

> Secure file vault skill with dual-compat V1/V2 support, state storage, and tool execution.

## Quando Usar
Use esta skill quando precisar ler, escrever e criptografar/armazenar metadados de arquivos de forma segura, garantindo compatibilidade absoluta entre os runtimes OpenCode V1 (callbacks) e V2 (promises).

## Pré-requisitos
- Node.js >= 20.0.0
- OpenCode V1 ou V2 runtime (ou `OPENCODE_MOCK=true` para testes)

## Como Funciona (Analogia)
> "Como um cofre blindado em um banco suíço que funciona perfeitamente tanto com chave mecânica antiga (V1) quanto com biometria digital moderna (V2), mantendo o interior intocado."

## Workflow
### Passo 1: Inicialização do Vault
- Carrega e valida o adaptador correto (`V1Adapter` ou `V2Adapter`) via detecção em <1ms.
**Validação**: `healthCheck()` retorna `{ healthy: true }`.

### Passo 2: Execução de Operações de Arquivo e Storage
- Executa ferramentas do host (`read_file`, `write_file`) e armazena metadados no key-value storage.
**Validação**: Arquivo lido/escrito com sucesso e persistido no storage.

## Exemplos
### Exemplo 1: Armazenar e Ler Arquivo no Vault
**Input**: `{ action: "vault_write", path: "secret.txt", content: "confidential data" }`
**Output**: `{ success: true, data: { path: "secret.txt", bytes: 17 } }`

## Anti-Patterns (❌ vs ✅)
| ❌ Erro Comum | ✅ Correto | Problema |
|---------------|------------|----------|
| Chamar callbacks V1 diretamente no código core | Usar a `PluginAPI` comum do `compat-layer.ts` | Quebra compatibilidade com V2 |
| Adicionar dependências de produção | Manter zero deps em produção (`dependencies: {}`) | Viola gate zero-dep |

## Referências
- [OpenCode Bridge Pattern](../compat-layer.ts)
- [Grill-Me Session 8 Decisions](../README.md)
