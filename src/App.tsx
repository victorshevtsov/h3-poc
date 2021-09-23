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

function h3ToPolyline(h3Index: string) {
  let hexBoundary = h3.h3ToGeoBoundary(h3Index)
  hexBoundary.push(hexBoundary[0])

  let arr = []
  for (const i of hexBoundary) {
    arr.push({ lat: i[0], lng: i[1] })
  }

  return arr
}

const polyline = h3ToPolyline(h3Index);

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
      </Map>
      <Map center={center}>
        <Marker position={center} opacity={0.8} />
        <Polygon path={polyline} options={polygonOptions} />
      </Map>
    </div>
  );
}

export default App;
