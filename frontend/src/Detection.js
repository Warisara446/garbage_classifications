import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Detection = () => {
  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/predict", formData);
    setResult(res.data.image); // assuming backend returns base64 image
  };

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const captureAndSendFrame = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/jpeg");

    const res = await axios.post("/predict_stream", { image });
    setResult(res.data.image); // base64 image
  };

  useEffect(() => {
    let id;

    if (mode === "realtime") {
      startWebcam();

      id = setInterval(() => {
        captureAndSendFrame();
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [mode]);

  return (
    <div style={{ padding: "2rem" }}>
      <div>
        <button onClick={() => setMode("upload")}>Upload</button>
        <button onClick={() => setMode("realtime")}>Real-time</button>
      </div>

      {mode === "upload" && (
        <>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload</button>
        </>
      )}

      {mode === "realtime" && (
        <div>
          <video ref={videoRef} width="640" height="480" style={{ display: "block" }} />
          <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
        </div>
      )}

      {result && (
        <div>
          <h4>Result:</h4>
          <img src={`data:image/jpeg;base64,${result}`} alt="Detected" width="640" />
        </div>
      )}
    </div>
  );
};

export default Detection;
