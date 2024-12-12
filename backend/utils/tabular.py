import datetime
import json
import os
from extensions import db
import numpy as np
import pandas as pd
from flask import Blueprint, jsonify

from models.TabularData import TabularData, TabularDataQuery

tabular_bp = Blueprint('tabular', __name__)

# Configuration
UPLOAD_FOLDER = 'uploads/tabular'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'json'}

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def read_tabular_file(filepath):
    """
    Read tabular file based on its extension
    
    Args:
    - filepath: Full path to the uploaded file
    
    Returns:
    - Pandas DataFrame
    """
    file_extension = filepath.split('.')[-1].lower()
    
    try:
        if file_extension == 'csv':
            return pd.read_csv(filepath)
        elif file_extension == 'xlsx':
            return pd.read_excel(filepath)
        elif file_extension == 'json':
            return pd.read_json(filepath)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
    except Exception as e:
        raise ValueError(f"Error reading file: {str(e)}")
    


def identify_outliers(series):
    """
    Identify outliers using IQR method
    
    Args:
    - series: Pandas Series of numeric data
    
    Returns:
    - List of outlier values
    """
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    
    # Define outliers as points beyond 1.5 * IQR
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    # Convert to list of outliers
    outliers = series[(series < lower_bound) | (series > upper_bound)].tolist()
    
    return [float(x) for x in outliers]


def analyze_dataset(dataset_id):
    """
    Perform comprehensive statistical analysis on a dataset
    
    Parameters:
    - dataset_id: ID of the uploaded dataset
    
    Returns:
    - Dictionary with comprehensive statistics for numeric columns
    """
    # Find the dataset
    dataset = TabularData.query.get_or_404(dataset_id)
    
    try:
        # Read the file
        df = read_tabular_file(dataset.file_path)
        
        # Prepare comprehensive analysis
        analysis = {
            'columns': {},  # Will store both column name and index
            'details': {}   # Will store statistical analysis
        }
        
        # Identify numeric columns with both their index and name
        numeric_columns = df.select_dtypes(include=[np.number]).columns

        for idx, column in enumerate(numeric_columns):
            series = df[column]
            column_name = column if not pd.isna(column) else f'Unnamed_{idx}'
            
            column_analysis = {
                'basic_stats': {
                    'mean': float(series.mean()),
                    'median': float(series.median()),
                    'mode': float(series.mode().iloc[0]) if not series.mode().empty else None,
                    'min': float(series.min()),
                    'max': float(series.max())
                },
                'quartiles': {
                    'Q1': float(series.quantile(0.25)),
                    'Q2': float(series.median()),
                    'Q3': float(series.quantile(0.75))
                },
                'outliers': identify_outliers(series)
            }
            
            # Store column information and analysis
            analysis['columns'][idx] = {
                'name': column_name,
                'type': str(series.dtype)
            }
            analysis['details'][column_name] = column_analysis
        
        # Optional: Save query result
        query_result = TabularDataQuery(
            tabular_data_id=dataset_id,
            query='Comprehensive Statistical Analysis',
            result=json.dumps(analysis),
            executed_at=datetime.datetime.now()
        )
        db.session.add(query_result)
        db.session.commit()
        
        return analysis
    
    except Exception as e:
        # Raise the exception instead of returning a JSON error
        raise ValueError(f"Error analyzing dataset: {str(e)}")