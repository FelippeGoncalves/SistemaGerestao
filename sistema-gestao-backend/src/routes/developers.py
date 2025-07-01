from flask import Blueprint, request, jsonify
from src.models.developer import Developer, db

developers_bp = Blueprint('developers', __name__)

@developers_bp.route('/developers', methods=['GET'])
def get_developers():
    """Listar todos os desenvolvedores"""
    try:
        developers = Developer.query.all()
        return jsonify([developer.to_dict() for developer in developers]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@developers_bp.route('/developers', methods=['POST'])
def create_developer():
    """Criar um novo desenvolvedor"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('email'):
            return jsonify({'error': 'Nome e email são obrigatórios'}), 400
        
        # Verificar se email já existe
        existing_developer = Developer.query.filter_by(email=data['email']).first()
        if existing_developer:
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        developer = Developer(
            name=data['name'],
            email=data['email'],
            seniority=data.get('seniority', 'junior'),
            hourly_rate=data.get('hourlyRate', 0)
        )
        
        db.session.add(developer)
        db.session.commit()
        
        return jsonify(developer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@developers_bp.route('/developers/<int:developer_id>', methods=['GET'])
def get_developer(developer_id):
    """Obter um desenvolvedor específico"""
    try:
        developer = Developer.query.get_or_404(developer_id)
        return jsonify(developer.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@developers_bp.route('/developers/<int:developer_id>', methods=['PUT'])
def update_developer(developer_id):
    """Atualizar um desenvolvedor"""
    try:
        developer = Developer.query.get_or_404(developer_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Verificar se email já existe (exceto o próprio desenvolvedor)
        if 'email' in data and data['email'] != developer.email:
            existing_developer = Developer.query.filter_by(email=data['email']).first()
            if existing_developer:
                return jsonify({'error': 'Email já cadastrado'}), 400
        
        developer.name = data.get('name', developer.name)
        developer.email = data.get('email', developer.email)
        developer.seniority = data.get('seniority', developer.seniority)
        developer.hourly_rate = data.get('hourlyRate', developer.hourly_rate)
        
        db.session.commit()
        
        return jsonify(developer.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@developers_bp.route('/developers/<int:developer_id>', methods=['DELETE'])
def delete_developer(developer_id):
    """Deletar um desenvolvedor"""
    try:
        developer = Developer.query.get_or_404(developer_id)
        db.session.delete(developer)
        db.session.commit()
        
        return jsonify({'message': 'Desenvolvedor deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

