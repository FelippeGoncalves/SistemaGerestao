#!/bin/bash

# Script de Backup - Sistema de Gestão de Projetos

PROJECT_DIR="/opt/sistema-gestao-projetos"
BACKUP_DIR="/opt/backups/sistema-gestao"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup se não existir
sudo mkdir -p $BACKUP_DIR

echo "Iniciando backup do Sistema de Gestão de Projetos..."

# Parar serviço temporariamente
echo "Parando serviço..."
sudo systemctl stop sistema-gestao

# Fazer backup do banco de dados
echo "Fazendo backup do banco de dados..."
sudo cp $PROJECT_DIR/database.db $BACKUP_DIR/database_$DATE.db

# Fazer backup dos arquivos de configuração
echo "Fazendo backup dos arquivos de configuração..."
sudo tar -czf $BACKUP_DIR/config_$DATE.tar.gz \
    /etc/systemd/system/sistema-gestao.service \
    /etc/nginx/sites-available/sistema-gestao

# Reiniciar serviço
echo "Reiniciando serviço..."
sudo systemctl start sistema-gestao

# Limpar backups antigos (manter apenas os últimos 7 dias)
echo "Limpando backups antigos..."
sudo find $BACKUP_DIR -name "database_*.db" -mtime +7 -delete
sudo find $BACKUP_DIR -name "config_*.tar.gz" -mtime +7 -delete

echo "Backup concluído com sucesso!"
echo "Arquivos salvos em: $BACKUP_DIR"
echo "- database_$DATE.db"
echo "- config_$DATE.tar.gz"

