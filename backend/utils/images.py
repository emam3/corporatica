import cv2
import numpy as np


ALLOWED_IMAGES_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGES_EXTENSIONS


