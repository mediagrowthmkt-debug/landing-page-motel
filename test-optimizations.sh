#!/bin/bash

# Script de Teste de Otimizações - Landing Page Motel Xenon
# Data: 17 de novembro de 2025

echo "======================================"
echo "🚀 TESTE DE OTIMIZAÇÕES - MOTEL XENON"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Contador
PASS=0
FAIL=0

# Função de teste
test_optimization() {
    local name=$1
    local command=$2
    local expected=$3
    
    echo -n "Testando: $name... "
    
    result=$(eval "$command")
    
    if [[ $result == *"$expected"* ]]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAIL++))
    fi
}

echo "📋 Verificando otimizações no HTML..."
echo ""

# 1. DNS Prefetch
test_optimization "DNS Prefetch" \
    "grep -c 'dns-prefetch' index.html" \
    "2"

# 2. Preconnect
test_optimization "Preconnect" \
    "grep -c 'preconnect' index.html" \
    "2"

# 3. Preload de fontes
test_optimization "Preload de fontes" \
    "grep -c 'rel=\"preload\"' index.html" \
    "1"

# 4. Critical CSS
test_optimization "Critical CSS inline" \
    "grep -c '<style>' index.html" \
    "1"

# 5. Lazy loading em imagens
test_optimization "Lazy loading em imagens" \
    "grep -c 'loading=\"lazy\"' index.html" \
    "7"

# 6. Dimensões explícitas
test_optimization "Width/Height em imagens" \
    "grep -c 'width=\"' index.html" \
    "10"

# 7. Preload none em vídeos
test_optimization "Preload none em vídeos" \
    "grep -c 'preload=\"none\"' index.html" \
    "16"

# 8. JavaScript defer
test_optimization "JavaScript defer" \
    "grep -c 'defer' index.html" \
    "1"

# 9. Font display swap
test_optimization "Font display swap" \
    "grep -c 'display=swap' index.html" \
    "2"

echo ""
echo "📋 Verificando otimizações no JavaScript..."
echo ""

# 10. Intersection Observer
test_optimization "Intersection Observer para vídeos" \
    "grep -c 'IntersectionObserver' js/script.js" \
    "2"

# 11. Lazy load de vídeos
test_optimization "Video lazy loading" \
    "grep -c 'videoObserver.observe' js/script.js" \
    "1"

echo ""
echo "======================================"
echo "📊 RESULTADOS"
echo "======================================"
echo -e "${GREEN}Testes aprovados: $PASS${NC}"
echo -e "${RED}Testes falhados: $FAIL${NC}"
echo ""

# Calcular percentual
TOTAL=$((PASS + FAIL))
PERCENTAGE=$((PASS * 100 / TOTAL))

echo "Percentual de sucesso: $PERCENTAGE%"
echo ""

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "${GREEN}✓ Excelente! Todas as otimizações foram implementadas corretamente.${NC}"
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "${YELLOW}⚠ Bom! Algumas otimizações precisam de atenção.${NC}"
else
    echo -e "${RED}✗ Atenção! Várias otimizações falharam.${NC}"
fi

echo ""
echo "======================================"
echo "📈 PRÓXIMOS PASSOS"
echo "======================================"
echo "1. Teste no PageSpeed Insights"
echo "2. Otimize as imagens (veja OTIMIZACAO-IMAGENS.md)"
echo "3. Compare os resultados antes/depois"
echo ""
echo "Para testar localmente:"
echo "  python3 -m http.server 8000"
echo "  Acesse: http://localhost:8000"
echo ""
