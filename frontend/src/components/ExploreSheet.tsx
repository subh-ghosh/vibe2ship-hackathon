import { Share2, Bookmark, MoreHorizontal, Cloud } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export default function ExploreSheet() {
  const { mode } = useMapStore();

  if (mode !== 'explore') return null;

  return (
    <div className="bg-white min-h-[500px]">
      {/* Header (Peek state content) */}
      <div className="px-5 py-2 flex items-center justify-between">
        <h2 className="text-[22px] font-normal text-[#1F1F1F]" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Gobardanga
        </h2>
        
        {/* Weather & AQI */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-[#444746]">
            <Cloud size={16} fill="#5F6368" stroke="none" />
            <span className="text-[14px] font-medium">28°</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-[#5E97F6]"></div>
            <span className="text-[11px] text-[#444746] font-medium">NAQI</span>
          </div>
        </div>
      </div>

      {/* Expanded state content */}
      <div className="px-5 mt-4">
        <div className="flex gap-2 mb-6">
          <button className="flex-1 bg-[#F1F3F4] text-[#1F1F1F] py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2">
            <Bookmark size={18} />
            Save
          </button>
          <button className="flex-1 bg-[#F1F3F4] text-[#1F1F1F] py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2">
            <Share2 size={18} />
            Share
          </button>
          <button className="w-10 bg-[#F1F3F4] text-[#1F1F1F] rounded-full flex items-center justify-center">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <h3 className="text-[16px] font-medium text-[#1F1F1F] mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          Latest in Gobardanga
        </h3>

        {/* Mock photos grid */}
        <div className="flex gap-2 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="w-40 h-48 bg-[#E3E3E3] rounded-xl flex-shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Photo {i}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
