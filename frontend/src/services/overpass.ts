// Fetch nearby POIs from Overpass API based on map center
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  lat: number;
  lng: number;
  address: string;
  rating?: number;
  isOpen?: boolean;
  hours?: string;
  phone?: string;
  website?: string;
  tags?: string[];
  photos?: string[];
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  restaurant: '🍽️', cafe: '☕', bar: '🍺', fast_food: '🍟', food_court: '🍽️',
  hotel: '🏨', hostel: '🏨', guest_house: '🏨',
  hospital: '🏥', clinic: '🏥', pharmacy: '💊', doctors: '🩺',
  school: '🏫', university: '🎓', college: '🎓',
  bank: '🏦', atm: '🏧',
  fuel: '⛽', parking: '🅿️',
  supermarket: '🛒', mall: '🛍️', shop: '🏪', marketplace: '🏪',
  department_store: '🛍️', convenience: '🏪', clothes: '👗', bakery: '🥐',
  park: '🌳', garden: '🌺',
  museum: '🏛️', attraction: '🎡', zoo: '🦁', cinema: '🎬', viewpoint: '👁️',
  // Indian-specific
  place_of_worship: '🛕', temple: '🛕', mosque: '🕌', church: '⛪', 
  gurudwara: '🕍', shrine: '🛕', monastery: '⛩️',
  bus_station: '🚌', bus_stop: '🚌', train_station: '🚂', airport: '✈️', metro_station: '🚇',
  police: '🚔', fire_station: '🚒', post_office: '📮',
  stadium: '🏟️', sports_centre: '🏋️', community_centre: '🏛️', library: '📚',
};

function guessIcon(tags: Record<string, string>): string {
  if (tags.amenity) return CATEGORY_ICON_MAP[tags.amenity] || '📍';
  if (tags.shop) return CATEGORY_ICON_MAP['shop'] || '🏪';
  if (tags.leisure === 'park') return '🌳';
  if (tags.tourism) return CATEGORY_ICON_MAP[tags.tourism] || '🎡';
  if (tags.railway) return CATEGORY_ICON_MAP['train_station'] || '🚂';
  if (tags.aeroway) return '✈️';
  return '📍';
}

function guessCategory(tags: Record<string, string>): string {
  const a = tags.amenity || tags.shop || tags.leisure || tags.tourism;
  if (!a) return 'Place';
  return a.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export async function fetchNearbyPlaces(lat: number, lng: number, radius = 1500): Promise<NearbyPlace[]> {
  const query = `
    [out:json][timeout:12];
    (
      node(around:${radius},${lat},${lng})[name][amenity~"restaurant|cafe|bar|fast_food|food_court|hospital|clinic|pharmacy|bank|atm|fuel|hotel|place_of_worship|cinema|library|school|university|police|fire_station|post_office|bus_station|college|marketplace|community_centre"];
      node(around:${radius},${lat},${lng})[name][shop~"supermarket|mall|department_store|convenience|clothes|electronics|jewelry|bakery"];
      node(around:${radius},${lat},${lng})[name][tourism~"attraction|museum|zoo|theme_park|hotel|guest_house|viewpoint"];
      node(around:${radius},${lat},${lng})[name][leisure~"park|garden|stadium|sports_centre"];
      node(around:${radius},${lat},${lng})[name][railway~"station|halt"];
      node(around:${radius},${lat},${lng})[name][aeroway~"terminal|aerodrome"];
      node(around:${radius},${lat},${lng})[name]["amenity"="place_of_worship"];
    );
    out tags center 50;
  `;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const json = await res.json();
    const elements: any[] = json.elements || [];
    
    // Sort by distance
    elements.sort((a, b) => {
      const distA = calculateDistance(lat, lng, a.lat || a.center?.lat, a.lon || a.center?.lon);
      const distB = calculateDistance(lat, lng, b.lat || b.center?.lat, b.lon || b.center?.lon);
      return distA - distB;
    });

    return elements
      .filter(e => e.tags?.name && (e.lat || e.center?.lat) && (e.lon || e.center?.lon))
      .slice(0, 30)
      .map((e, i) => ({
        id: `osm-${e.id || i}`,
        name: e.tags.name,
        category: guessCategory(e.tags),
        categoryIcon: guessIcon(e.tags),
        lat: e.lat || e.center?.lat,
        lng: e.lon || e.center?.lon,
        address: [e.tags['addr:street'], e.tags['addr:city']].filter(Boolean).join(', ') || '',
        hours: e.tags.opening_hours,
        phone: e.tags.phone || e.tags['contact:phone'],
        website: e.tags.website || e.tags['contact:website'],
        tags: [e.tags.amenity, e.tags.cuisine, e.tags.shop].filter(Boolean),
        photos: [],
      }));
  } catch {
    return [];
  }
}

// Mock fetch place details to speed up the app instantly
export async function fetchPlaceDetails(lat: number, lng: number): Promise<Partial<NearbyPlace>> {
  return new Promise((resolve) => setTimeout(() => resolve({
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Random 3.0 - 5.0 rating
    hours: '10:00 AM - 10:00 PM',
    phone: '+91 800 123 4567',
    isOpen: true,
  }), 100));
}


// Fetch Wikipedia extract and real image
export async function fetchWikipediaData(title: string): Promise<{ extract: string | null, image: string | null }> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    const json = await res.json();
    return {
      extract: json.extract || null,
      image: json.originalimage?.source || json.thumbnail?.source || null
    };
  } catch { return { extract: null, image: null }; }
}

// Real weather via Open-Meteo (free, no key)
export interface WeatherData { temp: number; condition: string; icon: string; }
export async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&temperature_unit=celsius`
    );
    const json = await res.json();
    const code: number = json.current?.weathercode ?? 0;
    const temp: number = Math.round(json.current?.temperature_2m ?? 0);
    const conditions: Record<number, { condition: string; icon: string }> = {
      0: { condition: 'Clear', icon: '☀️' }, 1: { condition: 'Mostly clear', icon: '🌤️' },
      2: { condition: 'Partly cloudy', icon: '⛅' }, 3: { condition: 'Overcast', icon: '☁️' },
      45: { condition: 'Foggy', icon: '🌫️' }, 51: { condition: 'Drizzle', icon: '🌦️' },
      61: { condition: 'Rain', icon: '🌧️' }, 71: { condition: 'Snow', icon: '❄️' },
      80: { condition: 'Showers', icon: '🌧️' }, 95: { condition: 'Thunderstorm', icon: '⛈️' },
    };
    const w = conditions[code] || conditions[0];
    return { temp, ...w };
  } catch { return null; }
}

// Reverse geocode to get city name
export async function reverseGeocodeCity(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'MapsApp/1.0' } }
    );
    const data = await res.json();
    const a = data.address;
    return a.city || a.town || a.village || a.county || a.state || 'This area';
  } catch { return 'This area'; }
}
