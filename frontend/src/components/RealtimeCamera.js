import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "./CameraCapture.css";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "environment",
};

const bins = {
  general: ["general"],
  recycle: ["cardboard", "paper", "plastic", "metal"],
  hazardous: ["electronic", "glass", "lightbulb"],
  organic: ["organic"],
};

const binColors = {
  general: "rgba(25, 135, 84, 0.4)", // เขียว
  recycle: "rgba(255, 193, 7, 0.4)", // เหลือง
  hazardous: "rgba(220, 53, 69, 0.4)", // แดง
  organic: "rgba(13, 202, 240, 0.4)", // น้ำเงิน
};

const RealtimeCamera = () => {
  const webcamRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);

  const displayWidth = 640;
  const displayHeight = 480;

  useEffect(() => {
    const interval = setInterval(() => {
      captureAndPredict();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const captureAndPredict = async () => {
    if (!webcamRef.current) return;
    const image = webcamRef.current.getScreenshot();
    if (!image) return;
    setImageSrc(image);

    try {
      const blob = await fetch(image).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

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

  // หา type ถังจาก label
  const getBinType = (label) => {
    if (bins.general.includes(label)) return "general";
    if (bins.recycle.includes(label)) return "recycle";
    if (bins.hazardous.includes(label)) return "hazardous";
    if (bins.organic.includes(label)) return "organic";
    return null;
  };

  // แปลง bounding box normalized -> absolute px
  const boundingBoxes = predictions.map((pred) => {
    const { x, y, width, height } = pred.boundingBox;
    const binType = getBinType(pred.label);
    return {
      ...pred,
      binType,
      absBox: {
        left: x * displayWidth,
        top: y * displayHeight,
        width: width * displayWidth,
        height: height * displayHeight,
      },
    };
  });

  const detectedLabels = predictions.map((p) => p.label);

  const renderBin = (type, title, className) => {
    const isActive = bins[type].some((item) => detectedLabels.includes(item));
    return (
      <div className={`bin-card ${className} ${isActive ? "active" : ""}`}>
        <div className="bin-title">{title}</div>
        <ul className="bin-list">
          {bins[type].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container text-center py-5">
      <h1 className="display-5 fw-bold text-success mb-4">📷 Waste Classification</h1>

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

        {imageSrc &&
          boundingBoxes.map((pred, i) => {
            const { left, top, width, height } = pred.absBox;
            const color = binColors[pred.binType] || "rgba(255, 255, 255, 0.4)";
            return (
              <div
                key={i}
                className="bounding-box"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  backgroundColor: color,
                  border: `2px solid ${color.replace("0.4", "1")}`, // ขอบเข้มกว่า background
                  boxSizing: "border-box",
                  borderRadius: "6px",
                  color: color.replace("0.4", "1"),
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "2px 6px",
                }}
              >
                <span className="label" style={{ color: color.replace("0.4", "1") }}>
                  {pred.label} ({(pred.confidence * 100).toFixed(1)}%)
                </span>
              </div>
            );
          })}
      </div>

      <div className="bins-wrapper">
        {renderBin("general", "🟢 ขยะทั่วไป", "bin-general")}
        {renderBin("recycle", "🟡 ขยะรีไซเคิล ♻️", "bin-recycle")}
        {renderBin("hazardous", "🔴 ขยะอันตราย ⚠️", "bin-hazardous")}
        {renderBin("organic", "🔵 ขยะอินทรีย์ 🍃", "bin-organic")}
      </div>
    </div>
  );
};

export default RealtimeCamera;
