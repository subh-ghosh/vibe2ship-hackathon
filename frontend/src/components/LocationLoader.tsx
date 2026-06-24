import { useState } from 'react';
import { searchPlaces } from '../services/search';

interface Props {
  denied?: boolean;
  needsManual?: boolean;
  onLocationPicked?: (lat: number, lng: number) => void;
}

export default function LocationLoader({ denied, needsManual, onLocationPicked }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) { setResults([]); return; }
    setSearching(true);
    const res = await searchPlaces(val);
    setResults(res.slice(0, 5));
    setSearching(false);
  };

  // Permission denied — show allow screen
  if (denied) {
    return (
      <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center gap-6 px-8">
        <div className="text-5xl">📍</div>
        <div className="text-center">
          <h2 className="text-[20px] font-medium text-[#1F1F1F] mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Location access needed
          </h2>
          <p className="text-[14px] text-[#5F6368]">
            Click the 🔒 in your browser URL bar → set Location to <strong>Allow</strong>, then refresh.
          </p>
        </div>
        <button onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#1A73E8] text-white text-[14px] font-medium rounded-full">
          Refresh page
        </button>
      </div>
    );
  }

  // No GPS / inaccurate — manual search
  if (needsManual) {
    return (
      <div className="absolute inset-0 z-50 bg-white flex flex-col px-6 pt-16 gap-4">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="text-4xl">🗺️</div>
          <h2 className="text-[20px] font-medium text-[#1F1F1F]" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Where are you?
          </h2>
          <p className="text-[13px] text-[#5F6368] text-center">
            GPS isn't available on this device. Search for your location.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search your location…"
            className="w-full h-12 px-4 rounded-2xl border-2 border-[#1A73E8] text-[15px] outline-none"
            style={{ fontFamily: 'Google Sans, sans-serif' }}
          />
          {searching && (
            <div className="absolute right-3 top-3.5">
              <div className="w-5 h-5 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-[#E8EAED] bg-white">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => onLocationPicked?.(r.lat, r.lng)}
              className="flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F8F9FA] border-b border-[#F1F3F4] last:border-0"
            >
              <span className="text-xl">{r.icon}</span>
              <div>
                <div className="text-[14px] font-medium text-[#1F1F1F]">{r.label}</div>
                <div className="text-[12px] text-[#5F6368]">{r.sublabel}</div>
              </div>
            </button>
          ))}
          {results.length === 0 && query.length >= 2 && !searching && (
            <div className="px-4 py-4 text-[13px] text-[#5F6368] text-center">No results</div>
          )}
        </div>
      </div>
    );
  }

  // Default: ghost skeleton while locating
  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: '#E8EAED' }}>
      {/* Ghost search bar */}
      <div className="px-4 pt-3">
        <div className="h-12 bg-white rounded-full animate-pulse shadow-sm" />
      </div>
      {/* Ghost chips */}
      <div className="flex gap-2 px-4 mt-2">
        {[80, 70, 100, 60, 90].map((w, i) => (
          <div key={i} className="h-8 rounded-full bg-white animate-pulse flex-shrink-0" style={{ width: w, animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      {/* Ghost map */}
      <div className="flex-1 mt-2 relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse"
              style={{ background: `hsl(${210 + (i % 3) * 10}, 15%, ${88 + (i % 4)}%)`, animationDelay: `${i * 0.06}s` }} />
          ))}
        </div>
        <div className="absolute inset-0">
          <svg width="100%" height="100%" opacity="0.3">
            <rect x="30%" y="0" width="4" height="100%" fill="#ccc" rx="2" />
            <rect x="60%" y="0" width="4" height="100%" fill="#ccc" rx="2" />
            <rect x="0" y="35%" width="100%" height="4" fill="#ccc" rx="2" />
            <rect x="0" y="65%" width="100%" height="4" fill="#ccc" rx="2" />
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 40 40" width="56" height="56">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#DADCE0" strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="#1A73E8" strokeWidth="4"
                strokeDasharray="80 20" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <span className="text-[13px] text-[#5F6368] font-medium" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Getting your location…
          </span>
        </div>
      </div>
      {/* Ghost bottom nav */}
      <div className="h-16 bg-white border-t border-[#E8EAED] flex items-center justify-around px-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-[#E8EAED] animate-pulse" />
            <div className="w-10 h-2 rounded bg-[#E8EAED] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
