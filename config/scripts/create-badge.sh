#!/bin/bash

# Leer el valor de cobertura promedio
COVERAGE=$(cat coverage/coverage-summary.json | jq '.total')
LINES=$(echo $COVERAGE | jq '.lines.pct')
FUNCTIONS=$(echo $COVERAGE | jq '.functions.pct')
STATEMENTS=$(echo $COVERAGE | jq '.statements.pct')
BRANCHES=$(echo $COVERAGE | jq '.branches.pct')
AVERAGE=$(echo "($LINES + $FUNCTIONS + $STATEMENTS + $BRANCHES) / 4" | bc -l)

# Redondear el valor de cobertura promedio
AVERAGE_ROUNDED=$(printf "%.2f" $AVERAGE)

# Generar la URL del badge
BADGE_URL="https://img.shields.io/badge/Coverage-$AVERAGE_ROUNDED%25-brightgreen"

# Actualizar el README.md con la nueva URL del badge
# sed -i "s|!\[Coverage\](.*)|![Coverage]($BADGE_URL)|" README.md

echo $BADGE_URL
