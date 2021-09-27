import { resourceUsage } from "process";
import { useState } from "react";
import styles from "./MapInfo.module.scss";

export enum MapMode { View, Draw, Erase }

const defaultState = {
  mode: MapMode.View,
  resolution: 8
}

interface MapInfoProps {
  mode: MapMode;
  resolution: number;
  count: number;
  onModeChange?: (e: MapInfoEvent) => void;
  onResolutionChange: (resolution: number) => void;
}

export interface MapInfoEvent {
  mode: MapMode;
}

const MapInfo = ({ count, resolution, onModeChange, onResolutionChange }: MapInfoProps) => {
  const [state, setState] = useState(defaultState);

  const swithMode = (mode: MapMode) => {
    if (onModeChange)
      onModeChange({ mode })
  }

  return <div className={styles.MapInfo}>
    <button onClick={() => swithMode(MapMode.View)}>View</button>
    <button onClick={() => swithMode(MapMode.Draw)}>Draw</button>
    <button onClick={() => swithMode(MapMode.Erase)}>Erase</button>
    <button onClick={() => onResolutionChange(++resolution)}>Inc</button>
    <div>
      {resolution}
    </div>
    <button onClick={() => onResolutionChange(--resolution)}>Dec</button>
    <div>
      {count}
    </div>
  </div>
}

export default MapInfo