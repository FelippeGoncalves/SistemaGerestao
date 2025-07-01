#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app
from src.models.user import db
from src.models.project import Project
from src.models.developer import Developer
from src.models.time_entry import TimeEntry

def populate_database():
    with app.app_context():
        # Limpar dados existentes
        db.drop_all()
        db.create_all()
        
        # Criar desenvolvedores
        developers_data = [
            {
                'name': 'João Silva',
                'email': 'joao.silva@email.com',
                'seniority': 'senior',
                'hourly_rate': 120
            },
            {
                'name': 'Maria Santos',
                'email': 'maria.santos@email.com',
                'seniority': 'pleno',
                'hourly_rate': 85
            },
            {
                'name': 'Pedro Costa',
                'email': 'pedro.costa@email.com',
                'seniority': 'junior',
                'hourly_rate': 60
            }
        ]
        
        developers = []
        for dev_data in developers_data:
            developer = Developer(**dev_data)
            db.session.add(developer)
            developers.append(developer)
        
        db.session.commit()
        
        # Criar projetos
        projects_data = [
            {
                'name': 'Sistema E-commerce',
                'total_hours': 120,
                'description': 'Desenvolvimento de plataforma de e-commerce completa com React e Node.js',
                'cell': 101,
                'client': 1001,
                'service': 2001
            },
            {
                'name': 'App Mobile Delivery',
                'total_hours': 80,
                'description': 'Aplicativo mobile para delivery de comida com React Native',
                'cell': 102,
                'client': 1002,
                'service': 2002
            },
            {
                'name': 'Dashboard Analytics',
                'total_hours': 60,
                'description': 'Dashboard para análise de dados e relatórios com D3.js',
                'cell': 103,
                'client': 1003,
                'service': 2003
            }
        ]
        
        projects = []
        for proj_data in projects_data:
            project = Project(**proj_data)
            db.session.add(project)
            projects.append(project)
        
        db.session.commit()
        
        # Criar lançamentos de tempo
        time_entries_data = [
            {
                'project_id': 1,
                'developer_id': 2,
                'description': 'Implementação do sistema de autenticação e cadastro de usuários',
                'hours': 8,
                'date': '28/06/2024'
            },
            {
                'project_id': 1,
                'developer_id': 1,
                'description': 'Desenvolvimento da API de produtos e categorias',
                'hours': 6,
                'date': '29/06/2024'
            },
            {
                'project_id': 2,
                'developer_id': 2,
                'description': 'Criação das telas de cadastro de produtos no app mobile',
                'hours': 7,
                'date': '29/06/2024'
            },
            {
                'project_id': 2,
                'developer_id': 3,
                'description': 'Setup inicial do projeto React Native e navegação',
                'hours': 4,
                'date': '30/06/2024'
            },
            {
                'project_id': 2,
                'developer_id': 3,
                'description': 'Implementação das telas de login e cadastro',
                'hours': 5,
                'date': '30/06/2024'
            },
            {
                'project_id': 3,
                'developer_id': 1,
                'description': 'Configuração do ambiente de desenvolvimento e estrutura base',
                'hours': 3,
                'date': '30/06/2024'
            },
            {
                'project_id': 1,
                'developer_id': 1,
                'description': 'Integração com gateway de pagamento e testes',
                'hours': 6,
                'date': '30/06/2024'
            },
            {
                'project_id': 3,
                'developer_id': 2,
                'description': 'Desenvolvimento da tela de listagem de restaurantes',
                'hours': 5,
                'date': '30/06/2024'
            },
            {
                'project_id': 3,
                'developer_id': 3,
                'description': 'Criação dos componentes de gráficos e métricas',
                'hours': 4,
                'date': '30/06/2024'
            }
        ]
        
        for entry_data in time_entries_data:
            time_entry = TimeEntry(**entry_data)
            db.session.add(time_entry)
        
        db.session.commit()
        
        print("✅ Banco de dados populado com sucesso!")
        print(f"📊 Criados: {len(developers)} desenvolvedores, {len(projects)} projetos, {len(time_entries_data)} lançamentos")

if __name__ == '__main__':
    populate_database()

