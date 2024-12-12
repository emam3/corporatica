import datetime
import json
import os
from Analyzers.image import process_image_histogram
from app import app
from flask import request, jsonify, send_from_directory
from models.RGBImage import ImageProcessingResult, RGBImage
from utils.api import api_route
from extensions import db
from utils.common import generate_uuid
from utils.constants import IMAGES_UPLOAD_FOLDER, RESULTS_FOLDER
from utils.images import allowed_file


from utils.segmentation_mask_model.MaskMaker import process_image_with_mask_rcnn


@api_route('/image-analysis', methods=['POST'])
def upload_and_analyze_image():
    """
    Unified API endpoint for image upload, storage, and histogram analysis
    """
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']

    # If no selected file
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # File validation
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        # Generate unique filename
        RANDOM_STRING = generate_uuid()
        img_extension = file.filename.rsplit('.', 1)[-1]  
        unique_filename = f"{RANDOM_STRING}.{img_extension}"
        filepath = os.path.join(IMAGES_UPLOAD_FOLDER, unique_filename)
        
        # Ensure upload directory exists
        os.makedirs(IMAGES_UPLOAD_FOLDER, exist_ok=True)
        
        # Save the file
        file.save(filepath)
        
        # Create RGBImage record
        new_image = RGBImage(
            id=RANDOM_STRING,
            name=file.filename,
            file_path=filepath,
            img_extension=img_extension
        )
        
        db.session.add(new_image)


        # Perform histogram analysis
        histogram_data = process_image_histogram(filepath)
        
        # Create ImageProcessingResult record
        processing_result = ImageProcessingResult(
            rgb_image_id=new_image.id,
            operation='color_histogram',
            parameters={'bins': 256},
            result_path=filepath,
            executed_at=datetime.datetime.now()
        )

        db.session.add(processing_result)
        
        # Commit database transactions
        db.session.commit()
        
        os.makedirs(RESULTS_FOLDER, exist_ok=True)

        # Create filename with image ID and timestamp
        filename = f"{RANDOM_STRING}.json"
        filepath = os.path.join(RESULTS_FOLDER, filename)
    
        # Write histogram data to JSON file
        with open(filepath, 'w') as f:
            json.dump(histogram_data, f, indent=4)

        process_image_with_mask_rcnn(RANDOM_STRING, img_extension, filepath)

        return jsonify({
            'message': 'Image uploaded and analyzed successfully',
            'image_id': new_image.id,
            'result_id': processing_result.id,
            'histogram': histogram_data
        }), 201
    
    except Exception as e:
        # Rollback the session in case of error
        db.session.rollback()
        return jsonify({
            'error': 'Image processing failed',
            'details': str(e)
        }), 500
    
@api_route('/get-histogram', methods=['POST'])
def get_histogram_results():
    """ 330c05a0-a953-4800-ac99-47882614e7df
    Retrieve histogram results for a specific file
    """
    # Get filename from request
    data = request.json
    filename = data.get('filename')

    # Validate filename
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    # Construct full file path
    filepath = os.path.join(RESULTS_FOLDER, filename)

    # Check if file exists
    if not os.path.exists(filepath):
        return jsonify({'error': 'Histogram results file not found'}), 404

    try:
        # Read and return the JSON file contents
        with open(filepath, 'r') as f:
            histogram_data = json.load(f)

        return jsonify({
            'histogram': histogram_data,
            'filename': filename
        })

    except Exception as e:
        return jsonify({
            'error': 'Error reading histogram results',
            'details': str(e)
        }), 500
    
@app.route('/image/<path:filename>', methods=['GET'])
def serve_uploaded_file(filename):
    return send_from_directory('results', filename)