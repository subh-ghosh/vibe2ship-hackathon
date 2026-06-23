import { Crosshair, Layers, Plus, Minus, Compass } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export default function MapControls() {
  const { setMode, mode, setZoom, zoom, setUserLocation, userLocation, center } = useMapStore();

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      // Use Bengaluru center as fallback
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
      setCenter({ lat: 12.9716, lng: 77.5946 });
      setZoom(15);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setCenter(coords);
        setZoom(16);
      },
      () => {
        const fallback = { lat: 12.9716, lng: 77.5946 };
        setUserLocation(fallback);
        setCenter(fallback);
        setZoom(15);
      },
      { timeout: 5000 }
    );
  };

  if (mode === 'navigate' || mode === 'directions' || mode === 'search') return null;

  return (
    <>
      {/* Right side FABs */}
      <div className="absolute right-3 z-20 flex flex-col gap-3" style={{ bottom: '100px' }}>
        {/* Compass (visible on rotation, simulating here) */}
        <button className="gm-fab-small" title="Compass">
          <Compass size={20} color="#5F6368" />
        </button>

        {/* Layers */}
        <button
          onClick={() => setMode(mode === 'layers' ? 'explore' : 'layers')}
          className="gm-fab-small"
          title="Layers"
        >
          <Layers size={20} color="#5F6368" />
        </button>

        <div className="h-2" /> {/* Spacer */}

        {/* Search / Zoom - not standard on new android but let's keep My Location */}
        {/* My Location */}
        <button
          onClick={handleMyLocation}
          className="gm-fab-small"
          title="My location"
        >
          <Crosshair
            size={20}
            color={userLocation ? '#1A73E8' : '#5F6368'}
          />
        </button>

        {/* Directions FAB */}
        <button
          onClick={() => setMode('directions')}
          className="flex items-center justify-center bg-[#0B57D0] shadow-lg transition-transform active:scale-95"
          style={{ width: '56px', height: '56px', borderRadius: '16px', marginTop: '4px' }}
          title="Directions"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 10H8V5H6V12H13.5V15L18 11L13.5 7V10Z" fill="white"/>
          </svg>
        </button>
      </div>
    </>
  );
}
