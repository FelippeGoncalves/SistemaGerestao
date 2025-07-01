#!/bin/bash

# Script de Instalação - Sistema de Gestão de Projetos
# Para Ubuntu 20.04+ (servidor zerado)
# Instala Backend Flask + Frontend React

set -e  # Parar execução em caso de erro

echo "=========================================="
echo "  SISTEMA DE GESTÃO DE PROJETOS"
echo "  Script de Instalação Automática"
echo "  Backend Flask + Frontend React"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se é root
if [[ $EUID -eq 0 ]]; then
   log_error "Este script não deve ser executado como root"
   exit 1
fi

# Verificar distribuição Ubuntu
if ! grep -q "Ubuntu" /etc/os-release; then
    log_error "Este script é destinado para Ubuntu. Distribuição atual não suportada."
    exit 1
fi

log_info "Iniciando instalação do Sistema de Gestão de Projetos..."

# 1. Atualizar sistema
log_info "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências básicas
log_info "Instalando dependências básicas..."
sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# 3. Instalar Python 3.11
log_info "Instalando Python 3.11..."
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# 4. Instalar Node.js 20.x
log_info "Instalando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Verificar versões instaladas
log_info "Verificando versões instaladas..."
python3.11 --version
node --version
npm --version

# 6. Criar diretório do projeto
PROJECT_DIR="/opt/sistema-gestao-projetos"
log_info "Criando diretório do projeto em $PROJECT_DIR..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# 7. Copiar arquivos do backend
log_info "Copiando arquivos do backend..."
cp -r ./sistema-gestao-backend/* $PROJECT_DIR/

# 8. Criar ambiente virtual Python
log_info "Criando ambiente virtual Python..."
cd $PROJECT_DIR
python3.11 -m venv venv
source venv/bin/activate

# 9. Instalar dependências Python
log_info "Instalando dependências Python..."
pip install --upgrade pip
pip install -r requirements.txt

# 10. Inicializar banco de dados
log_info "Inicializando banco de dados..."
python populate_db.py

# 11. Configurar Frontend (se código fonte disponível)
if [ -d "../frontend-source" ]; then
    log_info "Código fonte do frontend encontrado. Fazendo build..."
    
    # Copiar código fonte do frontend
    cp -r ../frontend-source $PROJECT_DIR/
    cd $PROJECT_DIR/frontend-source
    
    # Instalar dependências do frontend
    log_info "Instalando dependências do frontend..."
    npm install
    
    # Fazer build do frontend
    log_info "Fazendo build do frontend..."
    npm run build
    
    # Copiar build para pasta static do backend
    log_info "Copiando build para o backend..."
    rm -rf ../static/*
    cp -r dist/* ../static/
    
    cd $PROJECT_DIR
else
    log_warning "Código fonte do frontend não encontrado. Usando build pré-compilado."
fi

# 12. Criar arquivo de configuração systemd
log_info "Criando serviço systemd..."
sudo tee /etc/systemd/system/sistema-gestao.service > /dev/null <<EOF
[Unit]
Description=Sistema de Gestão de Projetos
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
Environment=PATH=$PROJECT_DIR/venv/bin
ExecStart=$PROJECT_DIR/venv/bin/python src/main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 13. Instalar e configurar Nginx
log_info "Instalando e configurando Nginx..."
sudo apt install -y nginx

# 14. Configurar Nginx como proxy reverso
sudo tee /etc/nginx/sites-available/sistema-gestao > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# 15. Ativar configuração do Nginx
sudo ln -sf /etc/nginx/sites-available/sistema-gestao /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 16. Testar configuração do Nginx
sudo nginx -t

# 17. Configurar firewall
log_info "Configurando firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 18. Habilitar e iniciar serviços
log_info "Habilitando e iniciando serviços..."
sudo systemctl daemon-reload
sudo systemctl enable sistema-gestao
sudo systemctl start sistema-gestao
sudo systemctl enable nginx
sudo systemctl restart nginx

# 19. Verificar status dos serviços
log_info "Verificando status dos serviços..."
sleep 5

if sudo systemctl is-active --quiet sistema-gestao; then
    log_success "Serviço sistema-gestao está rodando"
else
    log_error "Falha ao iniciar serviço sistema-gestao"
    sudo systemctl status sistema-gestao
fi

if sudo systemctl is-active --quiet nginx; then
    log_success "Nginx está rodando"
else
    log_error "Falha ao iniciar Nginx"
    sudo systemctl status nginx
fi

# 20. Obter IP do servidor
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo "=========================================="
log_success "INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "=========================================="
echo ""
log_info "Sistema de Gestão de Projetos instalado e configurado!"
echo ""
echo "📍 Acesso ao sistema:"
echo "   Local: http://localhost"
echo "   Rede:  http://$SERVER_IP"
echo ""
echo "🔧 Comandos úteis:"
echo "   Status:    sudo systemctl status sistema-gestao"
echo "   Parar:     sudo systemctl stop sistema-gestao"
echo "   Iniciar:   sudo systemctl start sistema-gestao"
echo "   Reiniciar: sudo systemctl restart sistema-gestao"
echo "   Logs:      sudo journalctl -u sistema-gestao -f"
echo ""
echo "📁 Diretórios:"
echo "   Backend:   $PROJECT_DIR"
echo "   Frontend:  $PROJECT_DIR/frontend-source (código fonte)"
echo "   Static:    $PROJECT_DIR/static (build do frontend)"
echo ""
log_warning "IMPORTANTE: Configure seu DNS/domínio para apontar para $SERVER_IP"
echo ""
echo "=========================================="

