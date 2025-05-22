import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CameraCapture from './components/CameraCapture';


function App() {
  return (
    <div className="App">
      <h1>♻️ Trash Classifier</h1>
      <CameraCapture  />
    </div>
  );
}

export default App;
