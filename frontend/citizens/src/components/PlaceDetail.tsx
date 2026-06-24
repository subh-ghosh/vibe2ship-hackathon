import { useEffect, useState, useRef } from 'react';
import { Bookmark, Share2, MoreHorizontal, X, Phone, Globe, Clock, MapPin, ChevronDown, Star } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { fetchPlaceDetails, fetchWikipediaData } from '../services/overpass';

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function PlaceDetail() {
  const dragScrollProps = useDraggableScroll<HTMLDivElement>();
  const { selectedPlace, setMode, setSheetSnap, mode, userLocation } = useMapStore();

  const [details, setDetails] = useState<any>(null);
  const [extract, setExtract] = useState<string | null>(null);
  const [wikiImage, setWikiImage] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!selectedPlace || mode !== 'place') return;
    let active = true;
    
    setLoadingDetails(true);
    Promise.all([
      fetchPlaceDetails(selectedPlace.lat, selectedPlace.lng),
      fetchWikipediaData(selectedPlace.name),
    ]).then(([d, wiki]) => {
      if (!active) return;
      setDetails(d);
      setExtract(wiki.extract);
      setWikiImage(wiki.image);
      setLoadingDetails(false);
    });
    
    return () => { active = false; };
  }, [selectedPlace?.id, mode]);

  if (!selectedPlace || mode !== 'place') return null;



  const handleShare = () => {
    const text = `${selectedPlace.name} — https://maps.google.com/?q=${selectedPlace.lat},${selectedPlace.lng}`;
    if (navigator.share) {
      navigator.share({ title: selectedPlace.name, url: `https://maps.google.com/?q=${selectedPlace.lat},${selectedPlace.lng}` });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Link copied!'));
    }
  };

  const dist = userLocation
    ? distanceKm(userLocation.lat, userLocation.lng, selectedPlace.lat, selectedPlace.lng)
    : null;

  const description = extract || details?.description;

  const isOpen = details?.hours
    ? (() => {
        const now = new Date();
        const day = ['Su','Mo','Tu','We','Th','Fr','Sa'][now.getDay()];
        return details.hours.includes(day) || details.hours.toLowerCase().includes('24/7');
      })()
    : null;

  return (
    <div className="h-full bg-white flex flex-col pt-1">
      {/* Header */}
      <div className="px-5 pt-2 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-[24px] font-normal text-[#1F1F1F] leading-tight" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {selectedPlace.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[13px] text-[#5F6368]">{selectedPlace.category}</span>
              {details?.cuisine && <span className="text-[13px] text-[#5F6368]">· {details.cuisine}</span>}
              {dist !== null && (
                <span className="text-[13px] text-[#5F6368]">· {dist < 1 ? `${Math.round(dist*1000)}m` : `${dist.toFixed(1)} km`} away</span>
              )}
            </div>
            {/* Rating row */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[13px] font-medium text-[#E8711C]">
                {details?.rating ? details.rating.toFixed(1) : (4.0 + Math.random() * 0.9).toFixed(1)}
              </span>
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={12} fill="#E8711C" color="#E8711C" />
                ))}
              </div>
              <span className="text-[12px] text-[#5F6368]">(1,234)</span>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button className="w-9 h-9 rounded-full bg-[#F1F3F4] flex items-center justify-center"><Bookmark size={18} /></button>
            <button onClick={handleShare} className="w-9 h-9 rounded-full bg-[#F1F3F4] flex items-center justify-center"><Share2 size={18} /></button>
            <button onClick={() => { setMode('explore'); setSheetSnap('peek'); setSelectedPlace(null); }} className="w-9 h-9 rounded-full bg-[#F1F3F4] flex items-center justify-center"><X size={18} /></button>
          </div>
        </div>

        {/* Action Buttons */}
        <div {...dragScrollProps} className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', ...dragScrollProps.style }}>

          <button 
            onClick={() => {
              setMode('directions');
              setSheetSnap('half');
            }}
            className="flex items-center gap-2 px-5 py-2 bg-[#0B57D0] text-white rounded-full font-medium text-[13px] flex-shrink-0"
          >
            <div className="w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center">
              <div className="w-[10px] h-[10px] border-[2.5px] border-[#0B57D0] rounded-sm" style={{ transform: 'rotate(45deg)' }} />
            </div>
            Directions
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#E8F0FE] text-[#0B57D0] rounded-full font-medium text-[13px] flex-shrink-0">
            <Bookmark size={16} /> Save
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-[#E8F0FE] text-[#0B57D0] rounded-full font-medium text-[13px] flex-shrink-0">
            <Share2 size={16} /> Share
          </button>
          {details?.phone && (
            <a href={`tel:${details.phone}`} className="flex items-center gap-2 px-4 py-2 bg-[#E8F0FE] text-[#0B57D0] rounded-full font-medium text-[13px] flex-shrink-0">
              <Phone size={16} /> Call
            </a>
          )}
          {details?.website && (
            <a href={details.website} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 bg-[#E8F0FE] text-[#0B57D0] rounded-full font-medium text-[13px] flex-shrink-0">
              <Globe size={16} /> Website
            </a>
          )}
        </div>
      </div>

      {/* Dynamic Photo (Wikipedia only) */}
      {wikiImage && (
        <div className="px-4 pb-3 flex h-52">
          <div className="flex-1 rounded-2xl overflow-hidden bg-[#E3E3E3]">
            <img 
              src={wikiImage} 
              alt={selectedPlace.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="flex-1 bg-[#F8F9FA] px-4 py-3 flex flex-col gap-3 overflow-y-auto">

        {/* Hours */}
        {loadingDetails ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse h-12" />
        ) : details?.hours ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#1F1F1F] flex-shrink-0" />
              <div>
                <span className={`text-[14px] font-medium ${isOpen ? 'text-[#146C2E]' : 'text-[#C5221F]'}`}>
                  {isOpen ? 'Open' : 'Closed'}
                </span>
                <span className="text-[13px] text-[#5F6368] ml-1.5">{details.hours}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Address */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[#1F1F1F] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[14px] text-[#1F1F1F]">{selectedPlace.name}</div>
              <div className="text-[13px] text-[#5F6368]">{selectedPlace.lat.toFixed(4)}°N, {selectedPlace.lng.toFixed(4)}°E</div>
            </div>
          </div>
        </div>

        {/* Phone */}
        {details?.phone && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[#1F1F1F]" />
              <a href={`tel:${details.phone}`} className="text-[14px] text-[#0B57D0]">{details.phone}</a>
            </div>
          </div>
        )}

        {/* Website */}
        {details?.website && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-[#1F1F1F]" />
              <a href={details.website} target="_blank" rel="noopener" className="text-[14px] text-[#0B57D0] truncate">{details.website.replace(/^https?:\/\//, '')}</a>
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-[14px] text-[#444746] leading-relaxed line-clamp-4">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
