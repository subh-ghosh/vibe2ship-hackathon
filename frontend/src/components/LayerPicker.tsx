import { X } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

const MAP_TYPES = [
  { id: 'standard', label: 'Default', icon: '🗺️', preview: 'bg-blue-100' },
  { id: 'satellite', label: 'Satellite', icon: '🛰️', preview: 'bg-green-800' },
  { id: 'terrain', label: 'Terrain', icon: '⛰️', preview: 'bg-yellow-200' },
];

export default function LayerPicker() {
  const { mode, setMode, showTraffic, setShowTraffic, showCivicLayer, setShowCivicLayer, setMapType, setShowSatellite } = useMapStore();

  if (mode !== 'layers') return null;

  return (
    <div
      className="absolute inset-x-0 bottom-16 z-30 bg-white"
      style={{ borderRadius: '20px 20px 0 0', boxShadow: '0 -2px 10px rgba(0,0,0,.15)' }}
    >
      <div className="drag-handle" />

      <div className="px-4 pb-6 pt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-medium text-[#202124]" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Map details
          </h3>
          <button onClick={() => setMode('explore')} className="w-8 h-8 rounded-full bg-[#F1F3F4] flex items-center justify-center">
            <X size={16} color="#5F6368" />
          </button>
        </div>

        {/* Map type row */}
        <div className="mb-6">
          <div className="text-[12px] font-medium text-[#5F6368] uppercase tracking-wide mb-3">Map type</div>
          <div className="flex gap-3">
            {MAP_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => {
                  setMapType(type.id as 'standard' | 'satellite' | 'terrain');
                  setShowSatellite(type.id === 'satellite');
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-16 h-16 rounded-xl ${type.preview} border-2 border-[#DADCE0] overflow-hidden flex items-center justify-center text-2xl`}>
                  {type.icon}
                </div>
                <span className="text-[11px] text-[#202124]">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map details */}
        <div>
          <div className="text-[12px] font-medium text-[#5F6368] uppercase tracking-wide mb-3">Map details</div>
          <div className="space-y-0">
            {[
              { label: 'Traffic', sublabel: 'Live traffic conditions', icon: '🚦', enabled: showTraffic, onToggle: () => setShowTraffic(!showTraffic) },
              { label: 'CivicOS Layer', sublabel: 'Civic issues & infrastructure scores', icon: '⚡', enabled: showCivicLayer, onToggle: () => setShowCivicLayer(!showCivicLayer) },
              { label: 'Public transport', sublabel: 'Bus & metro routes', icon: '🚌', enabled: false, onToggle: () => {} },
              { label: 'Bicycling', sublabel: 'Cycle lanes & paths', icon: '🚲', enabled: false, onToggle: () => {} },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 py-3 border-b border-[#F1F3F4]">
                <div className="w-10 h-10 rounded-full bg-[#F1F3F4] flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-[#202124]">{item.label}</div>
                  <div className="text-[12px] text-[#5F6368]">{item.sublabel}</div>
                </div>
                <button
                  onClick={item.onToggle}
                  className={`w-12 h-6 rounded-full transition-colors relative ${item.enabled ? 'bg-[#1A73E8]' : 'bg-[#DADCE0]'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
