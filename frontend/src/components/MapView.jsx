import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom orange marker icon
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 14); }, [lat, lng]);
  return null;
};

const MapView = ({ lat = 20.5937, lng = 78.9629, popupText = 'Location', zoom = 12, height = 350 }) => (
  <MapContainer
    center={[lat, lng]}
    zoom={zoom}
    className="w-full rounded-xl"
    style={{ height }}
    scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <RecenterMap lat={lat} lng={lng} />
    <Marker position={[lat, lng]} icon={orangeIcon}>
      <Popup>{popupText}</Popup>
    </Marker>
  </MapContainer>
);

export default MapView;
