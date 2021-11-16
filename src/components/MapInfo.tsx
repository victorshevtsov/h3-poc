import { IconContext } from "react-icons";
import { CgShapeHexagon } from "react-icons/cg";
import { FaEraser, FaPaintBrush } from "react-icons/fa";
import { FiHexagon, FiMove } from "react-icons/fi";
import styles from "./MapInfo.module.scss";

export enum MapMode { View, Draw, Erase }

interface MapInfoProps {
  mode: MapMode;
  resolution: number;
  count: number;
  onModeChange?: (e: MapInfoEvent) => void;
  onResolutionChange: (resolution: number) => void;
  onSaveToFile: () => void;
}

export interface MapInfoEvent {
  mode: MapMode;
}

const MapInfo = ({ count, resolution, onModeChange, onResolutionChange, onSaveToFile }: MapInfoProps) => {
  const swithMode = (mode: MapMode) => {
    if (onModeChange)
      onModeChange({ mode })
  }

  return <div className={styles.MapInfo}>
    <IconContext.Provider value={{ color: "gray", className: "global-class-name", size: "1.25em", style: { verticalAlign: "middle" } }}>
      <button onClick={() => swithMode(MapMode.View)}><FiMove /> View</button>
      <button onClick={() => swithMode(MapMode.Draw)}><FaPaintBrush /> Draw</button>
      <button onClick={() => swithMode(MapMode.Erase)}><FaEraser /> Erase</button>
      <button onClick={() => onResolutionChange(--resolution)}><FiHexagon /> Bigger</button>
      <button onClick={() => onResolutionChange(++resolution)}><CgShapeHexagon /> Smaller</button>
      <div>
        Resolution: {resolution}
      </div>
      <div>
        Polygons: {count}
      </div>
      <button onClick={() => onSaveToFile()}><CgShapeHexagon /> Save</button>
    </IconContext.Provider>
  </div>
}

export default MapInfo