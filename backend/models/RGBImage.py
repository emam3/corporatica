from extensions import db
from utils.common import generate_uuid

class RGBImage(db.Model):
    __tablename__ = 'rgb_images'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    file_path = db.Column(db.String, nullable=False)
    img_extension = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime)

    # Relationships
    processing_results = db.relationship('ImageProcessingResult', backref='rgb_image', lazy=True)
    def __repr__(self):
        return f'<RGBImage {self.id}>'
    
    
class ImageProcessingResult(db.Model):
    __tablename__ = 'image_processing_results'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    rgb_image_id = db.Column(db.String, db.ForeignKey('rgb_images.id'), nullable=False)
    operation = db.Column(db.String(50), nullable=False)
    parameters = db.Column(db.JSON, nullable=True)
    result_path = db.Column(db.String, nullable=True)
    executed_at = db.Column(db.DateTime)

    def __repr__(self):
        return f'<ImageProcessingResult {self.id}>'
