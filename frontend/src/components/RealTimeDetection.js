import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import './CameraCapture.css'; // 👈 CSS แยกไฟล์

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'environment',
};

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      captureAndPredict();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const captureAndPredict = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());

    const formData = new FormData();
    formData.append('file', blob, 'frame.jpg');

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setPrediction(data);
      setBox(data.boundingBox);
    } catch (err) {
      console.error('Prediction failed', err);
    }
  };

  return (
    <div className="container text-center py-5">
      <h1 className="display-5 fw-bold text-success mb-4">🧪 Waste Classification</h1>

      <div className="camera-wrapper position-relative mx-auto">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="camera-view"
        />

        {box && (
          <div
            className="bounding-box"
            style={{
              left: `${box.x}px`,
              top: `${box.y}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
            }}
          />
        )}
      </div>

      <div className="mt-4">
        {prediction ? (
          <div className="alert alert-info shadow-sm d-inline-block text-start">
            <strong>♻️ Label:</strong> {prediction.label} <br />
            <strong>📊 Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%
          </div>
        ) : (
          <div className="text-muted">🔍 Waiting for prediction...</div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
