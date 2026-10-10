#!/usr/bin/env bash
# =============================================================================
# validate-configs.sh – Validação CI dos arquivos xcconfig
# Garante que chaves essenciais não foram esquecidas no Secrets.xcconfig
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SECRETS_FILE="$ROOT/Secrets/Secrets.xcconfig"

echo "🔍 Validando xcconfigs..."

if [[ ! -f "$SECRETS_FILE" ]]; then
  echo "❌ ERRO: $SECRETS_FILE não encontrado. Rode 'npm run generate-secrets'."
  exit 1
fi

REQUIRED_KEYS=(
  DEVELOPMENT_TEAM_ID
  API_KEY
  ANALYTICS_API_KEY
)

MISSING=0
for key in "${REQUIRED_KEYS[@]}"; do
  if ! grep -q "^$key\s*=\s*[^[:space:]]" "$SECRETS_FILE"; then
    echo "❌ KEY AUSENTE ou VAZIA: $key"
    MISSING=1
  fi
done

if [[ $MISSING -eq 1 ]]; then
  echo "❌ Falha na validação."
  exit 1
fi

echo "✅ Validação de configs bem-sucedida."
exit 0
