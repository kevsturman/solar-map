import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  InfoBox,
} from "@react-google-maps/api";
import Places from "./places";
// import Distance from "./distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const planetDistances = [
  0, 0.980872976949485, 1.84404119666503, 2.55026974006866, 3.88425698871996,
  13.2515939185875, 24.3060323688082, 48.8867091711623, 76.6454144188328, 100,
];

export default function Map() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const mapRef = useRef<GoogleMap>();
  const [maxRadius, setMaxRadius] = useState(0);

  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 37.77, lng: -122.42 }),
    []
  );

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      mapId: "9afaf6b887b1a382",
    }),
    []
  );

  const getPositionByRadius = useCallback(
    (radius: number, planetIndex: number) => {
      const lat = center.lat + (radius / planetDistances[planetIndex]) * 0.5;
      const lng = center.lng + (radius / planetDistances[planetIndex]) * 0.5;
      return { lat, lng };
    },
    [center]
  );

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  return (
    <div className="container">
      <div className="controls">
        <h1>Set Scale</h1>
        <input
          type="range"
          min="0"
          max="1000"
          value={maxRadius}
          onChange={(e) => {
            setMaxRadius(parseInt(e.target.value, 10));
          }}
        />
        <h1>Search for sun location</h1>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
      </div>

      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerStyle={{ width: "100%", height: "100vh" }}
          options={options}
          onLoad={onLoad}
        >
          {office && (
            <>
              <Marker position={office} icon="/icons/sun.png" />
              {planetDistances.map((distance, index) => (
                <>
                  <Circle
                    key={index}
                    center={office}
                    radius={distance * maxRadius}
                    options={closeOptions}
                  />
                </>
              ))}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.0,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
