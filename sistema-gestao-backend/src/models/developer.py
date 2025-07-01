from src.models.user import db
from datetime import datetime

class Developer(db.Model):
    __tablename__ = 'developers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    seniority = db.Column(db.String(20), nullable=False)  # 'junior', 'pleno', 'senior'
    hourly_rate = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com lançamentos de tempo
    time_entries = db.relationship('TimeEntry', backref='developer', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'seniority': self.seniority,
            'hourlyRate': self.hourly_rate,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Developer {self.name}>'

