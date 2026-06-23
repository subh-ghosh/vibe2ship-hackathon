import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker, useMapEvents } from 'react-leaflet';
import { useMapStore } from '../store/mapStore';
import { PLACES, CIVIC_ISSUES } from '../data/places';
import type { Place, CivicIssue } from '../types';

// Fix Leaflet icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Red Google-style place pin
function createPlaceIcon(selected = false) {
  const size = selected ? 52 : 40;
  return L.divIcon({
    html: `<div style="
      width:${size}px; height:${size}px;
      background:#EA4335; border-radius:50% 50% 50% 0;
      transform:rotate(-45deg); border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
      transition:all 0.2s;
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// Blue Google-style user dot
function createUserIcon() {
  return L.divIcon({
    html: `<div style="position:relative;width:24px;height:24px">
      <div style="width:24px;height:24px;background:#4285F4;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>
      <div style="position:absolute;top:-8px;left:-8px;width:40px;height:40px;background:rgba(66,133,244,0.2);border-radius:50%;animation:locationPulse 2s infinite"></div>
    </div>`,
    className: 'location-dot',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// Civic issue marker
const CIVIC_COLORS: Record<string, string> = {
  pothole: '#EA4335', garbage: '#FBBC04', water_leakage: '#4285F4',
  streetlight: '#F9AB00', flooding: '#1A73E8', road_damage: '#D93025',
  construction: '#E37400', manhole: '#9334E6',
};
const CIVIC_ICONS: Record<string, string> = {
  pothole: '🕳️', garbage: '🗑️', water_leakage: '💧', streetlight: '💡',
  flooding: '🌊', road_damage: '🚧', construction: '⚠️', manhole: '⬛',
};

function createCivicIcon(issue: CivicIssue) {
  const color = CIVIC_COLORS[issue.type] || '#EA4335';
  const icon = CIVIC_ICONS[issue.type] || '⚠️';
  const size = issue.severity === 'critical' ? 34 : issue.severity === 'high' ? 30 : 26;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:white;border-radius:50%;
      border:2.5px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:${size * 0.45}px;
      box-shadow:0 2px 6px rgba(0,0,0,.25);
    ">${icon}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Helper: sync map view from store
function MapController() {
  const { center, zoom, setCenter, setZoom } = useMapStore();
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom, { animate: true, duration: 0.5 });
  }, [center, zoom]);

  useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
    },
    zoomend: () => setZoom(map.getZoom()),
  });

  return null;
}

export default function MapView() {
  const {
    center, zoom, activeRoute, routes, selectedPlace,
    userLocation, showCivicLayer, showSatellite,
    setSelectedPlace, setMode, setSheetSnap,
  } = useMapStore();

  const tileUrl = showSatellite
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttr = showSatellite
    ? 'Tiles &copy; Esri'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setMode('place');
    setSheetSnap('half');
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="absolute inset-0 w-full h-full z-0"
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer url={tileUrl} attribution={tileAttr} maxZoom={20} />
      <MapController />

      {/* Non-active routes (gray) */}
      {routes.filter(r => r.type !== activeRoute?.type).map(r => (
        <Polyline
          key={r.type}
          positions={r.geometry.map(([lng, lat]) => [lat, lng])}
          pathOptions={{ color: '#C5C5C5', weight: 6, opacity: 0.7 }}
        />
      ))}

      {/* Active route */}
      {activeRoute && (
        <>
          {/* Route casing */}
          <Polyline
            positions={activeRoute.geometry.map(([lng, lat]) => [lat, lng])}
            pathOptions={{ color: 'white', weight: 10, opacity: 0.8 }}
          />
          {/* Route fill */}
          <Polyline
            positions={activeRoute.geometry.map(([lng, lat]) => [lat, lng])}
            pathOptions={{ color: activeRoute.color, weight: 7, opacity: 1 }}
          />
        </>
      )}

      {/* Place markers */}
      {PLACES.map(place => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createPlaceIcon(selectedPlace?.id === place.id)}
          eventHandlers={{ click: () => handlePlaceClick(place) }}
        >
          <Popup>
            <div style={{ padding: '8px 12px', minWidth: '160px' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#202124' }}>{place.name}</div>
              <div style={{ color: '#5F6368', fontSize: '12px', marginTop: '2px' }}>{place.category}</div>
              <div style={{ color: '#F29900', fontSize: '12px', marginTop: '4px' }}>
                {'★'.repeat(Math.round(place.rating))} {place.rating} ({place.reviewCount.toLocaleString()})
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* User location */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()} />
      )}

      {/* Civic issue markers */}
      {showCivicLayer && CIVIC_ISSUES.map(issue => (
        <Marker
          key={issue.id}
          position={[issue.lat, issue.lng]}
          icon={createCivicIcon(issue)}
        >
          <Popup>
            <div style={{ padding: '8px 12px', minWidth: '160px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#202124' }}>{issue.title}</div>
              <div style={{ fontSize: '11px', color: '#5F6368', marginTop: '2px', textTransform: 'capitalize' }}>
                {issue.type.replace('_', ' ')} · {issue.severity} severity
              </div>
              <div style={{ fontSize: '11px', color: '#1A73E8', marginTop: '4px' }}>
                {issue.verifications} community verifications
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
