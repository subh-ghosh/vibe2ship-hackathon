import { useState, useEffect } from 'react';
import { ArrowLeft, Car, PersonStanding, Bike, Train, ChevronRight, X } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { getRoutes } from '../services/routing';
import { reverseGeocode, searchPlaces } from '../services/search';
import type { TransportMode, Route } from '../types';

const TRANSPORT_ICONS: { mode: TransportMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'driving', icon: <Car size={20} />, label: 'Drive' },
  { mode: 'two-wheeler', icon: <span className="text-xl">🏍️</span>, label: 'Ride' },
  { mode: 'transit', icon: <Train size={20} />, label: 'Transit' },
  { mode: 'walking', icon: <PersonStanding size={20} />, label: 'Walk' },
  { mode: 'cycling', icon: <Bike size={20} />, label: 'Cycle' },
];

const TRAFFIC_COLORS = {
  light: '#34A853',
  moderate: '#FBBC04',
  heavy: '#EA4335',
};

function RouteCard({ route, active, onSelect }: { route: Route; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 border-b border-[#F1F3F4] transition-colors ${active ? 'bg-[#E8F0FE]' : 'hover:bg-[#F8F9FA]'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-medium text-[#202124]">{route.label}</span>
            {route.type === 'civic' && (
              <span className="text-[10px] bg-[#34A853] text-white px-2 py-0.5 rounded-full font-medium">Best</span>
            )}
          </div>
          <div className="text-[13px] text-[#5F6368] mt-0.5">{route.via}</div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: TRAFFIC_COLORS[route.trafficLevel] }} />
              <span className="text-[12px] text-[#5F6368] capitalize">{route.trafficLevel} traffic</span>
            </span>
            {route.civicScore && (
              <span className="text-[12px] text-[#1A73E8]">Civic score: {route.civicScore}/100</span>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <div className="text-[17px] font-medium text-[#202124]">{route.duration}</div>
          <div className="text-[13px] text-[#5F6368]">{route.distance}</div>
        </div>
      </div>
    </button>
  );
}

export default function DirectionsPanel() {
  const {
    mode, origin, destination, setOrigin, setDestination,
    transportMode, setTransportMode, routes, setRoutes,
    activeRoute, setActiveRoute, setMode, setSheetSnap,
    setRouteSteps, setCenter, setNavigating, setZoom,
  } = useMapStore();

  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<Awaited<ReturnType<typeof searchPlaces>>>([]);
  const [toSuggestions, setToSuggestions] = useState<Awaited<ReturnType<typeof searchPlaces>>>([]);
  const [focusedInput, setFocusedInput] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    if (destination) {
      setToText(destination.label);
      fetchRoutes();
    }
  }, [destination, transportMode]);

  useEffect(() => {
    if (origin) setFromText(origin.label);
    else setFromText('Your location');
  }, [origin]);

  const fetchRoutes = async () => {
    if (!destination) return;
    setLoading(true);
    const start = origin?.latlng || { lat: 12.9716, lng: 77.5946 };
    const { routes: r, steps } = await getRoutes(start, destination.latlng, transportMode);
    setRoutes(r);
    setRouteSteps(steps);
    setActiveRoute(r[0]);
    // Fit map to route
    if (r[0]?.geometry.length) {
      const lats = r[0].geometry.map(c => c[1]);
      const lngs = r[0].geometry.map(c => c[0]);
      const midLat = (Math.max(...lats) + Math.min(...lats)) / 2;
      const midLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
      setCenter({ lat: midLat, lng: midLng });
      setZoom(12);
    }
    setLoading(false);
  };

  const handleFromSearch = async (q: string) => {
    setFromText(q);
    if (q.length < 2) return;
    const res = await searchPlaces(q);
    setFromSuggestions(res);
  };

  const handleToSearch = async (q: string) => {
    setToText(q);
    if (q.length < 2) return;
    const res = await searchPlaces(q);
    setToSuggestions(res);
  };

  const startNavigation = () => {
    if (!activeRoute) return;
    setMode('navigate');
    setNavigating(true);
    setSheetSnap('peek');
  };

  if (mode !== 'directions') return null;

  return (
    <div className="absolute inset-x-0 top-0 bottom-16 z-30 bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-[#1A73E8] px-2 pt-3 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => { setMode('explore'); setRoutes([]); setActiveRoute(null); }}
            className="p-2 text-white">
            <ArrowLeft size={22} />
          </button>
          <span className="text-white font-medium text-[16px]">Directions</span>
        </div>

        {/* From / To inputs */}
        <div className="flex gap-2">
          {/* Route line indicator */}
          <div className="flex flex-col items-center justify-center gap-1 mt-2 ml-1">
            <div className="w-3 h-3 rounded-full border-2 border-white bg-[#1A73E8]" />
            <div className="w-0.5 h-6 bg-white opacity-60" />
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {/* From */}
            <div className="relative bg-white rounded-lg overflow-visible">
              <input
                value={fromText}
                onChange={e => handleFromSearch(e.target.value)}
                onFocus={() => setFocusedInput('from')}
                onBlur={() => setTimeout(() => setFocusedInput(null), 150)}
                placeholder="Choose starting point"
                className="w-full px-3 py-2.5 text-[14px] text-[#202124] outline-none rounded-lg"
              />
              {focusedInput === 'from' && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 max-h-40 overflow-y-auto">
                  {fromSuggestions.map(s => (
                    <button key={s.id} onClick={() => {
                      setOrigin({ label: s.label, latlng: { lat: s.lat, lng: s.lng } });
                      setFromText(s.label);
                      setFromSuggestions([]);
                      if (destination) fetchRoutes();
                    }} className="w-full text-left px-3 py-2 text-[13px] text-[#202124] hover:bg-[#F8F9FA] flex items-center gap-2">
                      <span>📍</span> {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* To */}
            <div className="relative bg-white rounded-lg overflow-visible">
              <input
                value={toText}
                onChange={e => handleToSearch(e.target.value)}
                onFocus={() => setFocusedInput('to')}
                onBlur={() => setTimeout(() => setFocusedInput(null), 150)}
                placeholder="Choose destination"
                className="w-full px-3 py-2.5 text-[14px] text-[#202124] outline-none rounded-lg"
              />
              {focusedInput === 'to' && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 max-h-40 overflow-y-auto">
                  {toSuggestions.map(s => (
                    <button key={s.id} onClick={() => {
                      setDestination({ label: s.label, latlng: { lat: s.lat, lng: s.lng } });
                      setToText(s.label);
                      setToSuggestions([]);
                    }} className="w-full text-left px-3 py-2 text-[13px] text-[#202124] hover:bg-[#F8F9FA] flex items-center gap-2">
                      <span>📍</span> {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transport mode selector */}
      <div className="flex-shrink-0 bg-white border-b border-[#DADCE0] flex overflow-x-auto">
        {TRANSPORT_ICONS.map(({ mode: m, icon, label }) => (
          <button
            key={m}
            onClick={() => setTransportMode(m)}
            className={`flex flex-col items-center gap-1 px-4 py-2.5 flex-shrink-0 border-b-2 transition-colors
              ${transportMode === m ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-[#5F6368]'}`}
          >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Route options */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-3 h-3 rounded-full bg-[#1A73E8] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <div className="text-[#5F6368] text-sm">Finding best routes...</div>
          </div>
        ) : routes.length > 0 ? (
          <>
            {routes.map(route => (
              <RouteCard
                key={route.type}
                route={route}
                active={activeRoute?.type === route.type}
                onSelect={() => setActiveRoute(route)}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-[#5F6368] gap-2">
            <span className="text-3xl">🗺️</span>
            <span className="text-sm">Choose a destination to see routes</span>
          </div>
        )}
      </div>

      {/* Start navigation CTA */}
      {activeRoute && (
        <div className="flex-shrink-0 p-4 border-t border-[#F1F3F4]">
          <button
            onClick={startNavigation}
            className="w-full bg-[#1A73E8] text-white font-medium text-[15px] py-3.5 rounded-full flex items-center justify-center gap-2"
          >
            <span>▶</span>
            Start · {activeRoute.duration}
          </button>
        </div>
      )}
    </div>
  );
}
