#!/usr/bin/env bash
# pre-commit.sh — Quality Gate Local (ADR-008/016/018)
set -euo pipefail

echo "🔍 Quality Gate: pre-commit"

# ADR-008: Coverage (rodar testes rápidos se mudou código)
if git diff --cached --name-only | grep -qE '\.(ts|tsx|js|jsx|py)$'; then
  echo "  → Código alterado, rodando testes rápidos..."
  if [ -f package.json ]; then
    npm test -- --run --reporter=dot 2>/dev/null || { echo "❌ Testes falharam"; exit 1; }
  elif [ -f pyproject.toml ] || [ -f requirements.txt ]; then
    python -m pytest -x -q 2>/dev/null || { echo "❌ Testes falharam"; exit 1; }
  fi
fi

# ADR-016: SAST não-bloqueante (apenas warn local)
if command -v npx >/dev/null && [ -f package.json ]; then
  echo "  → SAST rápido (eslint-plugin-security)..."
  npx eslint --ext .ts,.tsx,.js,.jsx --no-error-on-unmatched-pattern . 2>/dev/null | grep -E "SEC00[267]|detect-eval|detect-child-process|detect-non-literal-regex" && echo "  ⚠️  Security patterns detectados (review Tranquilão)"
fi

# ADR-018: Warnings-as-errors em CI (local apenas grep segredos)
echo "  → Scanning secrets..."
SECRETS_REGEX="(sk-ant-|AKIA|BEGIN PRIVATE KEY|GITHUB_TOKEN|ANTHROPIC_API_KEY|OPENAI_API_KEY)"
if git diff --cached | grep -Ei "$SECRETS_REGEX" >/dev/null; then
  echo "❌ Segredo detectado no diff! Remova antes de commitar."
  exit 1
fi

echo "✅ Quality gate passed"