import type { SearchSuggestion } from '../types';
import { PLACES, RECENT_SEARCHES } from '../data/places';

export async function searchPlaces(query: string): Promise<SearchSuggestion[]> {
  if (!query.trim()) return RECENT_SEARCHES.map(r => ({ ...r, type: 'recent' as const }));

  // Local match first
  const localMatches = PLACES.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.address.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  ).map(p => ({
    id: p.id,
    label: p.name,
    sublabel: p.address,
    lat: p.lat,
    lng: p.lng,
    type: 'place' as const,
    icon: p.categoryIcon,
  }));

  if (localMatches.length >= 3) return localMatches.slice(0, 6);

  // Fallback to Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' Bengaluru')}&format=json&limit=5&addressdetails=1`,
      { headers: { 'User-Agent': 'CivicOS/1.0' } }
    );
    const data = await res.json();
    const nominatimResults: SearchSuggestion[] = data.map((item: Record<string, unknown>, i: number) => ({
      id: `nom-${i}`,
      label: (item.name as string) || (item.display_name as string).split(',')[0],
      sublabel: (item.display_name as string).split(',').slice(1, 3).join(',').trim(),
      lat: parseFloat(item.lat as string),
      lng: parseFloat(item.lon as string),
      type: 'address' as const,
      icon: '📍',
    }));
    return [...localMatches, ...nominatimResults].slice(0, 6);
  } catch {
    return localMatches.slice(0, 6);
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'CivicOS/1.0' } }
    );
    const data = await res.json();
    const addr = data.address;
    return addr.road || addr.suburb || addr.city || 'Unknown location';
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
