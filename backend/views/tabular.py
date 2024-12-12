import datetime
import os


from flask import jsonify, request
from werkzeug.utils import secure_filename

from extensions import db
from models.TabularData import TabularData
from utils.api import api_route
from utils.tabular import analyze_dataset, read_tabular_file


@api_route('/analyze-tabular', methods=['POST'])
def upload_tabular_file():
    """
    Upload and process a tabular file
    
    Expected form data:
    - file: The tabular file to upload
    - name: Name of the dataset
    - description: Optional description
    
    Returns:
    - JSON response with upload details
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Validate file type
    allowed_extensions = {'csv', 'xlsx', 'json'}
    if not file.filename.split('.')[-1].lower() in allowed_extensions:
        return jsonify({'error': 'Invalid file type'}), 400
    
    # Secure filename and create full path
    filename = secure_filename(file.filename)
    upload_folder = os.path.join(os.getcwd(), 'uploads', 'tabular')
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    
    try:
        # Read the file
        df = read_tabular_file(filepath)
        
        # Create database entry
        new_tabular_data = TabularData(
            name=request.form.get('name', filename),
            file_path=filepath,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
        db.session.add(new_tabular_data)
        db.session.commit()
        
        analysis = analyze_dataset(new_tabular_data.id)

        return jsonify({
            'message': 'File uploaded successfully',
            'dataset_id': new_tabular_data.id,
            'filename': filename,
            'columns': df.columns.tolist(),
            'row_count': len(df),
            'analysis': (analysis)
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500