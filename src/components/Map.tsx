import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import * as h3 from 'h3-js';
import React, { useEffect, useState } from 'react';
import { hexagon } from '../models/hexagon';
import { Hexagon } from './Hexagon';
import MapInfo, { MapInfoEvent, MapMode } from './MapInfo';
import toronto from "../data/toronto.json";

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

const defaultResolution = 7;

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
          // { featureType: "administrative", stylers: [{ "visibility": "off" }] },
          { featureType: "poi", stylers: [{ "visibility": "off" }] },
          { featureType: "transit", stylers: [{ "visibility": "off" }] },
        ]
      });

      const newHexagons: hexagon[] = [];
      toronto.forEach(h3Index => {
        newHexagons.push(new hexagon(h3Index, h3ToPath(h3Index), "green"))
      });

      setHexagons(newHexagons);
    }
  }, [isLoaded])

  const [hexagons, setHexagons] = useState<hexagon[]>([]);

  const [pointer, setPointer] = useState<hexagon | null>();

  const [mode, setMode] = useState<MapMode>(MapMode.View)

  const [resolution, setResolution] = useState(defaultResolution);

  const onModeChange = (e: MapInfoEvent) => {
    setMode(e.mode);
    switch (e.mode) {
      default:
      case MapMode.View:
        mapRef.current?.state.map?.setOptions({ gestureHandling: "auto" })
        setPointer(null);
        break;
      case MapMode.Draw:
        mapRef.current?.state.map?.setOptions({ gestureHandling: "none" })
        break;
      case MapMode.Erase:
        mapRef.current?.state.map?.setOptions({ gestureHandling: "none" })
        break;
    }
  }

  const onResolutionChange = (newResolution: number) => {

    const newHexagons: hexagon[] = [];
    hexagons.forEach(h => {
      if (newResolution > resolution) {
        h3.h3ToChildren(h.h3Index, newResolution)
          .forEach(h3Index => {
            if (!newHexagons.find(h => h.h3Index === h3Index)) {
              newHexagons.push(new hexagon(h3Index, h3ToPath(h3Index), "green"));
            }
          })
      } else {
        const h3Index = h3.h3ToParent(h.h3Index, newResolution);
        if (!newHexagons.find(h => h.h3Index === h3Index)) {
          newHexagons.push(new hexagon(h3Index, h3ToPath(h3Index), "green"));
        }
      }
    });

    setResolution(newResolution);
    setHexagons(newHexagons);
  }

  const onMouseMove = (e: google.maps.MapMouseEvent) => {
    if (mode === MapMode.View)
      return;

    if (!e.latLng)
      return;

    const h3Index = h3.geoToH3(e.latLng?.lat(), e.latLng?.lng(), resolution);

    if (pointer?.h3Index !== h3Index) {
      setPointer(new hexagon(h3Index, h3ToPath(h3Index), "gray"));
    }

    if ((e.domEvent as MouseEvent).buttons === 1) {

      if (mode === MapMode.Draw) {
        toggleHexagon(e.latLng?.lat(), e.latLng?.lng(), true);
      } else if (mode === MapMode.Erase) {
        toggleHexagon(e.latLng?.lat(), e.latLng?.lng(), false);
      }
    }
  }

  const onMouseDown = (e: google.maps.MapMouseEvent) => {
    if (mode === MapMode.View)
      return;

    if (!e.latLng)
      return;

    if ((e.domEvent as MouseEvent).buttons === 1) {
      if (mode === MapMode.Draw) {
        setPointer(null);
        toggleHexagon(e.latLng?.lat(), e.latLng?.lng(), true);
      } else {
        toggleHexagon(e.latLng?.lat(), e.latLng?.lng(), false);
      }
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

      if (newCenter.lat !== center.lat && newCenter.lng !== center.lng && onCenterChanged) {
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
              onMouseDown={onMouseDown} />
          )}

          {pointer &&
            <Hexagon hexagon={pointer}
              onMouseMove={onMouseMove}
              onMouseDown={onMouseDown} />}

          <MapInfo
            mode={MapMode.View}
            resolution={resolution}
            count={hexagons.length}
            onModeChange={onModeChange}
            onResolutionChange={onResolutionChange} />
        </GoogleMap>
        :
        <div>Loading the map...</div>
    }
  </>
}

export default Map;
