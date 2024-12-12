from extensions import db
from utils.common import generate_uuid

class TabularData(db.Model):
    __tablename__ = 'tabular_data'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    file_path = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

    # Relationships
    queries = db.relationship('TabularDataQuery', backref='tabular_data', lazy=True)
    
    def __repr__(self):
        return f'<TabularData {self.id}>'

class TabularDataQuery(db.Model):
    __tablename__ = 'tabular_data_queries'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    tabular_data_id = db.Column(db.String, db.ForeignKey('tabular_data.id'), nullable=False)
    query = db.Column(db.Text, nullable=False)
    result = db.Column(db.JSON, nullable=True)
    executed_at = db.Column(db.DateTime)

    def __repr__(self):
        return f'<TabularDataQuery {self.id}>'
