from extensions import db
from utils.common import generate_uuid

class TextualData(db.Model):
    __tablename__ = 'textual_data'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    title = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    
    # Relationships
    analysis_results = db.relationship('TextAnalysisResult', backref='textual_data', lazy=True)
    
    def __repr__(self):
        return f'<TextualData {self.id}>'


class TextAnalysisResult(db.Model):
    __tablename__ = 'text_analysis_results'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    textual_data_id = db.Column(db.String, db.ForeignKey('textual_data.id'), nullable=False)
    created_at = db.Column(db.DateTime)

    def __repr__(self):
        return f'<TextAnalysisResult {self.id}>'