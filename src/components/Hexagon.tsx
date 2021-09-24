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
  onDblClick?: (e: google.maps.MapMouseEvent) => void;
}

export const Hexagon = ({ hexagon, onMouseMove, onDblClick }: HexagonProps) => {

  const [options, setOptions] = useState(defaultOptions)

  useEffect(() => {
    setOptions(prev => ({ ...prev, fillColor: hexagon?.color }))
  }, [hexagon?.color])

  return <Polygon
    key={hexagon.h3Index}
    path={hexagon.path}
    options={options}
    onMouseMove={onMouseMove}
    onDblClick={onDblClick} />
}
