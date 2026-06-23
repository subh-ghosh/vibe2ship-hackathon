import { Navigation, Bookmark, Share2, MoreHorizontal, X, Calendar, ChevronDown } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export default function PlaceDetail() {
  const { selectedPlace, setMode, setSheetSnap, setDestination, mode } = useMapStore();

  if (!selectedPlace || mode !== 'place') return null;

  const handleDirections = () => {
    setDestination({ label: selectedPlace.name, latlng: { lat: selectedPlace.lat, lng: selectedPlace.lng } });
    setMode('directions');
    setSheetSnap('full');
  };

  const closePlace = () => {
    setMode('explore');
    setSheetSnap('peek');
  };

  return (
    <div className="h-full bg-white flex flex-col pt-1">
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[26px] text-[#1F1F1F]" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {selectedPlace.name}
            </h2>
            <div className="text-[14px] text-[#5F6368] mt-0.5" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {selectedPlace.name === 'Bengaluru' ? 'ಬೆಂಗಳೂರು' : selectedPlace.name}
            </div>
            <div className="text-[14px] text-[#5F6368] mt-0.5">
              {selectedPlace.name === 'Bengaluru' ? 'Karnataka' : selectedPlace.category}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-[#F1F3F4] flex items-center justify-center text-[#1F1F1F]">
              <Bookmark size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#F1F3F4] flex items-center justify-center text-[#1F1F1F]">
              <Share2 size={20} />
            </button>
            <button onClick={closePlace} className="w-10 h-10 rounded-full bg-[#F1F3F4] flex items-center justify-center text-[#1F1F1F]">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button 
            onClick={handleDirections}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B57D0] text-white rounded-full font-medium text-sm flex-shrink-0"
          >
            <Navigation size={18} fill="currentColor" />
            Directions
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E8F0FE] text-[#0B57D0] rounded-full font-medium text-sm flex-shrink-0">
            <Bookmark size={18} />
            Save
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E8F0FE] text-[#0B57D0] rounded-full font-medium text-sm flex-shrink-0">
            <Share2 size={18} />
            Share
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E8F0FE] text-[#0B57D0] rounded-full font-medium text-sm flex-shrink-0">
            <MoreHorizontal size={18} />
            More
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="px-5 pb-4 flex gap-2 h-64">
        <div className="flex-1 rounded-l-[24px] overflow-hidden bg-[#E3E3E3] relative">
           <img 
              src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80" 
              alt="Main"
              className="w-full h-full object-cover"
           />
        </div>
        <div className="w-[120px] flex flex-col gap-2">
          <div className="flex-1 rounded-tr-[24px] overflow-hidden bg-[#E3E3E3]">
            <img 
              src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80" 
              alt="Top"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 rounded-br-[24px] overflow-hidden bg-[#E3E3E3]">
            <img 
              src="https://images.unsplash.com/photo-1623134167190-272e811c7fa1?auto=format&fit=crop&w=400&q=80" 
              alt="Bottom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Info Cards Container */}
      <div className="flex-1 bg-[#F8F9FA] px-5 py-4 flex flex-col gap-3">
        
        {/* Description Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm">
          <p className="text-[15px] text-[#444746] leading-relaxed">
            {selectedPlace.name === 'Bengaluru' ? 
              "Bengaluru (also called Bangalore) is the capital of India's southern Karnataka state. The center of India's high-tech industry, the city is also kno..." : 
              `${selectedPlace.name} is a renowned ${selectedPlace.category.toLowerCase()} location.`}
          </p>
        </div>

        {/* When to visit Card */}
        {selectedPlace.name === 'Bengaluru' && (
          <div className="bg-white rounded-[24px] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-[#1F1F1F]" />
                <span className="text-[16px] font-medium text-[#1F1F1F]">When to visit</span>
              </div>
              <ChevronDown size={20} className="text-[#5F6368]" />
            </div>
            
            <div className="ml-8">
              <div className="text-[14px]">
                <span className="text-[#146C2E] font-medium">Peak season</span>
                <span className="text-[#444746]"> · Dec - Mar</span>
              </div>
              <div className="text-[14px] text-[#444746] mt-0.5">
                Most popular and higher prices
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
