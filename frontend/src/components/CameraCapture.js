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
  const [mode, setMode] = useState("camera"); // "camera" | "upload"
  const [imageSrc, setImageSrc] = useState(null);
  const [predictions, setPredictions] = useState([]);

  // Real-time camera prediction
  useEffect(() => {
    let interval;
    if (mode === "camera") {
      interval = setInterval(() => {
        captureAndPredictFromCamera();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  const getBinType = (label) => {
    const recycle = ["cardboard", "paper", "plastic", "metal"];
    const general = ["general"];
    const hazardous = ["electronic", "glass", "lightbulb"];
    const organic = ["organic"];
    if (recycle.includes(label)) return "recycle";
    if (general.includes(label)) return "general";
    if (hazardous.includes(label)) return "hazardous";
    if (organic.includes(label)) return "organic";
    return "unknown";
  };

  const captureAndPredictFromCamera = async () => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;
    setImageSrc(screenshot);
    await predictFromImage(screenshot);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setImageSrc(reader.result);
      await predictFromImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const predictFromImage = async (base64) => {
    const blob = await fetch(base64).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", blob, "upload.jpg");

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      console.error("Prediction failed", err);
    }
  };

  const originalWidth = 640;
  const originalHeight = 480;

  const scaleX = displayWidth / originalWidth;
  const scaleY = displayHeight / originalHeight;

  return (
    <div className="container text-center py-5">
      <h1 className="display-5 fw-bold text-success mb-4">🧪 Waste Classification</h1>

      <div className="mb-4">
        <button className="btn btn-outline-primary me-2" onClick={() => setMode("camera")}>
          📷 Real-time Camera
        </button>
        <button className="btn btn-outline-secondary" onClick={() => setMode("upload")}>
          🖼️ Upload Image
        </button>
      </div>

      {mode === "camera" && (
        <div className="camera-wrapper position-relative mx-auto" style={{ width: displayWidth, height: displayHeight }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="camera-view"
            width={displayWidth}
            height={displayHeight}
          />
        </div>
      )}

      {mode === "upload" && (
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-3" />
        </div>
      )}

      {imageSrc && (
        <div className="position-relative mx-auto mt-3" style={{ width: displayWidth, height: displayHeight }}>
          <img src={imageSrc} alt="preview" className="img-fluid border" style={{ width: displayWidth, height: displayHeight }} />
          {predictions.map((pred, i) => {
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
          })}
        </div>
      )}

      <div className="bins-wrapper mt-5">
        <div className="row justify-content-center">
          {["recycle", "general", "hazardous", "organic"].map((type) => {
            const binItems = predictions.filter((p) => getBinType(p.label) === type);
            return (
              <div key={type} className="col-md-3">
                <div className={`bin-card bin-${type}`}>
                  <h5 className="bin-title">
                    {type === "recycle" && "♻️ Recycle (ถังเหลือง)"}
                    {type === "general" && "🚯 General (ถังเขียว)"}
                    {type === "hazardous" && "☣️ Hazardous (ถังแดง)"}
                    {type === "organic" && "🌿 Organic (ถังน้ำเงิน)"}
                  </h5>
                  {binItems.length > 0 ? (
                    <ul className="bin-list">
                      {binItems.map((item, i) => (
                        <li key={i}>
                          {item.label} — {(item.confidence * 100).toFixed(1)}%
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted small">ไม่มีรายการ</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
