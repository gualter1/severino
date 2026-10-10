#!/usr/bin/env bash
# Assign buddy — round-robin simples por arquivo de roster.
# Uso: ./assign-buddy.sh "Nome Novato" [roster.txt]
set -euo pipefail
NOVATO="${1:?Uso: $0 \"Nome Novato\" [roster.txt]}"
ROSTER="${2:-roster.txt}"
STATE=".buddy-state"
touch "$STATE" "$ROSTER"
IDX=$(cat "$STATE" 2>/dev/null || echo 0)
TOTAL=$(wc -l < "$ROSTER")
[ "$TOTAL" -eq 0 ] && { echo "Roster vazio: $ROSTER"; exit 1; }
BUDDY=$(sed -n "$(( IDX % TOTAL + 1 ))p" "$ROSTER")
echo "$(( IDX + 1 ))" > "$STATE"
echo "Novato: $NOVATO | Buddy: $BUDDY"
echo "Preencha templates/buddy-assignment.md com esses nomes."