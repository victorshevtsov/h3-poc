import { useState } from 'react';
import './App.css';
import Map from './components/Map';

function App() {
  const [center, setCenter] = useState({ lat: 43.65, lng: -79.38 })
  const [zoom, setZoom] = useState(12)

  return (
    <div className="App" >
      <Map zoom={zoom}
        center={center}
        onZoomChanged={setZoom}
        onCenterChanged={setCenter} />
      <Map
        zoom={zoom}
        center={center}
        onZoomChanged={setZoom}
        onCenterChanged={setCenter} />
    </div>
  );
}

export default App;
