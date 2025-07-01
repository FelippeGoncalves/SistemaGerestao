#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app
from src.models.user import db
from src.models.project import Project
from src.models.developer import Developer
from src.models.time_entry import TimeEntry

def clear_database():
    with app.app_context():
        # Limpar todos os dados
        db.drop_all()
        db.create_all()
        
        print("✅ Banco de dados limpo com sucesso!")
        print("📊 Todas as tabelas foram recriadas vazias")
        print("🎯 Agora os dados serão inseridos apenas via interface")

if __name__ == '__main__':
    clear_database()

