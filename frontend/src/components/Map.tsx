import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Map, { Marker, Source, Layer, MapRef, ScaleControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../store/mapStore';
import { fetchNearbyPlaces, type NearbyPlace } from '../services/overpass';


declare global {
  interface Window {
    __triggerMyLocation?: () => void;
    __mapZoomIn?: () => void;
    __mapZoomOut?: () => void;
  }
}

const mapStyle = {
  version: 8,
  sources: {
    'google-maps': {
      type: 'raster',
      tiles: [
        'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&scale=2'
      ],
      tileSize: 512,
    }
  },
  layers: [
    {
      id: 'google-maps',
      type: 'raster',
      source: 'google-maps',
    }
  ]
} as any;

export default function MapView() {
  const {
    center, zoom, selectedPlace,
    userLocation, setUserLocation,
    setSelectedPlace, setMode, setSheetSnap, setCenter, setZoom,
    mode, searchQuery, routes, setExploreCenter
  } = useMapStore();

  const mapRef = useRef<MapRef>(null);
  const watchIdRef = useRef<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [dynamicPlaces, setDynamicPlaces] = useState<NearbyPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const userMovedRef = useRef(false);
  const lastFetchCenter = useRef({ lat: 0, lng: 0 });

  // Expose globals for MapControls
  useEffect(() => {
    window.__mapZoomIn = () => mapRef.current?.zoomIn({ duration: 200 });
    window.__mapZoomOut = () => mapRef.current?.zoomOut({ duration: 200 });
    return () => { delete window.__mapZoomIn; delete window.__mapZoomOut; };
  }, []);

  // Load dynamic markers whenever map center changes significantly
  const loadDynamicPlaces = useCallback(async (lat: number, lng: number) => {
    const dist = Math.abs(lat - lastFetchCenter.current.lat) + Math.abs(lng - lastFetchCenter.current.lng);
    if (dist < 0.01) return; // don't refetch for tiny moves
    lastFetchCenter.current = { lat, lng };
    setLoadingPlaces(true);
    const places = await fetchNearbyPlaces(lat, lng, 1500);
    setDynamicPlaces(places);
    setLoadingPlaces(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadDynamicPlaces(center.lat, center.lng);
  }, []);

  // Live location tracking
  useEffect(() => {
    window.__triggerMyLocation = () => {
      if (!('geolocation' in navigator)) { alert('Geolocation not supported.'); return; }
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });
          mapRef.current?.flyTo({ center: [lng, lat], zoom: 16, duration: 800 });
          loadDynamicPlaces(lat, lng);
        },
        (err) => {
          alert(err.code === 1
            ? 'Location denied. Click the 🔒 in the URL bar → Allow Location.'
            : `Location error: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true, maximumAge: 2000 }
      );
    };

    let lastHeading = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let newHeading = null;
      if ('webkitCompassHeading' in e) {
        newHeading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        newHeading = 360 - e.alpha;
      }
      if (newHeading !== null) {
        // Low-pass filter to prevent jitter
        const diff = newHeading - lastHeading;
        const normalizedDiff = ((diff + 540) % 360) - 180; // shortest path
        if (Math.abs(normalizedDiff) > 1) { // Only update if changed by >1 degree
          lastHeading = lastHeading + normalizedDiff * 0.15; // Smooth by 15%
          setHeading(lastHeading);
        }
      }
    };
    window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
    window.addEventListener('deviceorientation', handleOrientation as any, true);

    return () => {
      delete window.__triggerMyLocation;
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
      window.removeEventListener('deviceorientation', handleOrientation as any, true);
    };
  }, [setUserLocation, loadDynamicPlaces]);

  // Sync map when store center changes (search)
  useEffect(() => {
    if (!mapRef.current) return;
    const cur = mapRef.current.getCenter();
    const curZ = mapRef.current.getZoom();
    const dist = Math.abs(cur.lng - center.lng) + Math.abs(cur.lat - center.lat);
    const zdiff = Math.abs(curZ - zoom);
    if (dist > 0.0001 || zdiff > 0.1) {
      mapRef.current.flyTo({ center: [center.lng, center.lat], zoom, duration: 500 });
      userMovedRef.current = false;
      setShowSearchArea(false);
    }
  }, [center, zoom]);

  // Fit bounds to route geometry automatically
  useEffect(() => {
    if (mode === 'directions' && routes.length > 0 && mapRef.current) {
      const coordinates = routes[0].geometry;
      if (coordinates && coordinates.length > 0) {
        const bounds = coordinates.reduce(
          (acc, coord) => [
            Math.min(acc[0], coord[0]), // minLng
            Math.min(acc[1], coord[1]), // minLat
            Math.max(acc[2], coord[0]), // maxLng
            Math.max(acc[3], coord[1]), // maxLat
          ],
          [Infinity, Infinity, -Infinity, -Infinity]
        );

        // Define bounding box array: [minLng, minLat, maxLng, maxLat]
        mapRef.current.fitBounds(bounds as [number, number, number, number], {
          padding: { top: 120, bottom: 450, left: 50, right: 50 },
          duration: 1000,
        });
      }
    }
  }, [routes, mode]);

  // mapStyle moved outside to prevent flickering

  const handlePlaceClick = (place: NearbyPlace) => {
    setSelectedPlace({
      id: place.id, name: place.name, category: place.category,
      categoryIcon: place.categoryIcon, lat: place.lat, lng: place.lng,
      address: place.address, rating: 0, reviewCount: 0,
      isOpen: false, hours: place.hours || '',
      tags: place.tags || [],
    });
    setMode('place');
    setSheetSnap('half');
    setCenter({ lat: place.lat, lng: place.lng });
    setZoom(17);
  };

  const routeSources = useMemo(() => {
    return routes.map((route, i) => ({
      id: `route-${i}`,
      geojsonData: {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: route.geometry
        }
      },
      color: route.color
    }));
  }, [routes]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: center.lng, latitude: center.lat, zoom }}
      onMoveEnd={e => {
        const { latitude: lat, longitude: lng, zoom: z } = e.viewState;
        setCenter({ lat, lng });
        setZoom(z);
        if (userMovedRef.current) {
          setShowSearchArea(true);
          loadDynamicPlaces(lat, lng);
        }
      }}
      onDragStart={() => { userMovedRef.current = true; }}
      onZoomStart={() => { userMovedRef.current = true; }}
      mapStyle={mapStyle}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      attributionControl={false}
      pitchWithRotate={true}
      dragRotate={true}
      onClick={e => {
        // Only update explore location if we're in explore mode and clicked on the map background
        if (mode === 'explore') {
          setExploreCenter({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        }
      }}
    >
      <ScaleControl
        position="bottom-left"
        style={{ marginBottom: '80px', marginLeft: '8px', background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '0 4px', fontSize: 10 }}
      />

      {/* User location blue dot + heading cone */}
      {userLocation && (
        <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center" rotation={heading ?? 0}>
          <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {heading !== null && (
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <radialGradient id="coneGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4285F4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Cone pointing UP (0 degrees rotation) */}
                <path d="M 30 30 L 12 5 A 25 25 0 0 1 48 5 Z" fill="url(#coneGrad)" />
              </svg>
            )}
            <div style={{ width: 18, height: 18, background: '#4285F4', borderRadius: '50%', border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', position: 'relative', zIndex: 1 }} />
          </div>
        </Marker>
      )}


      {/* Dynamic place markers from Overpass — ONLY show when actively searching/filtering */}
      {(mode === 'search' || searchQuery) && dynamicPlaces.map(place => {
        const isSelected = selectedPlace?.id === place.id;
        return (
          <Marker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
            anchor="center"
            onClick={() => handlePlaceClick(place)}
          >
            <div
              title={place.name}
              style={{
                background: 'white',
                borderRadius: '50%',
                border: `2.5px solid ${isSelected ? '#1A73E8' : '#EA4335'}`,
                width: isSelected ? 44 : 34,
                height: isSelected ? 44 : 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isSelected ? 22 : 16,
                boxShadow: isSelected ? '0 0 0 3px rgba(26,115,232,0.3), 0 2px 8px rgba(0,0,0,.25)' : '0 2px 6px rgba(0,0,0,.2)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
            >
              {place.categoryIcon}
            </div>
          </Marker>
        );
      })}

      {/* Selected place marker (when clicking a specific result from autocomplete) */}
      {selectedPlace && mode === 'place' && (
         <Marker longitude={selectedPlace.lng} latitude={selectedPlace.lat} anchor="center">
           <div
              title={selectedPlace.name}
              style={{
                background: 'white',
                borderRadius: '50%',
                border: '2.5px solid #1A73E8',
                width: 44,
                height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 0 0 3px rgba(26,115,232,0.3), 0 2px 8px rgba(0,0,0,.25)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
            >
              {selectedPlace.categoryIcon || '📍'}
            </div>
         </Marker>
      )}



      {/* Route layers */}
      {mode === 'directions' && routeSources.map((source, i) => (
        <Source key={source.id} id={source.id} type="geojson" data={source.geojsonData}>
          <Layer
            id={`${source.id}-bg`}
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#185ABC', // Darker blue outline
              'line-width': i === 0 ? 10 : 8,
              'line-opacity': i === 0 ? 1 : 0.6
            }}
          />
          <Layer
            id={`${source.id}-line`}
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': source.color,
              'line-width': i === 0 ? 6 : 4,
              'line-opacity': i === 0 ? 1 : 0.6
            }}
          />
        </Source>
      ))}

      {/* Target destination pin for directions */}
      {selectedPlace && mode === 'directions' && (
         <Marker longitude={selectedPlace.lng} latitude={selectedPlace.lat} anchor="bottom">
           <svg width="28" height="40" viewBox="0 0 24 34">
             <path d="M12 0C5.373 0 0 5.373 0 12c0 7.5 12 22 12 22s12-14.5 12-22C24 5.373 18.627 0 12 0zm0 17c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" fill="#EA4335" stroke="white" strokeWidth="1" />
             <circle cx="12" cy="12" r="5" fill="#751A11" />
           </svg>
         </Marker>
      )}

    </Map>
  );
}
