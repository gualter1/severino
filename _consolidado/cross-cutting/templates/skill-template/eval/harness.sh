#!/usr/bin/env bash
# Eval Harness para Skills — skill-template
set -euo pipefail
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "🧪 Eval harness: $SKILL_DIR"
[ -f "$SKILL_DIR/SKILL.md" ] || { echo "❌ SKILL.md ausente"; exit 1; }
head -n 1 "$SKILL_DIR/SKILL.md" | grep -q "---" || { echo "❌ Frontmatter ausente"; exit 1; }
echo "✅ SKILL.md + frontmatter OK"
echo "🎉 harness OK"