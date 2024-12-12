

def read_text_file(filepath):
    """
    Read text file with error handling
    
    Args:
    - filepath: Full path to the uploaded .txt file
    
    Returns:
    - Text content as string
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        raise ValueError(f"Error reading file: {str(e)}")
    
    