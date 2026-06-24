import { useEffect, useState } from 'react';
import { Navigation, Train, Car, Bike, Share2, X, MoreHorizontal } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { fetchRoute } from '../services/routing';

export default function DirectionsSheet() {
  const { selectedPlace, userLocation, transportMode, setTransportMode, routes, setRoutes, setMode, setSheetSnap } = useMapStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPlace || !userLocation) return;
    let active = true;
    
    setLoading(true);
    fetchRoute(userLocation, { lat: selectedPlace.lat, lng: selectedPlace.lng }, transportMode).then(r => {
      if (!active) return;
      setRoutes(r);
      setLoading(false);
    });

    return () => { active = false; };
  }, [selectedPlace, userLocation, transportMode]);

  if (!selectedPlace) return null;

  const activeRoute = routes[0];

  return (
    <div className="h-full bg-white flex flex-col pt-1">
      <div className="px-5 pt-2 pb-3">
        <h2 className="text-[24px] font-normal text-[#1F1F1F] leading-tight mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          {transportMode.charAt(0).toUpperCase() + transportMode.slice(1).replace('-', ' ')}
        </h2>

        {/* Modes */}
        <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-2">
          {[
            { id: 'driving', icon: Car, label: '35 hr' },
            { id: 'two-wheeler', icon: Bike, label: '35 hr' },
            { id: 'transit', icon: Train, label: '1 day' },
            { id: 'walking', icon: Navigation, label: '17 days' } // Navigation used as placeholder for walk
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
        ) : activeRoute ? (
          <div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-[24px] text-[#146C2E] font-normal" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                {activeRoute.duration}
              </span>
              <span className="text-[16px] text-[#5F6368] mb-1">({activeRoute.distance})</span>
            </div>
            <p className="text-[13px] text-[#5F6368] mb-1">Fastest route now, avoids road closures</p>
            <p className="text-[13px] text-[#146C2E] flex items-center gap-1 mb-5">
              <span className="w-3 h-3 border border-[#146C2E] rounded-full inline-block" /> Saves fuel
            </p>

            {/* Actions */}
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              <button 
                onClick={() => {
                  alert('Navigation mode activated!');
                  setSheetSnap('peek');
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
