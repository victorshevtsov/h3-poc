import { Marker, Polygon } from '@react-google-maps/api';
import * as h3 from 'h3-js';
import React from 'react';
import './App.css';
import Map from './components/Map';

const center = {
  lat: 43.65,
  lng: -79.38
};

const h3Index = h3.geoToH3(center.lat, center.lng, 8);
const polyline = h3.h3ToGeoBoundary(h3Index).map(i => ({ lat: i[0], lng: i[1] }))

const polygonOptions: google.maps.PolygonOptions = {
  fillColor: "red",
  strokeColor: "navy",
  strokeWeight: 1
}

function App() {
  return (
    <div className="App" >
      {/* <Map center={center} /> */}
      <Map center={center}>
        <Marker position={center} opacity={0.8} />
        <Polygon path={polyline} options={polygonOptions} />
        <div className="MapPanel">Left Map</div>
      </Map>
      {/* <Map center={center}>
        <Marker position={center} opacity={0.8} />
        <Polygon path={polyline} options={polygonOptions} />
        <div style={divStyles}>Right Map</div>
      </Map> */}
    </div>
  );
}

export default App;
