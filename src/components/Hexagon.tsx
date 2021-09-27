import { Polygon } from '@react-google-maps/api';
import { useEffect, useState } from "react";
import { hexagon } from '../models/hexagon';

const defaultOptions: google.maps.PolygonOptions = {
  strokeColor: "navy",
  strokeWeight: 1,
}

interface HexagonProps {
  hexagon: hexagon;
  onMouseMove?: (e: google.maps.MapMouseEvent) => void;
  onMouseDown?: (e: google.maps.MapMouseEvent) => void;
}

export const Hexagon = ({ hexagon, onMouseMove, onMouseDown }: HexagonProps) => {

  const [options, setOptions] = useState(defaultOptions)

  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      fillColor: hexagon?.color, fillOpacity: 0.15,
      strokeColor: hexagon?.color, strokeOpacity: 0.5
    }))
  }, [hexagon?.color])

  return <Polygon
    key={hexagon.h3Index}
    path={hexagon.path}
    options={options}
    onMouseMove={onMouseMove}
    onMouseDown={onMouseDown} />
}
