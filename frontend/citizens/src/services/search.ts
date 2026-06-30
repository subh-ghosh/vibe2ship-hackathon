import type { SearchSuggestion } from '../types';

// Ola Maps API Key for Vibe2Ship Hackathon
const OLA_API_KEY = '0PkEOtnt9dbWTDNnxmLct8KW1mxPvCy3aJ02wBf9';
const OLA_AUTOCOMPLETE = 'https://api.olamaps.io/places/v1/autocomplete';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

export async function searchPlaces(query: string, lat?: number, lng?: number): Promise<SearchSuggestion[]> {
  if (!query || query.trim().length < 2) return [];

  const qLat = lat ? lat.toFixed(1) : '';
  const qLng = lng ? lng.toFixed(1) : '';
  const cacheKey = `v2s_search_${query.toLowerCase()}_${qLat}_${qLng}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  try {
    const location = lat && lng ? `&location=${lat},${lng}` : '';
    const url = `${OLA_AUTOCOMPLETE}?input=${encodeURIComponent(query)}${location}&api_key=${OLA_API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();

    const suggestions: SearchSuggestion[] = (data.predictions || []).map((item: any, i: number) => {
      // Map Ola types to an icon
      let icon = '📍';
      const types = item.types || [];
      if (types.includes('restaurant') || types.includes('food') || types.includes('cafe')) {
        icon = types.includes('cafe') ? '☕' : '🍽️';
      } else if (types.includes('park') || types.includes('garden')) {
        icon = '🌳';
      } else if (types.includes('hospital') || types.includes('clinic')) {
        icon = '🏥';
      } else if (types.includes('bank') || types.includes('atm')) {
        icon = '🏧';
      } else if (types.includes('hotel') || types.includes('lodging')) {
        icon = '🏨';
      } else if (types.includes('store') || types.includes('grocery_or_supermarket')) {
        icon = '🛒';
      }

      return {
        id: item.place_id || `ola-${i}`,
        label: item.structured_formatting?.main_text || item.description?.split(',')[0] || query,
        sublabel: item.structured_formatting?.secondary_text || item.description || '',
        lat: item.geometry?.location?.lat,
        lng: item.geometry?.location?.lng,
        type: 'place' as const,
        icon,
      };
    });

    if (lat && lng) {
      suggestions.sort((a, b) => {
        if (!a.lat || !a.lng || !b.lat || !b.lng) return 0;
        const distA = calculateDistance(lat, lng, a.lat, a.lng);
        const distB = calculateDistance(lat, lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    try { localStorage.setItem(cacheKey, JSON.stringify(suggestions)); } catch (e) {}
    return suggestions;
  } catch {
    console.warn('Search API failed, providing mock result');
    return [{
      id: 'mock-place',
      label: 'Demo Location (Offline)',
      sublabel: 'MG Road, Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      type: 'place',
      icon: '📍',
    }];
  }
}

// Keeping a stub to avoid breaking external dependencies if they still import it,
// but Ola Maps returns lat/lng directly in the autocomplete response!
export async function resolveArcGISPlace(magicKey: string): Promise<{ lat: number, lng: number } | null> {
  return null;
}

// Reverse geocode using Ola Maps — returns a clean, precise street-level address
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const cacheKey = `v2s_revgeo_${lat.toFixed(4)}_${lng.toFixed(4)}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  try {
    const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${OLA_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      const addressParts = data.results[0].formatted_address.split(', ');
      // Take first 3 parts to keep it readable and concise, e.g., "Lots Hospital, Chatterjee Lane, Tiretta Bazaar"
      const result = addressParts.slice(0, 3).join(', ');
      try { localStorage.setItem(cacheKey, result); } catch (e) {}
      return result;
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
