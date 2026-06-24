import type { SearchSuggestion } from '../types';

// Ola Maps API Key for Vibe2Ship Hackathon
const OLA_API_KEY = '0PkEOtnt9dbWTDNnxmLct8KW1mxPvCy3aJ02wBf9';
const OLA_AUTOCOMPLETE = 'https://api.olamaps.io/places/v1/autocomplete';

export async function searchPlaces(query: string, lat?: number, lng?: number): Promise<SearchSuggestion[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const location = lat && lng ? `&location=${lat},${lng}` : '';
    const url = `${OLA_AUTOCOMPLETE}?input=${encodeURIComponent(query)}${location}&api_key=${OLA_API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();

    return (data.predictions || []).map((item: any, i: number) => {
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
  } catch {
    return [];
  }
}

// Keeping a stub to avoid breaking external dependencies if they still import it,
// but Ola Maps returns lat/lng directly in the autocomplete response!
export async function resolveArcGISPlace(magicKey: string): Promise<{ lat: number, lng: number } | null> {
  return null;
}

// Reverse geocode using Ola Maps — returns a clean, precise street-level address
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${OLA_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      const addressParts = data.results[0].formatted_address.split(', ');
      // Take first 3 parts to keep it readable and concise, e.g., "Lots Hospital, Chatterjee Lane, Tiretta Bazaar"
      return addressParts.slice(0, 3).join(', ');
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
