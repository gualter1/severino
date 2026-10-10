#!/usr/bin/env bash
# post-merge.sh — Sync deps/index após merge
set -euo pipefail

echo "🔄 Post-merge sync"

# Sync deps se package.json/pnpm-lock.yaml/pyproject.toml mudou
if git diff HEAD@{1}..HEAD --name-only | grep -qE 'package\.json|pnpm-lock\.yaml|pyproject\.toml|requirements\.txt'; then
  echo "  → Dependencies changed, installing..."
  if [ -f package.json ]; then
    if command -v pnpm >/dev/null && [ -f pnpm-lock.yaml ]; then
      pnpm install --frozen-lockfile
    else
      npm ci
    fi
  elif [ -f pyproject.toml ]; then
    pip install -e . 2>/dev/null || pip install -r requirements.txt 2>/dev/null
  fi
fi

# Reindex skill index se skillpper presente
if [ -f scripts/update_skills_index.py ]; then
  echo "  → Regenerating skill index..."
  python scripts/update_skills_index.py
fi

echo "✅ Post-merge sync done"