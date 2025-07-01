# Sistema de Gestão de Projetos - Guia de Instalação

## 📋 Visão Geral

Este pacote contém todos os arquivos necessários para instalar e configurar o Sistema de Gestão de Projetos em um servidor Ubuntu zerado.

## 🖥️ Requisitos do Sistema

- **Sistema Operacional**: Ubuntu 20.04 LTS ou superior
- **RAM**: Mínimo 2GB (recomendado 4GB)
- **Armazenamento**: Mínimo 10GB livres
- **Rede**: Conexão com internet para download de dependências
- **Usuário**: Usuário não-root com privilégios sudo

## 📦 Conteúdo do Pacote

```
sistema-gestao-deploy-package/
├── install.sh                    # Script de instalação automática
├── README.md                     # Este arquivo
└── sistema-gestao-backend/       # Aplicação backend completa
    ├── src/                      # Código fonte Python/Flask
    ├── static/                   # Frontend React buildado
    ├── requirements.txt          # Dependências Python
    ├── populate_db.py           # Script de inicialização do banco
    └── clear_db.py              # Script para limpar banco
```

## 🚀 Instalação Automática (Recomendada)

### Passo 1: Preparar o Servidor

```bash
# 1. Conectar ao servidor via SSH
ssh usuario@seu-servidor.com

# 2. Atualizar sistema (opcional, o script fará isso)
sudo apt update && sudo apt upgrade -y
```

### Passo 2: Fazer Upload do Pacote

```bash
# Opção A: Via SCP (do seu computador local)
scp -r sistema-gestao-deploy-package/ usuario@seu-servidor.com:~/

# Opção B: Via wget (se disponível online)
wget https://seu-site.com/sistema-gestao-deploy-package.tar.gz
tar -xzf sistema-gestao-deploy-package.tar.gz

# Opção C: Via Git (se em repositório)
git clone https://github.com/seu-usuario/sistema-gestao-deploy-package.git
```

### Passo 3: Executar Instalação

```bash
# Navegar para o diretório
cd sistema-gestao-deploy-package/

# Executar script de instalação
./install.sh
```

### Passo 4: Verificar Instalação

```bash
# Verificar status do serviço
sudo systemctl status sistema-gestao

# Verificar logs
sudo journalctl -u sistema-gestao -f

# Testar acesso local
curl http://localhost
```

## 🔧 Instalação Manual (Avançada)

Se preferir instalar manualmente ou personalizar a instalação:

### 1. Instalar Dependências

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

### 2. Configurar Aplicação

```bash
# Criar diretório do projeto
sudo mkdir -p /opt/sistema-gestao-projetos
sudo chown $USER:$USER /opt/sistema-gestao-projetos

# Copiar arquivos
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

### 3. Configurar Serviço Systemd

```bash
# Criar arquivo de serviço
sudo nano /etc/systemd/system/sistema-gestao.service
```

Conteúdo do arquivo:

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

### 4. Configurar Nginx

```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/sistema-gestao
```

Conteúdo do arquivo:

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

### 5. Ativar Serviços

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

## 🌐 Configuração de Domínio (Opcional)

### Para usar um domínio personalizado:

1. **Configure seu DNS** para apontar para o IP do servidor
2. **Edite a configuração do Nginx**:

```bash
sudo nano /etc/nginx/sites-available/sistema-gestao
```

Altere a linha `server_name _;` para:
```nginx
server_name seu-dominio.com www.seu-dominio.com;
```

3. **Instale SSL com Let's Encrypt** (recomendado):

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar linha: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 Configuração de Firewall

```bash
# Configurar UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 📊 Comandos de Gerenciamento

### Controle do Serviço

```bash
# Ver status
sudo systemctl status sistema-gestao

# Iniciar
sudo systemctl start sistema-gestao

# Parar
sudo systemctl stop sistema-gestao

# Reiniciar
sudo systemctl restart sistema-gestao

# Ver logs em tempo real
sudo journalctl -u sistema-gestao -f

# Ver logs das últimas 100 linhas
sudo journalctl -u sistema-gestao -n 100
```

### Backup do Banco de Dados

```bash
# Fazer backup
cp /opt/sistema-gestao-projetos/database.db /opt/sistema-gestao-projetos/backup_$(date +%Y%m%d_%H%M%S).db

# Restaurar backup
cp /opt/sistema-gestao-projetos/backup_YYYYMMDD_HHMMSS.db /opt/sistema-gestao-projetos/database.db
sudo systemctl restart sistema-gestao
```

### Limpar Banco de Dados

```bash
cd /opt/sistema-gestao-projetos
source venv/bin/activate
python clear_db.py
python populate_db.py
sudo systemctl restart sistema-gestao
```

## 🔧 Solução de Problemas

### Serviço não inicia

```bash
# Verificar logs detalhados
sudo journalctl -u sistema-gestao -n 50

# Verificar se a porta está em uso
sudo netstat -tlnp | grep :8000

# Testar manualmente
cd /opt/sistema-gestao-projetos
source venv/bin/activate
python src/main.py
```

### Nginx não funciona

```bash
# Testar configuração
sudo nginx -t

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Problemas de permissão

```bash
# Corrigir permissões
sudo chown -R $USER:$USER /opt/sistema-gestao-projetos
chmod +x /opt/sistema-gestao-projetos/venv/bin/python
```

## 📞 Suporte

Para suporte técnico ou dúvidas:

1. Verifique os logs do sistema
2. Consulte a seção de solução de problemas
3. Entre em contato com a equipe de desenvolvimento

## 📝 Notas Importantes

- **Backup**: Sempre faça backup do banco de dados antes de atualizações
- **Segurança**: Configure SSL/HTTPS para produção
- **Monitoramento**: Configure monitoramento de logs e recursos
- **Atualizações**: Mantenha o sistema operacional atualizado

## 🎯 Acesso ao Sistema

Após a instalação bem-sucedida:

- **Local**: http://localhost
- **Rede**: http://IP-DO-SERVIDOR
- **Domínio**: http://seu-dominio.com (se configurado)

O sistema estará disponível 24/7 e reiniciará automaticamente em caso de falha ou reinicialização do servidor.

