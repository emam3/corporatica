import os
import cv2
import numpy as np

def process_image_with_mask_rcnn(image_name, image_ext, path):

    net = cv2.dnn.readNetFromTensorflow(
        "dnn/frozen_inference_graph_coco.pb",
        "dnn/mask_rcnn_inception_v2_coco_2018_01_28.pbtxt"
    )

    colors = np.random.randint(0, 255, (80, 3))
    
    # Get the absolute path to the project root
    path = os.path.normpath(os.path.join(os.path.dirname(__file__), '../../uploads/images'))
    img = cv2.imread(os.path.join(path, f"{image_name}.{image_ext}"))

    if img is None:
        raise ValueError("Image not found :(")
    
    height, width, _ = img.shape

    # Create black image
    black_image = np.zeros((height, width, 3), np.uint8)
    black_image[:] = (100, 100, 0)

    # Detect objects
    blob = cv2.dnn.blobFromImage(img, swapRB=True)
    net.setInput(blob)

    boxes, masks = net.forward(["detection_out_final", "detection_masks"])
    detection_count = boxes.shape[2]

    for i in range(detection_count):
        box = boxes[0, 0, i]
        class_id = box[1]
        score = box[2]
        if score < 0.5:
            continue

        # Get box coordinates
        x = int(box[3] * width)
        y = int(box[4] * height)
        x2 = int(box[5] * width)
        y2 = int(box[6] * height)

        roi = black_image[y: y2, x: x2]
        roi_height, roi_width, _ = roi.shape

        # Get the mask
        mask = masks[i, int(class_id)]
        mask = cv2.resize(mask, (roi_width, roi_height))
        _, mask = cv2.threshold(mask, 0.5, 255, cv2.THRESH_BINARY)

        cv2.rectangle(img, (x, y), (x2, y2), (255, 0, 0), 3)

        # Get mask coordinates
        contours, _ = cv2.findContours(
            np.array(mask, np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        color = colors[int(class_id)]
        for cnt in contours:
            cv2.fillPoly(roi, [cnt], (int(color[0]), int(color[1]), int(color[2])))

    # Save the processed image
    # cv2.imshow("img", img)

    path = os.path.normpath(os.path.join(os.path.dirname(__file__), '../../results'))
    cv2.imwrite(os.path.join(path , f"{image_name}_1.png"), img)
    cv2.imwrite(os.path.join(path , f"{image_name}_2.png"), black_image)