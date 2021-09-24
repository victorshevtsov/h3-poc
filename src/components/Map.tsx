import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import * as h3 from 'h3-js';
import React, { useEffect, useState } from 'react';
import { hexagon } from '../models/hexagon';
import { Hexagon } from './Hexagon';
import MapInfo, { MapInfoEvent, MapMode } from './MapInfo';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

const resolution = 8;

function h3ToPath(h3Index: string): google.maps.LatLng[] {
  return h3.h3ToGeoBoundary(h3Index)
    .map(i => new google.maps.LatLng(i[0], i[1]));
}

interface MapProps {
  center: { lat: number, lng: number };
  zoom: number;
  children?: any;
  onCenterChanged?: (center: { lat: number; lng: number }) => void;
  onZoomChanged?: (zoom: number) => void;
}

function Map({ center, zoom, children, onCenterChanged, onZoomChanged }: MapProps) {

  const mapRef = React.useRef<GoogleMap>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string
  })

  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();

  useEffect(() => {
    if (isLoaded) {
      setMapOptions({
        scaleControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        disableDoubleClickZoom: true,
        fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
        styles: [
          { featureType: "administrative", stylers: [{ "visibility": "off" }] },
          { featureType: "poi", stylers: [{ "visibility": "off" }] },
          { featureType: "transit", stylers: [{ "visibility": "off" }] },
        ]
      })
    }
  }, [isLoaded])

  const [hexagons, setHexagons] = useState<hexagon[]>([]);

  const [pointer, setPointer] = useState<hexagon>();

  const onModeChange = (e: MapInfoEvent) => {
    switch (e.mode) {
      default:
      case MapMode.View:
        mapRef.current?.state.map?.setOptions({ gestureHandling: "auto" })
        break;
      case MapMode.Draw:
        mapRef.current?.state.map?.setOptions({ gestureHandling: "none" })
        break;
      case MapMode.Erase:
        mapRef.current?.state.map?.setOptions({ gestureHandling: "none" })
        break;
    }
  }

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

  const onMapZoomChanged = () => {
    if (mapRef.current) {
      const zoom = mapRef.current?.state.map?.getZoom()
      if (zoom && onZoomChanged)
        onZoomChanged(zoom)
    }
  }

  const onMapCenterChanged = () => {
    let centerLatLng = mapRef.current?.state.map?.getCenter();

    if (centerLatLng) {
      let newCenter = { lat: centerLatLng.lat(), lng: centerLatLng.lng() }

      if (newCenter.lat != center.lat && newCenter.lng != center.lng && onCenterChanged) {
        onCenterChanged(newCenter);
      }
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

  return <>
    {loadError ?
      <div>Map cannot be loaded</div>
      :
      isLoaded ?
        <GoogleMap ref={mapRef}
          center={center}
          zoom={zoom}
          mapContainerStyle={containerStyle}
          options={mapOptions}
          onZoomChanged={onMapZoomChanged}
          onCenterChanged={onMapCenterChanged}
          onMouseMove={onMouseMove}
          onDblClick={onDblClick}
        >
          {children}

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

          <MapInfo
            mode={MapMode.View}
            count={hexagons.length}
            onModeChange={onModeChange} />
        </GoogleMap>
        :
        <div>Loading the map...</div>
    }
  </>
}

export default Map;
