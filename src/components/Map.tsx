import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import * as h3 from 'h3-js';
import React, { useEffect, useState } from 'react';
import { hexagon } from '../models/hexagon';
import { Hexagon } from './Hexagon';

interface MapProps {
  children?: any;
  center: { lat: number, lng: number };
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

const resolution = 8;

function h3ToPath(h3Index: string): google.maps.LatLng[] {
  return h3.h3ToGeoBoundary(h3Index)
    .map(i => new google.maps.LatLng(i[0], i[1]));
}

function Map({ children, center }: MapProps) {

  const mapRef = React.useRef<GoogleMap>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    version: "3"
  })

  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();

  useEffect(() => {
    if (isLoaded) {
      // mapRef.current?.state.map?.addListener("mousemove", () => {
      //   console.log("keydown");
      // })

      if (mapRef.current) {
        console.log("keydown");
        google.maps.event.addDomListener(mapRef.current, "keydown", () => {
        })
      }

      setMapOptions({
        center,
        zoom: 14,
        gestureHandling: "greedy",
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

  const [location, setLocation] = useState<{ lat: number, lng: number }>(center);

  const [hexagons, setHexagons] = useState<hexagon[]>([]);

  const [pointer, setPointer] = useState<hexagon>();

  const onMouseMove = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng)
      return;

    if ((e.domEvent as KeyboardEvent).ctrlKey) {
      toggleHexagon(e.latLng?.lat(), e.latLng?.lng(), true);
    }
    else if ((e.domEvent as KeyboardEvent).shiftKey) {
      toggleHexagon(e.latLng?.lat(), e.latLng?.lng(), false);
    }

    const h3Index = h3.geoToH3(e.latLng?.lat(), e.latLng?.lng(), resolution);

    if (pointer?.h3Index !== h3Index) {
      const path = h3ToPath(h3Index);
      const color = "gray";

      setPointer(new hexagon(h3Index, path, color));
    }
  }

  const onCenterChanged = () => {
    const center = mapRef.current?.state.map?.getCenter();
    if (center) {
      setLocation({ lat: center.lat(), lng: center.lng() });
    }
  }

  const onDblClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      toggleHexagon(e.latLng?.lat(), e.latLng?.lng(), true);
    }
  }

  const toggleHexagon = (lat: number, lng: number, create: boolean) => {
    const h3Index = h3.geoToH3(lat, lng, resolution);

    let index = hexagons.findIndex(h => h.h3Index === h3Index);

    if (index === -1 && create) {

      const path = h3ToPath(h3Index);
      const color = "green";

      const newHexagon = new hexagon(h3Index, path, color);

      setHexagons((prev) => {
        let res = JSON.parse(JSON.stringify(prev)) as hexagon[];
        res.push(newHexagon);
        return res;
      })
    }

    if (index !== -1 && !create) {
      setHexagons((prev) => {
        const res = JSON.parse(JSON.stringify(prev)) as hexagon[];
        res.splice(index, 1)
        return res;
      });
    }
  }

  // const onToggle = (e: any) => {
  //   let opts: google.maps.MapOptions = {
  //     draggable: false
  //     // gestureHandling: "none"
  //   }
  //   if (mapOptions)
  //     console.log(mapRef.current?.state.map?.setOptions(opts));
  // }

  return <>
    {loadError ?
      <div>Map cannot be loaded</div>
      :
      isLoaded ?
        <GoogleMap ref={mapRef}
          mapContainerStyle={containerStyle}
          options={mapOptions}
          onCenterChanged={onCenterChanged}
          onMouseMove={onMouseMove}
          onDblClick={onDblClick}

        >
          {children}
          {/* 
          <div className="MapPanel">
            Loction: {JSON.stringify(location)}
            <button onClick={onToggle} >Edit</button>
          </div> */}

          {hexagons.map(hexagon =>
            <Hexagon key={hexagon.h3Index}
              hexagon={hexagon}
              onMouseMove={onMouseMove}
              onDblClick={onDblClick} />
          )}

          {pointer &&
            <Hexagon hexagon={pointer}
              onMouseMove={onMouseMove}
              onDblClick={onDblClick} />}

        </GoogleMap>
        :
        <div>Loading the map...</div>
    }
  </>
}

export default Map;
