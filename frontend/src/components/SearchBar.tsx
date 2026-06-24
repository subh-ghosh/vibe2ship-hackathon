import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, Mic, X } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { searchPlaces } from '../services/search';
import type { SearchSuggestion } from '../types';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { fetchNearbyPlaces } from '../services/overpass';

const CATEGORY_CHIPS = [
  { id: 'ask', label: 'Ask Maps', icon: '✨', special: true },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️', query: 'restaurant' },
  { id: 'coffee', label: 'Coffee', icon: '☕', query: 'cafe' },
  { id: 'hotels', label: 'Hotels', icon: '🏨', query: 'hotel' },
  { id: 'fuel', label: 'Gas', icon: '⛽', query: 'fuel' },
  { id: 'atm', label: 'ATMs', icon: '🏧', query: 'atm' },
  { id: 'hospital', label: 'Hospital', icon: '🏥', query: 'hospital' },
  { id: 'grocery', label: 'Grocery', icon: '🛒', query: 'supermarket' },
];

export default function SearchBar() {
  const dragScrollProps = useDraggableScroll<HTMLDivElement>();
  const {
    searchQuery, setSearchQuery, searchFocused, setSearchFocused,
    mode, setMode, setCenter, setZoom, setSelectedPlace,
    setSheetSnap, userAvatar, center,
  } = useMapStore();

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchFocused && inputRef.current) inputRef.current.focus();
  }, [searchFocused]);

  const handleInput = useCallback(async (val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchPlaces(val, center.lat, center.lng);
      setSuggestions(results);
      setLoading(false);
    }, 300);
  }, [setSearchQuery, center]);

  const handleSelect = async (s: SearchSuggestion) => {
    let lat = s.lat;
    let lng = s.lng;
    
    // Fallback just in case, but Ola should provide these immediately
    if (lat === undefined || lng === undefined) {
      lat = center.lat;
      lng = center.lng;
    }

    setSearchQuery(s.label);
    setSearchFocused(false);
    setCenter({ lat, lng });
    setZoom(16);
    setSelectedPlace({
      id: s.id,
      name: s.label,
      address: s.sublabel,
      lat,
      lng,
      category: s.type === 'place' ? 'Location' : 'Search Result',
      categoryIcon: s.icon || '📍',
      rating: 0,
      reviewCount: 0,
      isOpen: false,
      hours: '',
      tags: [],
    });
    setMode('place');
    setSheetSnap('half');
  };

  const handleChip = async (query: string) => {
    setLoading(true);
    const places = await fetchNearbyPlaces(center.lat, center.lng, 2000);
    const filtered = places.filter(p =>
      p.category.toLowerCase().includes(query) ||
      (p.tags || []).some(t => t?.toLowerCase().includes(query))
    );
    // Show results in search mode
    setSearchQuery(query);
    setSearchFocused(true);
    setMode('search');
    setSuggestions(filtered.map(p => ({
      id: p.id,
      label: p.name,
      sublabel: p.address || p.category,
      lat: p.lat,
      lng: p.lng,
      type: 'place' as const,
      icon: p.categoryIcon,
    })));
    setLoading(false);
  };

  const handleBack = () => {
    setSearchFocused(false);
    setSearchQuery('');
    setSuggestions([]);
    if (mode === 'search') setMode('explore');
  };


  return (
    <>
      {/* Search bar + Chips */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-3 pb-2 flex flex-col gap-2" style={{ pointerEvents: 'none' }}>
        <div className="px-4">
          <div
            className="flex items-center gap-3 bg-white rounded-[24px] px-3.5"
            style={{ height: '48px', boxShadow: '0 1px 3px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.1)', pointerEvents: 'all' }}
          >
            {searchFocused ? (
              <button onClick={handleBack} className="text-[#5F6368] flex-shrink-0">
                <ArrowLeft size={22} />
              </button>
            ) : (
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src="https://maps.gstatic.com/mapfiles/maps_lite/pwa/icons/maps15_bnuw3a_round_192x192.png" 
                  alt="Google Maps" 
                  width="24" 
                  height="24" 
                />
              </div>
            )}

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => handleInput(e.target.value)}
              onFocus={() => { setSearchFocused(true); setMode('search'); }}
              placeholder="Search here"
              className="flex-1 bg-transparent text-[#202124] text-[16px] outline-none placeholder-[#5F6368]"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            />

            {searchQuery ? (
              <button onClick={() => { setSearchQuery(''); setSuggestions([]); inputRef.current?.focus(); }} className="text-[#5F6368] flex-shrink-0 p-1">
                <X size={20} />
              </button>
            ) : (
              <button className="text-[#5F6368] flex-shrink-0 p-1"><Mic size={20} /></button>
            )}

            {!searchFocused && (
              <button className="flex-shrink-0 ml-1">
                <img src={userAvatar} alt="Account" className="w-[30px] h-[30px] rounded-full border border-gray-200" />
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        {!searchFocused && (
          <div
            {...dragScrollProps}
            className="flex gap-2 overflow-x-auto px-4 pb-1"
            style={{ scrollbarWidth: 'none', pointerEvents: 'all', ...dragScrollProps.style }}
          >
            {CATEGORY_CHIPS.map(chip => (
              <button
                key={chip.id}
                onClick={() => chip.id !== 'ask' && handleChip(chip.query!)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border flex-shrink-0 transition-colors shadow-sm ${
                  chip.special
                    ? 'bg-white border-[#D3E3FD] text-[#0B57D0]'
                    : 'bg-white border-[#DADCE0] text-[#444746] hover:bg-[#F8F9FA]'
                }`}
              >
                <span className="text-sm">{chip.icon}</span>
                <span className="text-[13px] font-medium" style={{ fontFamily: 'Google Sans, sans-serif' }}>{chip.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {searchFocused && (
        <div
          className="absolute top-[68px] left-4 right-4 z-30 bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,.25)', pointerEvents: 'all' }}
        >
          <div className="h-px bg-[#DADCE0] mx-4" />

          {loading && (
            <div className="flex gap-2 px-4 py-3 items-center">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#DADCE0] animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />
              ))}
            </div>
          )}

          {!loading && suggestions.length === 0 && searchQuery.length > 1 && (
            <div className="px-4 py-6 text-center text-[#5F6368] text-sm">No results found</div>
          )}

          {!loading && suggestions.length === 0 && searchQuery.length <= 1 && (
            <div className="px-4 py-6 text-center text-[#5F6368] text-sm">Start typing to search anywhere…</div>
          )}

          {!loading && suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#F8F9FA] transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#F1F3F4] flex items-center justify-center flex-shrink-0 text-lg">
                {s.type === 'recent' ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#5F6368">
                    <path d="M13 3a9 9 0 10.05 18A9 9 0 0013 3zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm.5-11H12v6l5.25 3.15.75-1.23-4.5-2.67V8z" />
                  </svg>
                ) : s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#202124] truncate">{s.label}</div>
                <div className="text-[12px] text-[#5F6368] truncate">{s.sublabel}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
