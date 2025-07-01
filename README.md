# Sistema de Gestão de Projetos - Guia de Instalação

## 📋 Visão Geral

Este repositório contém um sistema completo de gestão de projetos com:
- **Backend**: Flask + SQLAlchemy + APIs REST
- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Deploy**: Scripts automatizados para Ubuntu

## 🖥️ Requisitos do Sistema

- **Sistema Operacional**: Ubuntu 20.04 LTS ou superior
- **RAM**: Mínimo 2GB (recomendado 4GB)
- **Armazenamento**: Mínimo 10GB livres
- **Rede**: Conexão com internet para download de dependências
- **Usuário**: Usuário não-root com privilégios sudo

## 📦 Estrutura do Repositório

```
SistemaGerestao/
├── sistema-gestao-backend/       # Backend Flask completo
│   ├── src/                     # Código fonte Python
│   │   ├── main.py             # Aplicação principal
│   │   ├── models/             # Modelos de dados
│   │   └── routes/             # Rotas da API
│   ├── static/                 # Frontend buildado (servido pelo Flask)
│   ├── requirements.txt        # Dependências Python
│   ├── populate_db.py         # Script de inicialização do banco
│   └── clear_db.py            # Script para limpar banco
├── frontend-source/            # Código fonte React
│   ├── src/                   # Código fonte React
│   │   ├── pages/            # Páginas principais (.jsx)
│   │   ├── components/       # Componentes reutilizáveis (.jsx)
│   │   └── services/         # Serviços e APIs
│   ├── package.json          # Dependências Node.js
│   └── vite.config.js        # Configuração do Vite
├── install.sh                # Script de instalação automática
├── backup.sh                 # Script de backup
├── check-system.sh           # Script de verificação
├── COMANDOS_RAPIDOS.md       # Comandos essenciais
└── README.md                 # Este arquivo
```

## 🚀 Instalação Automática (Recomendada)

### Opção 1: Clone e Execute

```bash
# 1. Clonar repositório
git clone https://github.com/FelippeGoncalves/SistemaGerestao.git
cd SistemaGerestao

# 2. Executar instalação automática
./install.sh
```

### Opção 2: Download e Execute

```bash
# 1. Download do repositório
wget https://github.com/FelippeGoncalves/SistemaGerestao/archive/main.zip
unzip main.zip
cd SistemaGerestao-main

# 2. Executar instalação
chmod +x install.sh
./install.sh
```

## 🔧 Instalação Manual

### 1. Preparar Ambiente

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y curl wget git build-essential software-properties-common

# Instalar Python 3.11
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Nginx
sudo apt install -y nginx
```

### 2. Configurar Backend

```bash
# Criar diretório do projeto
sudo mkdir -p /opt/sistema-gestao-projetos
sudo chown $USER:$USER /opt/sistema-gestao-projetos

# Copiar arquivos do backend
cp -r sistema-gestao-backend/* /opt/sistema-gestao-projetos/

# Navegar para o diretório
cd /opt/sistema-gestao-projetos

# Criar ambiente virtual
python3.11 -m venv venv
source venv/bin/activate

# Instalar dependências Python
pip install --upgrade pip
pip install -r requirements.txt

# Inicializar banco de dados
python populate_db.py
```

### 3. Configurar Frontend (Opcional - para desenvolvimento)

```bash
# Copiar código fonte do frontend
cp -r frontend-source /opt/sistema-gestao-projetos/

# Navegar para o frontend
cd /opt/sistema-gestao-projetos/frontend-source

# Instalar dependências
npm install

# Para desenvolvimento
npm run dev

# Para produção - fazer build
npm run build

# Copiar build para o backend
rm -rf ../static/*
cp -r dist/* ../static/
```

### 4. Configurar Serviços

#### Serviço Systemd

```bash
# Criar arquivo de serviço
sudo nano /etc/systemd/system/sistema-gestao.service
```

Conteúdo:
```ini
[Unit]
Description=Sistema de Gestão de Projetos
After=network.target

[Service]
Type=simple
User=seu-usuario
WorkingDirectory=/opt/sistema-gestao-projetos
Environment=PATH=/opt/sistema-gestao-projetos/venv/bin
ExecStart=/opt/sistema-gestao-projetos/venv/bin/python src/main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### Configuração Nginx

```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/sistema-gestao
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

#### Ativar Serviços

```bash
# Ativar configuração do Nginx
sudo ln -s /etc/nginx/sites-available/sistema-gestao /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Habilitar e iniciar serviços
sudo systemctl daemon-reload
sudo systemctl enable sistema-gestao
sudo systemctl start sistema-gestao
sudo systemctl enable nginx
sudo systemctl restart nginx
```

## 🏗️ Desenvolvimento

### Backend (Flask)

```bash
# Navegar para o backend
cd /opt/sistema-gestao-projetos

# Ativar ambiente virtual
source venv/bin/activate

# Executar em modo desenvolvimento
python src/main.py

# APIs disponíveis:
# GET    /api/projects
# POST   /api/projects
# PUT    /api/projects/<id>
# DELETE /api/projects/<id>
# GET    /api/developers
# POST   /api/developers
# PUT    /api/developers/<id>
# DELETE /api/developers/<id>
# GET    /api/time-entries
# POST   /api/time-entries
# PUT    /api/time-entries/<id>
# DELETE /api/time-entries/<id>
```

### Frontend (React)

```bash
# Navegar para o frontend
cd /opt/sistema-gestao-projetos/frontend-source

# Instalar dependências (se necessário)
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Copiar build para o backend
rm -rf ../static/*
cp -r dist/* ../static/

# Reiniciar backend para servir novo build
sudo systemctl restart sistema-gestao
```

## 🌐 Configuração de Domínio

### DNS e SSL

```bash
# 1. Configurar DNS para apontar para o IP do servidor

# 2. Editar configuração do Nginx
sudo nano /etc/nginx/sites-available/sistema-gestao

# Alterar server_name para seu domínio:
# server_name seu-dominio.com www.seu-dominio.com;

# 3. Instalar SSL com Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# 4. Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# 5. Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Comandos de Gerenciamento

### Controle do Sistema

```bash
# Status dos serviços
sudo systemctl status sistema-gestao
sudo systemctl status nginx

# Controlar backend
sudo systemctl start sistema-gestao
sudo systemctl stop sistema-gestao
sudo systemctl restart sistema-gestao

# Logs em tempo real
sudo journalctl -u sistema-gestao -f

# Verificação completa do sistema
./check-system.sh
```

### Backup e Restauração

```bash
# Backup automático
./backup.sh

# Backup manual do banco
cp /opt/sistema-gestao-projetos/database.db /opt/sistema-gestao-projetos/backup_$(date +%Y%m%d_%H%M%S).db

# Restaurar backup
sudo systemctl stop sistema-gestao
cp backup_YYYYMMDD_HHMMSS.db /opt/sistema-gestao-projetos/database.db
sudo systemctl start sistema-gestao
```

### Atualização do Sistema

```bash
# 1. Fazer backup
./backup.sh

# 2. Atualizar código
git pull origin main

# 3. Atualizar backend
cd /opt/sistema-gestao-projetos
source venv/bin/activate
pip install -r requirements.txt

# 4. Atualizar frontend (se necessário)
cd frontend-source
npm install
npm run build
rm -rf ../static/*
cp -r dist/* ../static/

# 5. Reiniciar serviços
sudo systemctl restart sistema-gestao
sudo systemctl restart nginx
```

## 🔒 Segurança

### Firewall

```bash
# Configurar UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Monitoramento

```bash
# Logs do sistema
sudo journalctl -u sistema-gestao -f

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Recursos do sistema
htop
df -h
free -h
```

## 🔧 Solução de Problemas

### Backend não inicia

```bash
# Verificar logs
sudo journalctl -u sistema-gestao -n 50

# Verificar porta
sudo netstat -tlnp | grep :8000

# Testar manualmente
cd /opt/sistema-gestao-projetos
source venv/bin/activate
python src/main.py
```

### Frontend não carrega

```bash
# Verificar se build existe
ls -la /opt/sistema-gestao-projetos/static/

# Refazer build
cd /opt/sistema-gestao-projetos/frontend-source
npm run build
rm -rf ../static/*
cp -r dist/* ../static/
sudo systemctl restart sistema-gestao
```

### Problemas de permissão

```bash
# Corrigir permissões
sudo chown -R $USER:$USER /opt/sistema-gestao-projetos
chmod +x /opt/sistema-gestao-projetos/venv/bin/python
```

## 📞 Suporte

### Arquivos de Log

- **Sistema**: `sudo journalctl -u sistema-gestao`
- **Nginx**: `/var/log/nginx/error.log`
- **Aplicação**: Logs aparecem no journalctl

### Comandos de Diagnóstico

```bash
# Verificação completa
./check-system.sh

# Status dos serviços
sudo systemctl status sistema-gestao nginx

# Conectividade
curl http://localhost
curl http://localhost/api/projects
```

## 🎯 URLs de Acesso

Após instalação bem-sucedida:

- **Local**: http://localhost
- **Rede**: http://IP-DO-SERVIDOR
- **API**: http://localhost/api/
- **Domínio**: http://seu-dominio.com (se configurado)

## 📝 Notas Importantes

- **Backup**: Sempre faça backup antes de atualizações
- **SSL**: Configure HTTPS para produção
- **Firewall**: Mantenha apenas portas necessárias abertas
- **Monitoramento**: Configure alertas para recursos do sistema
- **Atualizações**: Mantenha sistema operacional atualizado

O sistema estará disponível 24/7 e reiniciará automaticamente em caso de falha ou reinicialização do servidor.

