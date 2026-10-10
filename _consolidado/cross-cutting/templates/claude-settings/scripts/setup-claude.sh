#!/usr/bin/env bash
# setup-claude.sh — Instalação one-shot do kit Claude Code
set -euo pipefail

CLAUDE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo "🎫 Instalando kit Claude Code em $CLAUDE_DIR"

# 1. Criar settings.local.json se ausente
if [ ! -f "$CLAUDE_DIR/settings.local.json" ]; then
  if [ -f "$CLAUDE_DIR/settings.local.json.example" ]; then
    cp "$CLAUDE_DIR/settings.local.json.example" "$CLAUDE_DIR/settings.local.json"
    echo "  ✅ settings.local.json criado (preencha seus tokens)"
  else
    echo "  ⚠️  settings.local.json.example não encontrado"
  fi
else
  echo "  ℹ️  settings.local.json já existe"
fi

# 2. Validar JSON
echo "  → Validando settings.json..."
node -e "JSON.parse(require('fs').readFileSync('$CLAUDE_DIR/settings.json', 'utf8'))" && echo "  ✅ settings.json válido" || { echo "  ❌ settings.json inválido"; exit 1; }

if [ -f "$CLAUDE_DIR/settings.local.json" ]; then
  node -e "JSON.parse(require('fs').readFileSync('$CLAUDE_DIR/settings.local.json', 'utf8'))" && echo "  ✅ settings.local.json válido" || { echo "  ❌ settings.local.json inválido"; exit 1; }
fi

# 3. chmod hooks
chmod +x "$CLAUDE_DIR/hooks/pre-commit.sh" "$CLAUDE_DIR/hooks/post-merge.sh" 2>/dev/null && echo "  ✅ hooks executáveis"

# 4. Instalar git hooks (se .git existe)
if [ -d "$CLAUDE_DIR/../.git" ] || git rev-parse --git-dir >/dev/null 2>&1; then
  ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || echo "$CLAUDE_DIR/..")"
  ln -sf "$CLAUDE_DIR/hooks/pre-commit.sh" "$ROOT_DIR/.git/hooks/pre-commit" 2>/dev/null && echo "  ✅ pre-commit hook instalado"
  ln -sf "$CLAUDE_DIR/hooks/post-merge.sh" "$ROOT_DIR/.git/hooks/post-merge" 2>/dev/null && echo "  ✅ post-merge hook instalado"
else
  echo "  ℹ️  Não é repo git — hooks não instalados"
fi

# 5. Próximos passos
echo ""
echo "🎉 Kit instalado! Próximos passos:"
echo "  1. Preencha .claude/settings.local.json com seus tokens"
echo "  2. Rode: /onboard    (onboarding interativo)"
echo "  3. Rode: /grill-me   (validação socrática A/B/C/D)"
echo "  4. Rode: /skill-add  (criar nova skill)"