import { Polygon, GoogleMap, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import * as h3 from 'h3-js';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

const polygonOptions: google.maps.PolygonOptions = {
  fillColor: "red",
  strokeColor: "navy",
  strokeWeight: 1
}

function h3ToPolyline(h3Index: string) {
  return h3.h3ToGeoBoundary(h3Index).map(i => ({ lat: i[0], lng: i[1] }));
}

function Hexagons({ hexagons }: any) {
  const hexs = hexagons as { lat: number, lng: number }[][];

  return <>
    {hexs.map((hex, i) =>
      <Polygon key={i} path={hex} options={polygonOptions} />
    )}
  </>
}

function Map({ children, center }: any) {

  const mapRef = React.useRef<GoogleMap>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string
  })

  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();

  useEffect(() => {
    if (isLoaded) {
      setMapOptions({
        center,
        zoom: 14,
        disableDoubleClickZoom: true,
        zoomControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER, },
        streetViewControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
        styles: [
          { featureType: "poi", stylers: [{ "visibility": "off" }] },
          { featureType: "transit", stylers: [{ "visibility": "off" }] },
        ]
      })
    }
  }, [isLoaded, center])

  const [location, setLocation] = useState<google.maps.LatLng | undefined>(center);

  const [hexagons, setHexes] = useState<{ lat: number, lng: number }[][]>([]);

  const onCenterChanged = () => {
    const cntr = mapRef.current?.state.map?.getCenter();
    setLocation(cntr);
  }

  const onDblClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng)
      return;

    const h3Index = h3.geoToH3(e.latLng?.lat(), e.latLng?.lng(), 7);

    const polyline = h3ToPolyline(h3Index);

    setHexes((s) => {
      console.log(s);

      let res = JSON.parse(JSON.stringify(s)) as { lat: number, lng: number }[][];
      res.push(polyline)
      return res;
    });
  }

  return <>
    {loadError ?
      <div>Map cannot be loaded</div>
      :
      isLoaded ?
        <GoogleMap ref={mapRef}
          mapContainerStyle={containerStyle}
          options={mapOptions}
          onCenterChanged={onCenterChanged}
          onRightClick={onDblClick}
        >
          {children}
          <div className="MapPanel">Loction: {JSON.stringify(location)}

          </div>
          <Hexagons hexagons={hexagons} />
        </GoogleMap>
        :
        <div>Loading the map...</div>
    }
  </>
}

export default Map;
