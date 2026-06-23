import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, Mic, X } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { searchPlaces } from '../services/search';
import type { SearchSuggestion } from '../types';
import { RECENT_SEARCHES, PLACES } from '../data/places';

export default function SearchBar() {
  const {
    searchQuery, setSearchQuery, searchFocused, setSearchFocused,
    mode, setMode, setCenter, setZoom, setSelectedPlace,
    setSheetSnap, userAvatar,
  } = useMapStore();

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>(RECENT_SEARCHES);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchFocused]);

  const handleInput = useCallback(async (val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchPlaces(val);
      setSuggestions(results);
      setLoading(false);
    }, 300);
  }, [setSearchQuery]);

  const handleSelect = (s: SearchSuggestion) => {
    setSearchQuery(s.label);
    setSearchFocused(false);
    setCenter({ lat: s.lat, lng: s.lng });
    setZoom(16);
    // Find matching place
    const place = PLACES.find((p) => p.id === s.id);
    if (place) {
      setSelectedPlace(place);
      setMode('place');
      setSheetSnap('half');
    } else {
      setMode('explore');
      setSheetSnap('peek');
    }
  };

  const handleBack = () => {
    setSearchFocused(false);
    setSearchQuery('');
    setSuggestions(RECENT_SEARCHES);
    if (mode === 'search') setMode('explore');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions(RECENT_SEARCHES);
    inputRef.current?.focus();
  };

  if (mode === 'navigate') return null;

  return (
    <>
      {/* Search bar and Chips container */}
      <div
        className="absolute top-0 left-0 right-0 z-30 pt-3 pb-2 flex flex-col gap-2"
        style={{ pointerEvents: 'none' }}
      >
        <div className="px-4">
          <div
            className="flex items-center gap-3 bg-white rounded-[24px] px-3.5"
            style={{
              height: '48px',
              boxShadow: '0 1px 3px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.1)',
              pointerEvents: 'all',
            }}
          >
            {searchFocused || mode === 'directions' ? (
              <button onClick={handleBack} className="text-[#5F6368] flex-shrink-0">
                <ArrowLeft size={22} />
              </button>
            ) : (
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#EA4335" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" fill="#4285F4" />
                  <path d="M12 2C6.48 2 2 6.48 2 12" fill="#FBBC05" />
                </svg>
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
              <button onClick={clearSearch} className="text-[#5F6368] flex-shrink-0 p-1">
                <X size={20} />
              </button>
            ) : (
              <button className="text-[#5F6368] flex-shrink-0 p-1">
                <Mic size={20} />
              </button>
            )}

            {!searchFocused && (
              <button className="flex-shrink-0 ml-1">
                <img
                  src={userAvatar}
                  alt="Account"
                  className="w-[30px] h-[30px] rounded-full border border-gray-200"
                />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips - Only show when not searching */}
        {!searchFocused && mode !== 'directions' && (
          <div 
            className="flex gap-2 overflow-x-auto px-4 pb-1" 
            style={{ scrollbarWidth: 'none', pointerEvents: 'all' }}
          >
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#D3E3FD] flex-shrink-0 transition-colors">
              <span className="text-[#0B57D0] text-sm">✨</span>
              <span className="text-[13px] font-medium text-[#0B57D0]" style={{ fontFamily: 'Google Sans, sans-serif' }}>Ask Maps</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#DADCE0] flex-shrink-0 hover:bg-[#F8F9FA] transition-colors shadow-sm">
              <span className="text-[#444746] text-sm">💼</span>
              <span className="text-[13px] font-medium text-[#444746]" style={{ fontFamily: 'Google Sans, sans-serif' }}>Work</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#DADCE0] flex-shrink-0 hover:bg-[#F8F9FA] transition-colors shadow-sm">
              <span className="text-[#444746] text-sm">🍴</span>
              <span className="text-[13px] font-medium text-[#444746]" style={{ fontFamily: 'Google Sans, sans-serif' }}>Restaurants</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#DADCE0] flex-shrink-0 hover:bg-[#F8F9FA] transition-colors shadow-sm">
              <span className="text-[#444746] text-sm">🏨</span>
              <span className="text-[13px] font-medium text-[#444746]" style={{ fontFamily: 'Google Sans, sans-serif' }}>Hotels</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#DADCE0] flex-shrink-0 hover:bg-[#F8F9FA] transition-colors shadow-sm">
              <span className="text-[#444746] text-sm">⛽</span>
              <span className="text-[13px] font-medium text-[#444746]" style={{ fontFamily: 'Google Sans, sans-serif' }}>Gas</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#DADCE0] flex-shrink-0 hover:bg-[#F8F9FA] transition-colors shadow-sm">
              <span className="text-[#444746] text-sm">🛒</span>
              <span className="text-[13px] font-medium text-[#444746]" style={{ fontFamily: 'Google Sans, sans-serif' }}>Groceries</span>
            </button>
          </div>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {searchFocused && (
        <div
          className="absolute top-[68px] left-4 right-4 z-30 bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,.25)', pointerEvents: 'all' }}
        >
          {/* Divider */}
          <div className="h-px bg-[#DADCE0] mx-4" />

          {loading && (
            <div className="flex gap-2 px-4 py-3 items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#DADCE0] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          {!loading && suggestions.map((s, idx) => (
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
              {s.type === 'recent' && (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#5F6368" style={{ transform: 'rotate(225deg)', flexShrink: 0 }}>
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              )}
            </button>
          ))}

          {!loading && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center text-[#5F6368] text-sm">No results found</div>
          )}
        </div>
      )}
    </>
  );
}
