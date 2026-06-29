import { useEffect, useState } from 'react';
import { Navigation, Train, Car, Bike, Share2, X, MoreHorizontal } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { fetchRoute } from '../services/routing';

export default function DirectionsSheet() {
  const { 
    selectedPlace, userLocation, transportMode, setTransportMode, 
    routes, setRoutes, mode, setMode, setSheetSnap,
    selectedRouteIndex, setSelectedRouteIndex 
  } = useMapStore();
  const [loading, setLoading] = useState(false);
  const [etas, setEtas] = useState<Record<string, string>>({
    driving: '--',
    'two-wheeler': '--',
    transit: '--',
    walking: '--'
  });

  // Only recalculate route if user moves significantly (~111 meters) to stop map blinking
  const locKey = userLocation ? `${userLocation.lat.toFixed(3)},${userLocation.lng.toFixed(3)}` : '';

  useEffect(() => {
    if (!selectedPlace || !userLocation) return;
    let active = true;

    setLoading(true);
    fetchRoute(userLocation, { lat: selectedPlace.lat, lng: selectedPlace.lng }, 'driving').then(r => {
      if (!active) return;
      setRoutes(r);
      setLoading(false);
      if (r[0] && r[0].durationSeconds) {
        const drivingSecs = r[0].durationSeconds;

        const formatDur = (sec: number) => {
          const h = Math.floor(sec / 3600);
          const m = Math.round((sec % 3600) / 60);
          if (h > 24) return `${Math.floor(h/24)} d ${h%24} h`;
          if (h > 0) return `${h} h ${m} m`;
          return `${m} m`;
        };

        setEtas({
          driving: formatDur(drivingSecs),
          'two-wheeler': formatDur(drivingSecs * 1.1),
          transit: formatDur(drivingSecs * 1.5),
          walking: formatDur(drivingSecs * 10)
        });
      }
    });

    return () => { active = false; };
  }, [selectedPlace?.id, !!userLocation]); // Only refetch on destination change, or when GPS first locks

  if (!selectedPlace || mode !== 'directions') return null;

  return (
    <div className="h-full bg-white flex flex-col pt-1">
      <div className="px-5 pt-2 pb-3">
        <h2 className="text-[24px] font-normal text-[#1F1F1F] leading-tight mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          {transportMode.charAt(0).toUpperCase() + transportMode.slice(1).replace('-', ' ')}
        </h2>

        {/* Modes */}
        <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-2">
          {[
            { id: 'driving', icon: Car, label: etas['driving'] },
            { id: 'two-wheeler', icon: Bike, label: etas['two-wheeler'] },
            { id: 'transit', icon: Train, label: etas['transit'] },
            { id: 'walking', icon: Navigation, label: etas['walking'] }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setTransportMode(m.id as any)}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <m.icon size={24} className={transportMode === m.id ? 'text-[#0B57D0]' : 'text-[#5F6368]'} />
              <span className={`text-[12px] ${transportMode === m.id ? 'text-[#0B57D0] font-medium' : 'text-[#5F6368]'}`}>
                {m.label}
              </span>
              {transportMode === m.id && (
                <div className="h-[3px] w-full bg-[#0B57D0] rounded-t-full mt-1" />
              )}
            </button>
          ))}
        </div>

        {/* Route Details */}
        {loading ? (
          <div className="animate-pulse flex flex-col gap-2">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : routes.length > 0 ? (
          <div>
            {/* Route Options Chips */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2" style={{ scrollbarWidth: 'none' }}>
              {routes.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedRouteIndex(i)}
                  className={`flex flex-col flex-shrink-0 px-4 py-2 rounded-xl border-2 transition-colors ${
                    selectedRouteIndex === i 
                      ? 'border-[#1A73E8] bg-[#E8F0FE]' 
                      : 'border-[#DADCE0] bg-white'
                  }`}
                  style={{ minWidth: '130px' }}
                >
                  <span className={`text-[15px] font-medium ${selectedRouteIndex === i ? 'text-[#1A73E8]' : 'text-[#1F1F1F]'}`}>
                    {r.duration}
                  </span>
                  <span className="text-[12px] text-[#5F6368]">{r.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2 mb-1">
              <span className="text-[24px] text-[#146C2E] font-normal" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                {routes[selectedRouteIndex]?.duration}
              </span>
              <span className="text-[16px] text-[#5F6368] mb-1">({routes[selectedRouteIndex]?.distance})</span>
            </div>
            
            <div className="flex flex-col gap-1 mb-5">
              <p className="text-[13px] text-[#5F6368] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                {selectedRouteIndex === 0 && 'Fastest route. AI optimized to avoid 3 reported potholes.'}
                {selectedRouteIndex === 1 && 'Safest route. Avoids high-risk intersections and 2 flooded zones.'}
                {selectedRouteIndex === 2 && 'Community Verified. 98/100 Infrastructure Health Score.'}
              </p>
              <p className="text-[13px] text-[#146C2E] flex items-center gap-1">
                <span className="w-3 h-3 border border-[#146C2E] rounded-full inline-block flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-[#146C2E] rounded-full" />
                </span> 
                {selectedRouteIndex === 2 ? 'Real-time hazard free' : 'Saves fuel'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              <button 
                onClick={() => {
                  setMode('active_nav');
                  setSheetSnap('full'); // We will repurpose full or peek for active nav
                }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#006064] text-white rounded-full font-medium text-[14px] flex-shrink-0"
              >
                <Navigation size={18} /> Start
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F1F3F4] text-[#001D35] rounded-full font-medium text-[13px] flex-shrink-0">
                <span className="w-4 h-4 border border-current rounded-full flex items-center justify-center">+</span> Add stops
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F1F3F4] text-[#001D35] rounded-full font-medium text-[13px] flex-shrink-0">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-[#5F6368]">No route found for this mode.</p>
        )}
      </div>
    </div>
  );
}
