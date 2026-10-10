#!/usr/bin/env bash
# Track progress — conta checkboxes do checklist.md
# Uso: ./track-progress.sh [checklist.md]
set -euo pipefail
F="${1:-checklist.md}"
TOTAL=$(grep -c -- '- \[ \]\|- \[x\]' "$F" || true)
DONE=$(grep -c -- '- \[x\]' "$F" || true)
[ "$TOTAL" -eq 0 ] && { echo "Nenhum checkbox em $F"; exit 0; }
PCT=$(( DONE * 100 / TOTAL ))
echo "Progresso: $DONE/$TOTAL ($PCT%) — $F"
[ "$PCT" -lt 100 ] && { echo "Faltando:"; grep -n -- '- \[ \]' "$F"; }