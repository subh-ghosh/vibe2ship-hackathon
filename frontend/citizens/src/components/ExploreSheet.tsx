import { useEffect, useState } from 'react';
import { Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { fetchWeather, reverseGeocodeCity, fetchNearbyPlaces, type NearbyPlace, type WeatherData } from '../services/overpass';

export default function ExploreSheet() {
  const dragScrollProps = useDraggableScroll<HTMLDivElement>();
  const { mode, center, exploreCenter, setSelectedPlace, setMode, setSheetSnap, setCenter, setZoom } = useMapStore();

  const [cityName, setCityName] = useState<string>('This area');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialCenter] = useState(center);

  useEffect(() => {
    if (mode !== 'explore') return;
    setLoading(true);

    const targetCenter = exploreCenter || initialCenter;

    Promise.all([
      reverseGeocodeCity(targetCenter.lat, targetCenter.lng),
      fetchWeather(targetCenter.lat, targetCenter.lng),
      fetchNearbyPlaces(targetCenter.lat, targetCenter.lng, 2000),
    ]).then(([city, w, places]) => {
      setCityName(city);
      setWeather(w);
      setNearbyPlaces(places.slice(0, 10));
      setLoading(false);
    });
  }, [exploreCenter?.lat, exploreCenter?.lng, initialCenter.lat, initialCenter.lng, mode]);

  const handlePlaceClick = (place: NearbyPlace) => {
    setSelectedPlace({
      id: place.id, name: place.name, category: place.category,
      categoryIcon: place.categoryIcon, lat: place.lat, lng: place.lng,
      address: place.address, rating: 0, reviewCount: 0,
      isOpen: false, hours: place.hours || '', tags: place.tags || [],
    });
    setCenter({ lat: place.lat, lng: place.lng });
    setZoom(17);
    setMode('place');
    setSheetSnap('half');
  };

  if (mode !== 'explore') return null;

  return (
    <div className="bg-white min-h-[500px]">
      {/* Header */}
      <div className="px-5 py-2 flex items-center justify-between">
        <h2 className="text-[22px] font-normal text-[#1F1F1F]" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          {loading ? <span className="inline-block w-32 h-6 bg-[#F1F3F4] rounded animate-pulse" /> : cityName}
        </h2>

        {/* Live weather */}
        <div className="flex flex-col items-end">
          {weather ? (
            <>
              <div className="flex items-center gap-1.5 text-[#444746]">
                <span className="text-lg">{weather.icon}</span>
                <span className="text-[14px] font-medium">{weather.temp}°C</span>
              </div>
              <div className="text-[11px] text-[#5F6368] mt-0.5">{weather.condition}</div>
            </>
          ) : (
            <div className="w-16 h-8 bg-[#F1F3F4] rounded animate-pulse" />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 mt-1">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => {
              setMode('report');
              setSheetSnap('half');
            }}
            className="flex-[2] bg-[#1A73E8] text-white py-2.5 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <span className="text-xl leading-none">+</span> Report Civic Issue
          </button>
          <button className="flex-1 bg-[#F1F3F4] text-[#1F1F1F] py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Bookmark size={18} /> Save
          </button>
          <button
            onClick={() => {
              const url = `https://maps.google.com/?q=${center.lat},${center.lng}`;
              if (navigator.share) navigator.share({ title: cityName, url });
              else navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
            }}
            className="flex-1 bg-[#F1F3F4] text-[#1F1F1F] py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Share2 size={18} /> Share
          </button>
        </div>

        <h3 className="text-[16px] font-medium text-[#1F1F1F] mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
          {loading ? 'Loading nearby…' : `Nearby in ${cityName}`}
        </h3>

        {/* Nearby places scroll */}
        <div
          {...dragScrollProps}
          className="flex gap-3 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', ...dragScrollProps.style }}
        >
          {loading
            ? [1, 2, 3].map(i => (
                <div key={i} className="w-40 h-48 bg-[#F1F3F4] rounded-xl flex-shrink-0 animate-pulse" />
              ))
            : nearbyPlaces.map(place => (
                <button
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  className="w-40 flex-shrink-0 rounded-xl overflow-hidden text-left bg-[#F8F9FA] border border-[#E8EAED] hover:border-[#DADCE0] active:scale-95 transition-all"
                >
                  <div className="w-full h-28 bg-gradient-to-br from-[#E8F0FE] to-[#D2E3FC] flex items-center justify-center text-4xl">
                    {place.categoryIcon}
                  </div>
                  <div className="p-2.5">
                    <div className="text-[12px] font-medium text-[#1F1F1F] truncate">{place.name}</div>
                    <div className="text-[11px] text-[#5F6368] truncate mt-0.5">{place.category}</div>
                    {place.hours && (
                      <div className="text-[10px] text-[#146C2E] mt-0.5 truncate">{place.hours.substring(0, 20)}</div>
                    )}
                  </div>
                </button>
              ))
          }

          {!loading && nearbyPlaces.length === 0 && (
            <div className="text-[13px] text-[#5F6368] py-4">No places found nearby</div>
          )}
        </div>
      </div>
    </div>
  );
}
