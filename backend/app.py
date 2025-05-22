from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
model = YOLO("yolo9c_rgb.pt")  # หรือใช้ path แบบ relative

@app.route("/predict", methods=["POST"])
def predict_upload():
    file = request.files["file"]
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    result = model(img)[0].plot()
    _, buffer = cv2.imencode('.jpg', result)
    encoded = base64.b64encode(buffer).decode("utf-8")
    return jsonify({"image": encoded})

@app.route("/predict_stream", methods=["POST"])
def predict_stream():
    data = request.get_json()
    image_data = data["image"].split(",")[1]
    decoded = base64.b64decode(image_data)
    nparr = np.frombuffer(decoded, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    result = model(img)[0].plot()
    _, buffer = cv2.imencode('.jpg', result)
    encoded = base64.b64encode(buffer).decode("utf-8")

    return jsonify({"image": encoded})

if __name__ == "__main__":
    app.run(port=8000)
