

from datetime import datetime
import os
from flask import jsonify, request
from werkzeug.utils import secure_filename
from Analyzers.textual import analyze_text_content, generate_tsne_visualization_from_file
from extensions import db
from models import TextualData, TextAnalysisResult
from utils.api import api_route
from utils.common import generate_uuid
from utils.textual import read_text_file


@api_route('/text-process', methods=['POST'])
def process_text_file():
    """
    Upload, store, and analyze a text file
    
    Expected form data:
    - file: The .txt file to upload
    - title: Title of the text document
    
    Returns:
    - JSON response with upload details and analysis results
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Validate file type
    if not file.filename.lower().endswith('.txt'):
        return jsonify({'error': 'Only .txt files are allowed'}), 400


    new_id=generate_uuid()

    # Secure filename and create full path
    filename = secure_filename(file.filename)
    upload_folder = os.path.join(os.getcwd(), 'uploads', 'text')
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, new_id)
    file.save(filepath)

    try:
        # Read the file content
        text_content = read_text_file(filepath)
        REQUIRED_SERVICES = request.form.get('services')

        # Create database entry
        new_textual_data = TextualData(
            title=request.form.get('title', filename),
            file_path=filepath,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_textual_data)
        db.session.commit()


        new_textual_data_results = TextAnalysisResult(
            id=new_id,
            textual_data_id=new_textual_data.id,
            created_at=datetime.now()
        )

        db.session.add(new_textual_data_results)
        db.session.commit()

        # Analyze the text using helper function
        analysis_result = analyze_text_content(text_content, REQUIRED_SERVICES)

        if 't-sne' in REQUIRED_SERVICES:
            generate_tsne_visualization_from_file(new_id, new_id)

        return jsonify({
            'message': 'File uploaded and analyzed successfully',
            'dataset_id': new_id,
            'filename': filename,
            'text_preview': text_content[:200] + '...' if len(text_content) > 200 else text_content,
            'analysis_result': analysis_result
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500