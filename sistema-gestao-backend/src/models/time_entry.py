from src.models.user import db
from datetime import datetime

class TimeEntry(db.Model):
    __tablename__ = 'time_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    developer_id = db.Column(db.Integer, db.ForeignKey('developers.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    hours = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(10), nullable=False)  # Formato DD/MM/YYYY
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'projectId': self.project_id,
            'developerId': self.developer_id,
            'description': self.description,
            'hours': self.hours,
            'date': self.date,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<TimeEntry {self.id} - {self.hours}h>'

