import './App.css';
import Map from './components/Map';

const center = {
  lat: 43.65,
  lng: -79.38
};

function App() {
  return (
    <div className="App" >
      <Map center={center} />
      {/* <Map center={center}>
        <div className="MapPanel">Left Map</div>
      </Map>
      <Map center={center}>
      <div className="MapPanel">Right Map</div>
      </Map> */}
    </div>
  );
}

export default App;
