#!/bin/bash

# Script de Verificação - Sistema de Gestão de Projetos

echo "=========================================="
echo "  VERIFICAÇÃO DO SISTEMA"
echo "  Sistema de Gestão de Projetos"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_ok() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

check_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

PROJECT_DIR="/opt/sistema-gestao-projetos"

echo "1. Verificando arquivos do sistema..."

if [ -d "$PROJECT_DIR" ]; then
    check_ok "Diretório do projeto existe: $PROJECT_DIR"
else
    check_fail "Diretório do projeto não encontrado: $PROJECT_DIR"
fi

if [ -f "$PROJECT_DIR/src/main.py" ]; then
    check_ok "Arquivo principal encontrado"
else
    check_fail "Arquivo principal não encontrado"
fi

if [ -f "$PROJECT_DIR/database.db" ]; then
    check_ok "Banco de dados encontrado"
else
    check_warning "Banco de dados não encontrado (será criado na primeira execução)"
fi

echo ""
echo "2. Verificando dependências..."

# Python
if command -v python3.11 &> /dev/null; then
    check_ok "Python 3.11 instalado: $(python3.11 --version)"
else
    check_fail "Python 3.11 não encontrado"
fi

# Node.js
if command -v node &> /dev/null; then
    check_ok "Node.js instalado: $(node --version)"
else
    check_fail "Node.js não encontrado"
fi

# Nginx
if command -v nginx &> /dev/null; then
    check_ok "Nginx instalado: $(nginx -v 2>&1)"
else
    check_fail "Nginx não encontrado"
fi

echo ""
echo "3. Verificando serviços..."

# Serviço principal
if systemctl is-active --quiet sistema-gestao; then
    check_ok "Serviço sistema-gestao está rodando"
else
    check_fail "Serviço sistema-gestao não está rodando"
    echo "   Para iniciar: sudo systemctl start sistema-gestao"
fi

# Nginx
if systemctl is-active --quiet nginx; then
    check_ok "Nginx está rodando"
else
    check_fail "Nginx não está rodando"
    echo "   Para iniciar: sudo systemctl start nginx"
fi

echo ""
echo "4. Verificando portas..."

# Porta 8000 (aplicação)
if netstat -tlnp 2>/dev/null | grep -q ":8000 "; then
    check_ok "Porta 8000 está em uso (aplicação rodando)"
else
    check_warning "Porta 8000 não está em uso"
fi

# Porta 80 (Nginx)
if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
    check_ok "Porta 80 está em uso (Nginx rodando)"
else
    check_warning "Porta 80 não está em uso"
fi

echo ""
echo "5. Verificando conectividade..."

# Teste local
if curl -s http://localhost > /dev/null; then
    check_ok "Aplicação responde localmente"
else
    check_fail "Aplicação não responde localmente"
fi

# Teste da API
if curl -s http://localhost/api/projects > /dev/null; then
    check_ok "API responde corretamente"
else
    check_warning "API não responde (pode ser normal se não houver dados)"
fi

echo ""
echo "6. Informações do sistema..."

check_info "Sistema operacional: $(lsb_release -d | cut -f2)"
check_info "Kernel: $(uname -r)"
check_info "Memória total: $(free -h | awk '/^Mem:/ {print $2}')"
check_info "Espaço em disco: $(df -h / | awk 'NR==2 {print $4}') disponível"
check_info "Uptime: $(uptime -p)"

# IP do servidor
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
check_info "IP do servidor: $SERVER_IP"

echo ""
echo "7. URLs de acesso..."

echo "   Local:  http://localhost"
echo "   Rede:   http://$SERVER_IP"

echo ""
echo "8. Logs recentes..."

echo "Últimas 5 linhas do log do sistema:"
sudo journalctl -u sistema-gestao -n 5 --no-pager

echo ""
echo "=========================================="
echo "Verificação concluída!"
echo ""
echo "Para mais informações:"
echo "  Logs:   sudo journalctl -u sistema-gestao -f"
echo "  Status: sudo systemctl status sistema-gestao"
echo "=========================================="

