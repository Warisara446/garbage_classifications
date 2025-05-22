import React, { useState } from "react";
import RealtimeCamera from "./components/RealtimeCamera";
import ImageUpload from "./components/ImageUpload";
import "./App.css"; // อย่าลืม import CSS ตรงนี้นะครับ

function App() {
  const [page, setPage] = useState("camera"); // "camera" หรือ "upload"

  return (
    <div className="App">
      <nav className="app-navbar">
        <button
          className={`nav-tab ${page === "camera" ? "active" : ""}`}
          onClick={() => setPage("camera")}
        >
          📷 Realtime Camera
        </button>
        <button
          className={`nav-tab ${page === "upload" ? "active" : ""}`}
          onClick={() => setPage("upload")}
        >
          🖼️ Upload Image
        </button>
      </nav>

      <main>
        {page === "camera" && <RealtimeCamera />}
        {page === "upload" && <ImageUpload />}
      </main>
    </div>
  );
}

export default App;
