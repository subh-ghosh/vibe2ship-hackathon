import { useMapStore } from '../store/mapStore';
import { PlusCircle } from 'lucide-react';

export default function HeroReportButton() {
  const { setMode, setSheetSnap, mode } = useMapStore();

  // Hide the button if we are already in report mode or active navigation
  if (mode === 'report' || mode === 'active_nav') return null;

  return (
    <button
      onClick={() => {
        setMode('report');
        setSheetSnap('half');
      }}
      className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-40 bg-[#1A73E8] text-white px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 font-medium text-[16px] active:scale-95 transition-transform duration-200"
      style={{ fontFamily: 'Google Sans, sans-serif' }}
    >
      <PlusCircle size={22} />
      Report Issue
    </button>
  );
}
