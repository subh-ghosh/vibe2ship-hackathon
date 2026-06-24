import { X, Navigation, Search, BellOff, AlertTriangle } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export default function ActiveNavOverlay() {
  const { setMode, setSheetSnap, routes, transportMode } = useMapStore();

  const activeRoute = routes[0];
  const distance = activeRoute?.distance || '---';
  const duration = activeRoute?.duration || '---';

  const handleExit = () => {
    setMode('directions');
    setSheetSnap('half');
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between">
      {/* Top Banner */}
      <div className="p-2 pt-4 pointer-events-auto w-[95%] max-w-md mx-auto">
        <div className="bg-[#006064] text-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Navigation size={32} className="text-white fill-white" />
              <div className="text-[26px] font-medium leading-none" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Head northwest
              </div>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1A73E8">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
          <div className="bg-[#004D40] px-4 py-2 flex items-center gap-2 rounded-br-2xl w-max">
            <span className="text-[16px] font-medium">Then</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14l-4-4 4-4" />
              <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="flex-1 flex items-end justify-between px-3 pb-3 pointer-events-none">
        
        {/* Speedometer */}
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-gray-100 pointer-events-auto">
          <span className="text-[22px] font-bold leading-none text-[#202124]">0</span>
          <span className="text-[10px] font-medium text-[#5F6368] mt-0.5">km/h</span>
        </div>

        {/* Right Controls */}
        <div className="flex flex-col gap-3 items-end pointer-events-auto">
          <button className="w-[52px] h-[52px] bg-white rounded-full shadow-md flex items-center justify-center text-[#5F6368]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#EA4335" />
            </svg>
          </button>
          <button className="w-[52px] h-[52px] bg-white rounded-full shadow-md flex items-center justify-center text-[#202124]">
            <Search size={22} strokeWidth={2.5} />
          </button>
          <button className="w-[52px] h-[52px] bg-white rounded-full shadow-md flex items-center justify-center text-[#202124]">
            <BellOff size={22} strokeWidth={2.5} />
          </button>
          
          <button className="h-[44px] px-4 bg-white rounded-full shadow-md flex items-center gap-2 mt-4 text-[#202124]">
            <AlertTriangle size={18} color="#F29900" fill="#FFF3E0" />
            <span className="font-medium text-[14px]">Report</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white rounded-t-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.1)] pointer-events-auto relative">
        <div className="flex justify-center pt-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-4 pb-8 pt-4">
          <button 
            onClick={handleExit}
            className="w-[52px] h-[52px] bg-[#F1F3F4] rounded-full flex items-center justify-center text-[#202124]"
          >
            <X size={28} />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="text-[28px] text-[#0D652D] font-medium leading-none flex items-center gap-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {duration}
            </div>
            <div className="text-[15px] text-[#5F6368] font-medium mt-1">
              {distance} • {transportMode}
            </div>
          </div>
          
          <button className="w-[52px] h-[52px] bg-[#F1F3F4] rounded-full flex items-center justify-center text-[#202124]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16M4 12h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
