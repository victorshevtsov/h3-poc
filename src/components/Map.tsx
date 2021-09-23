import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React from 'react';

const containerStyle = {
  width: '100vW',
  height: '100vh'
};
const center = {
  lat: 43.65,
  lng: -79.38
};

console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

function Map() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} opacity={0.8} />
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(Map)