import { MapPin, Bookmark, PlusCircle } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import type { NavTab } from '../types';

const TABS: { id: NavTab; icon: React.ReactNode; activeIcon: React.ReactNode; label: string }[] = [
  { 
    id: 'explore', 
    icon: <MapPin size={24} strokeWidth={1.5} />, 
    activeIcon: <MapPin size={24} fill="currentColor" strokeWidth={1.5} />, 
    label: 'Explore' 
  },
  { 
    id: 'saved', 
    icon: <Bookmark size={24} strokeWidth={1.5} />, 
    activeIcon: <Bookmark size={24} fill="currentColor" strokeWidth={1.5} />, 
    label: 'You' 
  },
  { 
    id: 'contribute', 
    icon: <PlusCircle size={24} strokeWidth={1.5} />, 
    activeIcon: <PlusCircle size={24} fill="currentColor" strokeWidth={1.5} />, 
    label: 'Contribute' 
  },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, mode, setMode, setSheetSnap } = useMapStore();

  if (mode === 'navigate' || mode === 'directions' || mode === 'search') return null;

  const handleTab = (tab: NavTab) => {
    setActiveTab(tab);
    setMode('explore');
    setSheetSnap('peek');
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 bg-white flex items-center justify-around"
      style={{
        height: '80px',
        boxShadow: '0 -1px 0 rgba(0,0,0,.05)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px]"
          >
            <div 
              className={`flex items-center justify-center w-16 h-8 rounded-full transition-colors ${
                isActive ? 'bg-[#C2E7FF] text-[#001D35]' : 'text-[#444746]'
              }`}
            >
              {isActive ? tab.activeIcon : tab.icon}
            </div>
            <span
              className={`text-[12px] font-medium transition-colors ${
                isActive ? 'text-[#1F1F1F]' : 'text-[#444746]'
              }`}
              style={{ fontFamily: 'Google Sans, Roboto, sans-serif' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
