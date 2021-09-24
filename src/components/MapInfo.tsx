import styles from "./MapInfo.module.scss";

export enum MapMode { View, Draw, Erase }

// const defaultState = {
//   mode: MapMode.View
// }

interface MapInfoProps {
  mode: MapMode;
  count: number;
  onModeChange?: (e: MapInfoEvent) => void;
}

export interface MapInfoEvent {
  mode: MapMode
}

const MapInfo = ({ count, onModeChange }: MapInfoProps) => {
  // const [state, setState] = useState(defaultState);

  const swithMode = (mode: MapMode) => {
    if (onModeChange)
      onModeChange({ mode })
  }

  return <div className={styles.MapInfo}>
    <button onClick={() => swithMode(MapMode.View)}>View</button>
    <button onClick={() => swithMode(MapMode.Draw)}>Draw</button>
    <button onClick={() => swithMode(MapMode.Erase)}>Erase</button>
    <div>
      {count}
    </div>
  </div>
}

export default MapInfo