#!/usr/bin/env bash
# =============================================================================
# generate-secrets.sh – Gera Secrets/Secrets.xcconfig a partir de Secrets/.env
# Uso: ./scripts/generate-secrets.sh [--env Secrets/.env] [--out Secrets/Secrets.xcconfig]
# CI:  exporta secrets do runner como env vars; o script prioriza env > .env
# Ref: ADR-009 (mobile security) – nenhum segredo no git.
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-$ROOT/Secrets/.env}"
OUT_FILE="$ROOT/Secrets/Secrets.xcconfig"

# Permite flags --env / --out
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env) ENV_FILE="$2"; shift 2;;
    --out) OUT_FILE="$2"; shift 2;;
    *) shift;;
  esac
done

# Chaves esperadas (devem bater com xcconfig.yml > required_keys)
KEYS=(
  DEVELOPMENT_TEAM_ID
  API_KEY
  ANALYTICS_API_KEY
  LAUNCHDARKLY_SDK_KEY
  FIREBASE_API_KEY
  CERT_PIN_PRIMARY
  CERT_PIN_BACKUP
)

# Carrega .env se existir (ignora comentários e linhas vazias)
if [[ -f "$ENV_FILE" ]]; then
  echo "→ Loading $ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source <(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' || true)
  set +a
else
  echo "⚠ $ENV_FILE not found – falling back to environment variables only."
fi

{
  echo "// =============================================================================
"
  echo "// Secrets.xcconfig – GERADO automaticamente. NÃO EDITAR MANUALMENTE."
  echo "// Gerado por: scripts/generate-secrets.sh em $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "// Este arquivo é GITIGNORED – nunca commitar."
  echo "// =============================================================================
"
  echo ""
  for key in "${KEYS[@]}"; do
    val="${!key:-__MISSING__}"
    if [[ "$val" == "__MISSING__" ]]; then
      echo "// WARNING: $key ausente no ambiente – placeholder vazio." >&2
      echo "$key = "
    else
      # Escapa valores para xcconfig (xcconfig não suporta aspas; valores simples)
      echo "$key = $val"
    fi
  done
  echo ""
  echo "// Opcionais (podem estar vazios em dev local):"
  echo "PROVISIONING_PROFILE = $(printenv PROVISIONING_PROFILE:-)"
  echo "PROVISIONING_PROFILE_RELEASE = $(printenv PROVISIONING_PROFILE_RELEASE:-)"
} > "$OUT_FILE"

echo "✅ Generated $OUT_FILE"
