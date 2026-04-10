import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { School, UserLocation } from '../types';

// Fix for default leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="relative">
    <div class="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
    <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-600 rounded-full"></div>
  </div>`,
  iconSize: [0, 0],
});

interface MapComponentProps {
  userLocation: UserLocation | null;
  schools: School[];
  radius: number;
  selectedSchool: School | null;
  onSchoolSelect: (school: School) => void;
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function RoutingMachine({ userLocation, destination }: { userLocation: UserLocation, destination: School }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation || !destination) return;

    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.koordinat.lat, destination.koordinat.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null, // Don't create extra markers
      lineOptions: {
        styles: [{ color: '#f59e0b', weight: 6, opacity: 0.8 }]
      }
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, userLocation, destination]);

  return null;
}

export default function MapComponent({ userLocation, schools, radius, selectedSchool, onSchoolSelect }: MapComponentProps) {
  const defaultCenter: [number, number] = [-6.2088, 106.8456]; // Jakarta center
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  useEffect(() => {
    if (selectedSchool) {
      setMapCenter([selectedSchool.koordinat.lat, selectedSchool.koordinat.lng]);
    }
  }, [selectedSchool]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl shadow-inner bg-slate-200">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>Lokasi Saya</Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radius * 1000}
              pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1, dashArray: '5, 5' }}
            />
          </>
        )}

        {schools.map((school) => (
          <Marker
            key={school.id}
            position={[school.koordinat.lat, school.koordinat.lng]}
            eventHandlers={{
              click: () => onSchoolSelect(school),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-900">{school.nama}</h3>
                <p className="text-xs text-slate-500">{school.tipe} - {school.alamat}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && selectedSchool && (
          <RoutingMachine userLocation={userLocation} destination={selectedSchool} />
        )}

        <MapUpdater center={mapCenter} zoom={selectedSchool ? 15 : 13} />
      </MapContainer>
    </div>
  );
}
