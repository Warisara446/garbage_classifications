import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "./CameraCapture.css";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "environment",
};

const displayWidth = 640;
const displayHeight = 480;

const CameraCapture = () => {
  const webcamRef = useRef(null);

  const [predictions, setPredictions] = useState([]);
  const [imageSrc, setImageSrc] = useState(null); // สำหรับ real-time webcam

  // สำหรับ image upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadPredictions, setUploadPredictions] = useState([]);

  const scaleX = displayWidth / 640; // ปรับตาม backend
  const scaleY = displayHeight / 480;

  // Real-time capture & predict
  useEffect(() => {
    const interval = setInterval(() => {
      captureAndPredict();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const captureAndPredict = async () => {
    if (!webcamRef.current) return;
    const image = webcamRef.current.getScreenshot();
    if (!image) return;

    setImageSrc(image);
    const blob = await fetch(image).then((res) => res.blob());

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      console.error("Real-time prediction failed", err);
    }
  };

  // Handle file upload & predict
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // แปลงไฟล์เป็น data URL เพื่อแสดงภาพ
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);

    // ส่งไฟล์ไป backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadPredictions(data.predictions || []);
    } catch (err) {
      console.error("Upload prediction failed", err);
      setUploadPredictions([]);
    }
  };

  // Render bounding boxes
  const renderBoxes = (predictionList) =>
    predictionList.map((pred, i) => {
      const { x, y, width, height } = pred.boundingBox;
      return (
        <div
          key={i}
          className="bounding-box"
          style={{
            left: `${x * scaleX}px`,
            top: `${y * scaleY}px`,
            width: `${width * scaleX}px`,
            height: `${height * scaleY}px`,
          }}
        >
          <span className="label">
            {pred.label} ({(pred.confidence * 100).toFixed(1)}%)
          </span>
        </div>
      );
    });

  return (
    <div className="container text-center py-5">
      <h1 className="display-5 fw-bold text-success mb-4">🧪 Waste Classification</h1>

      {/* Real-time Camera */}
      <h4 className="mb-3">🎥 Real-Time Camera</h4>
      <div
        className="camera-wrapper position-relative mx-auto"
        style={{ width: displayWidth, height: displayHeight }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="camera-view"
          width={displayWidth}
          height={displayHeight}
        />
        {imageSrc && renderBoxes(predictions)}
      </div>

      <div className="mt-3">
        {predictions.length > 0 ? (
          <div className="alert alert-info d-inline-block text-start">
            <strong>♻️ Labels (Real-time):</strong>
            <ul>
              {predictions.map((pred, i) => (
                <li key={i}>
                  {pred.label} — {(pred.confidence * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-muted">🔍 Waiting for real-time prediction...</div>
        )}
      </div>

      {/* Upload Image Section */}
      <hr className="my-5" />
      <h4 className="mb-3 text-primary">📤 Upload Image for Prediction</h4>

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />

      {uploadedImage && (
        <div
          className="camera-wrapper position-relative mx-auto"
          style={{ width: displayWidth, height: displayHeight }}
        >
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="camera-view"
            width={displayWidth}
            height={displayHeight}
          />
          {renderBoxes(uploadPredictions)}
        </div>
      )}

      <div className="mt-3">
        {uploadPredictions.length > 0 ? (
          <div className="alert alert-success d-inline-block text-start">
            <strong>📦 Uploaded Image Result:</strong>
            <ul>
              {uploadPredictions.map((pred, i) => (
                <li key={i}>
                  {pred.label} — {(pred.confidence * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>
        ) : uploadedImage ? (
          <div className="text-muted">🔍 Predicting...</div>
        ) : (
          <div className="text-muted">📤 Upload an image to start prediction</div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
