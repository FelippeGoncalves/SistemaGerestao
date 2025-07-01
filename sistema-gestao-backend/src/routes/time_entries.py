from flask import Blueprint, request, jsonify
from src.models.time_entry import TimeEntry, db

time_entries_bp = Blueprint('time_entries', __name__)

@time_entries_bp.route('/time-entries', methods=['GET'])
def get_time_entries():
    """Listar todos os lançamentos de tempo"""
    try:
        time_entries = TimeEntry.query.all()
        return jsonify([entry.to_dict() for entry in time_entries]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@time_entries_bp.route('/time-entries', methods=['POST'])
def create_time_entry():
    """Criar um novo lançamento de tempo"""
    try:
        data = request.get_json()
        
        required_fields = ['projectId', 'developerId', 'description', 'hours', 'date']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Todos os campos são obrigatórios: projectId, developerId, description, hours, date'}), 400
        
        time_entry = TimeEntry(
            project_id=data['projectId'],
            developer_id=data['developerId'],
            description=data['description'],
            hours=data['hours'],
            date=data['date']
        )
        
        db.session.add(time_entry)
        db.session.commit()
        
        return jsonify(time_entry.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@time_entries_bp.route('/time-entries/<int:entry_id>', methods=['GET'])
def get_time_entry(entry_id):
    """Obter um lançamento específico"""
    try:
        time_entry = TimeEntry.query.get_or_404(entry_id)
        return jsonify(time_entry.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@time_entries_bp.route('/time-entries/<int:entry_id>', methods=['PUT'])
def update_time_entry(entry_id):
    """Atualizar um lançamento de tempo"""
    try:
        time_entry = TimeEntry.query.get_or_404(entry_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        time_entry.project_id = data.get('projectId', time_entry.project_id)
        time_entry.developer_id = data.get('developerId', time_entry.developer_id)
        time_entry.description = data.get('description', time_entry.description)
        time_entry.hours = data.get('hours', time_entry.hours)
        time_entry.date = data.get('date', time_entry.date)
        
        db.session.commit()
        
        return jsonify(time_entry.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@time_entries_bp.route('/time-entries/<int:entry_id>', methods=['DELETE'])
def delete_time_entry(entry_id):
    """Deletar um lançamento de tempo"""
    try:
        time_entry = TimeEntry.query.get_or_404(entry_id)
        db.session.delete(time_entry)
        db.session.commit()
        
        return jsonify({'message': 'Lançamento deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@time_entries_bp.route('/time-entries/by-developer/<int:developer_id>', methods=['GET'])
def get_time_entries_by_developer(developer_id):
    """Obter lançamentos por desenvolvedor"""
    try:
        time_entries = TimeEntry.query.filter_by(developer_id=developer_id).all()
        return jsonify([entry.to_dict() for entry in time_entries]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@time_entries_bp.route('/time-entries/by-project/<int:project_id>', methods=['GET'])
def get_time_entries_by_project(project_id):
    """Obter lançamentos por projeto"""
    try:
        time_entries = TimeEntry.query.filter_by(project_id=project_id).all()
        return jsonify([entry.to_dict() for entry in time_entries]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

