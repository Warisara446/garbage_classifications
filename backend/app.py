from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# โหลดโมเดล YOLO ที่เพื่อน train มา
model = YOLO("model/yolo9c_rgb.pt")  # backend\model\yolo9c_rgb.pt

@app.route('/')
def index():
    return '✅ YOLOv8 backend is running!'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    image_bytes = file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # ทำการพยากรณ์ด้วย YOLO
    results = model.predict(img, conf=0.3)[0]  # conf threshold สามารถปรับได้

    predictions = []
    for box in results.boxes:
        cls_id = int(box.cls[0])
        confidence = float(box.conf[0])
        label = model.names[cls_id]

        # กล่องถูก normalize ไว้กับขนาดภาพที่ใช้อยู่ตอน detect → ใช้แบบ absolute แล้ว normalize เอง
        x1, y1, x2, y2 = map(float, box.xyxy[0])
        width = x2 - x1
        height = y2 - y1

        # Normalize ค่าพิกัดกลับไปที่ [0, 1] โดยใช้ขนาดภาพต้นทาง (300x300 บน frontend)
        image_width, image_height = img.size
        predictions.append({
            'label': label,
            'confidence': round(confidence, 2),
            'boundingBox': {
                'x': x1 / image_width,
                'y': y1 / image_height,
                'width': width / image_width,
                'height': height / image_height,
            }
        })

    return jsonify({'predictions': predictions})

if __name__ == '__main__':
    app.run(debug=True)
