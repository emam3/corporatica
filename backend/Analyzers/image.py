import cv2 
import matplotlib.pyplot as plt 
  
def process_image_histogram(image_path, bins=256):
    """
    Perform color histogram analysis on an image
    
    Args:
    - image_path: Full path to the uploaded image
    - bins: Number of bins for histogram calculation
    
    Returns:
    - Dictionary with histogram data for each color channel
    """
    try:
        # Read the image using OpenCV
        img = cv2.imread(image_path)
        
        if img is None:
            raise ValueError("Unable to read the image file")
        
        # Calculate histograms for each color channel
        histograms = {}
        color_channels = [
            ('red', 2),   # OpenCV uses BGR order
            ('green', 1), 
            ('blue', 0)
        ]
        
        for channel_name, channel_idx in color_channels:
            # Calculate histogram for the specific channel
            hist = cv2.calcHist([img], [channel_idx], None, [bins], [0, 256])
            
            # Normalize the histogram
            hist_normalized = hist.flatten().tolist()
            histograms[channel_name] = hist_normalized
        
        return histograms
    
    except Exception as e:
        print(f"Histogram processing error: {str(e)}")
        raise