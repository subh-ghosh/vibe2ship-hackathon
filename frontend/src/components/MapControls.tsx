import { Crosshair, Plus, Minus } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export default function MapControls() {
  const { setMode, mode, sheetSnap } = useMapStore();

  if (mode === 'search') return null;

  // Bottom sheet is at bottom-16 (64px). 
  // Peek height is 160 -> top is 224px. Half height is 420 -> top is 484px.
  // Add 16px gap to place FABs above the sheet.
  const sheetTop = sheetSnap === 'peek' ? 240 : sheetSnap === 'half' ? 500 : 900;

  return (
    <>
      {/* Right side FABs (Zoom, Layers, Location) */}
      <div className="absolute right-3 z-30 flex flex-col gap-2 transition-all duration-300" style={{ bottom: `${sheetTop + 72}px` }}>

        {/* Zoom controls — stacked pill */}
        <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-[#E8EAED]">
          <button
            onClick={() => window.__mapZoomIn?.()}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F1F3F4] active:bg-[#E8EAED] transition-colors"
            title="Zoom in"
          >
            <Plus size={20} color="#1F1F1F" />
          </button>
          <div className="h-px bg-[#E8EAED]" />
          <button
            onClick={() => window.__mapZoomOut?.()}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F1F3F4] active:bg-[#E8EAED] transition-colors"
            title="Zoom out"
          >
            <Minus size={20} color="#1F1F1F" />
          </button>
        </div>



        {/* My Location */}
        <button
          onClick={() => window.__triggerMyLocation?.()}
          className="gm-fab-small"
          title="My location"
        >
          <Crosshair size={20} color="#5F6368" />
        </button>
      </div>


    </>
  );
}
