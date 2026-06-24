import { useEffect, useState, useRef } from 'react';
import MapView from './components/Map';
import SearchBar from './components/SearchBar';
import BottomSheet from './components/BottomSheet';
import BottomNav from './components/BottomNav';
import MapControls from './components/MapControls';

import PlaceDetail from './components/PlaceDetail';
import LocationLoader from './components/LocationLoader';
import { useMapStore } from './store/mapStore';


export default function App() {
  const { setCenter, setZoom, setUserLocation } = useMapStore();
  const [locating, setLocating] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {

    if (!('geolocation' in navigator)) {
      // No geolocation support — just show map at default
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        setUserLocation({ lat, lng });
        setCenter({ lat, lng });
        // If accuracy is bad, zoom out more so user can see context
        setZoom(accuracy > 5000 ? 11 : 16);
        setLocating(false);
      },
      (err) => {
        if (err.code === 1) {
          setDenied(true);
        } else {
          // Timeout or unavailable — just open at default
          setLocating(false);
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className="relative w-full h-full bg-[#E8EAED] overflow-hidden select-none">
      {/* Ghost loader — shown until location resolves */}
      {(locating || denied) && <LocationLoader denied={denied} />}

      {!locating && !denied && (
        <>
          <MapView />
          <MapControls />
          <SearchBar />
          <BottomSheet>
            <PlaceDetail />
          </BottomSheet>
          <BottomNav />
        </>
      )}
    </div>
  );
}
