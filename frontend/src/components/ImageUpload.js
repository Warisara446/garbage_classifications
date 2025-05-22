import React, { useState, useRef, useEffect } from "react";
import "./CameraCapture.css";

const labelToBin = {
  general: "bin-general",
  recycle: "bin-recycle",
  hazardous: "bin-hazardous",
  organic: "bin-organic",
};

const labelGroups = {
  general: ["general"],
  recycle: ["cardboard", "paper", "plastic", "metal"],
  hazardous: ["electronic", "glass", "lightbulb"],
  organic: ["organic"],
};

// 🗑️ ชื่อถังขยะพร้อมอิโมจิ
const binTitles = {
  general: "🟢 ขยะทั่วไป",
  recycle: "🟡 ขยะรีไซเคิล ♻️",
  hazardous: "🔴 ขยะอันตราย ⚠️",
  organic: "🔵 ขยะอินทรีย์ 🍃",
};

const ImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const imgRef = useRef(null);
  const [boxes, setBoxes] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setBoxes([]);
    setPredictions([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    if (!imgRef.current || predictions.length === 0) return;

    const naturalWidth = imgRef.current.naturalWidth;
    const naturalHeight = imgRef.current.naturalHeight;
    const displayWidth = imgRef.current.clientWidth;
    const displayHeight = imgRef.current.clientHeight;

    const scaleX = displayWidth / naturalWidth;
    const scaleY = displayHeight / naturalHeight;

    const newBoxes = predictions.map((pred) => {
      const { x, y, width, height } = pred.boundingBox;
      return {
        label: pred.label,
        confidence: pred.confidence,
        x: x * scaleX,
        y: y * scaleY,
        width: width * scaleX,
        height: height * scaleY,
      };
    });

    setBoxes(newBoxes);
  }, [predictions, previewUrl]);

  return (
    <div className="container">
      <h1>🖼️ Waste Classification - Upload Image</h1>

      <div className="upload-section">
        <label htmlFor="upload-input" className="upload-btn">
          Choose Image
        </label>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="upload-input"
        />
      </div>

      {previewUrl && (
        <div className="camera-wrapper position-relative mx-auto">
          <img src={previewUrl} ref={imgRef} alt="Uploaded" className="camera-view" />
          {boxes.map((box, i) => (
            <div
              key={i}
              className="bounding-box"
              style={{
                left: `${box.x}px`,
                top: `${box.y}px`,
                width: `${box.width}px`,
                height: `${box.height}px`,
              }}
            >
              <span className="label">
                {box.label} ({(box.confidence * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="bins-wrapper">
        {Object.entries(labelGroups).map(([bin, labels]) => {
          const matched = predictions.some((p) => labels.includes(p.label));
          return (
            <div
              key={bin}
              className={`bin-card ${labelToBin[bin]} ${matched ? "active" : ""}`}
            >
              <div className="bin-title">{binTitles[bin]}</div>
              <ul className="bin-list">
                {labels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageUpload;
