# Comandos Rápidos - Sistema de Gestão de Projetos

## 🚀 Instalação

```bash
# Instalação automática
./install.sh

# Verificar instalação
./check-system.sh
```

## 🔧 Gerenciamento do Serviço

```bash
# Status
sudo systemctl status sistema-gestao

# Iniciar
sudo systemctl start sistema-gestao

# Parar
sudo systemctl stop sistema-gestao

# Reiniciar
sudo systemctl restart sistema-gestao

# Logs em tempo real
sudo journalctl -u sistema-gestao -f

# Últimas 50 linhas de log
sudo journalctl -u sistema-gestao -n 50
```

## 🌐 Nginx

```bash
# Status
sudo systemctl status nginx

# Reiniciar
sudo systemctl restart nginx

# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx
```

## 💾 Backup e Restauração

```bash
# Fazer backup
./backup.sh

# Backup manual do banco
sudo cp /opt/sistema-gestao-projetos/database.db /opt/sistema-gestao-projetos/backup_$(date +%Y%m%d_%H%M%S).db

# Restaurar backup
sudo cp /opt/sistema-gestao-projetos/backup_YYYYMMDD_HHMMSS.db /opt/sistema-gestao-projetos/database.db
sudo systemctl restart sistema-gestao
```

## 🗄️ Banco de Dados

```bash
# Limpar e recriar banco
cd /opt/sistema-gestao-projetos
source venv/bin/activate
python clear_db.py
python populate_db.py
sudo systemctl restart sistema-gestao
```

## 🔍 Diagnóstico

```bash
# Verificação completa do sistema
./check-system.sh

# Verificar portas em uso
sudo netstat -tlnp | grep -E ":(80|8000) "

# Testar conectividade
curl http://localhost
curl http://localhost/api/projects

# Verificar uso de recursos
htop
df -h
free -h
```

## 🔒 Firewall

```bash
# Status do firewall
sudo ufw status

# Permitir porta
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable
```

## 📁 Arquivos Importantes

```bash
# Diretório principal
/opt/sistema-gestao-projetos/

# Banco de dados
/opt/sistema-gestao-projetos/database.db

# Configuração do serviço
/etc/systemd/system/sistema-gestao.service

# Configuração do Nginx
/etc/nginx/sites-available/sistema-gestao

# Logs do sistema
sudo journalctl -u sistema-gestao

# Logs do Nginx
/var/log/nginx/access.log
/var/log/nginx/error.log
```

## 🌍 SSL/HTTPS (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovar certificados
sudo certbot renew

# Renovação automática (crontab)
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔄 Atualizações

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Reiniciar serviços após atualização
sudo systemctl restart sistema-gestao
sudo systemctl restart nginx
```

## 🆘 Solução de Problemas

```bash
# Serviço não inicia
sudo journalctl -u sistema-gestao -n 50
sudo systemctl status sistema-gestao

# Porta em uso
sudo lsof -i :8000
sudo kill -9 PID

# Permissões
sudo chown -R $USER:$USER /opt/sistema-gestao-projetos

# Recriar ambiente virtual
cd /opt/sistema-gestao-projetos
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📊 Monitoramento

```bash
# CPU e memória
top
htop

# Espaço em disco
df -h

# Logs em tempo real
sudo tail -f /var/log/nginx/access.log
sudo journalctl -u sistema-gestao -f

# Conexões ativas
sudo netstat -an | grep :80
```

## 🔧 URLs de Acesso

- **Local**: http://localhost
- **Rede**: http://IP-DO-SERVIDOR
- **API**: http://localhost/api/projects

## 📞 Comandos de Emergência

```bash
# Parar tudo
sudo systemctl stop sistema-gestao nginx

# Reiniciar tudo
sudo systemctl restart sistema-gestao nginx

# Verificar se está funcionando
curl -I http://localhost

# Logs de erro
sudo journalctl -u sistema-gestao --since "1 hour ago"
```

