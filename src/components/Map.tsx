import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React from 'react';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

function Map({ children, center }: any) {

  const mapRef = React.useRef<GoogleMap>(null);

  const mapOptions = (): google.maps.MapOptions => {
    return {
      center,
      zoom: 14,
      zoomControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER, },
      streetViewControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
      styles: [
        { featureType: "poi", stylers: [{ "visibility": "off" }] },
        { featureType: "transit", stylers: [{ "visibility": "off" }] },
      ]
    }
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string
  })

  const onBoundsChanged = () => {
    console.log("onBoundsChanged", mapRef.current);
  }
  const onCenterChanged = () => {
    console.log("onCenterChanged");
  }

  const renderMap = () => <>
    <GoogleMap ref={mapRef}
      mapContainerStyle={containerStyle}
      options={mapOptions()}
      onBoundsChanged={onBoundsChanged}
      onCenterChanged={onCenterChanged}
    >
      {children}
    </GoogleMap>
  </>

  if (loadError) {
    return <div>Map cannot be loaded</div>
  }

  return isLoaded ? renderMap() : <div>Loading the map...</div>
}
export default Map;
