export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  address: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  hours?: string;
  isOpen?: boolean;
  priceLevel?: number; // 1-4
  photos?: string[];
  distance?: string;
  duration?: string;
  tags?: string[];
  civicScore?: number;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  sublabel: string;
  lat: number;
  lng: number;
  type: 'place' | 'address' | 'route' | 'recent';
  icon: string;
}

export interface Route {
  type: 'fastest' | 'highway' | 'avoid_tolls' | 'civic';
  label: string;
  distance: string;
  duration: string;
  durationSeconds: number;
  geometry: [number, number][]; // [lng, lat]
  via: string;
  color: string;
  trafficLevel: 'light' | 'moderate' | 'heavy';
  civicScore?: number;
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  direction: 'straight' | 'left' | 'right' | 'slight-left' | 'slight-right' | 'u-turn' | 'arrive';
  streetName: string;
}

export interface CivicIssue {
  id: string;
  type: 'pothole' | 'garbage' | 'water_leakage' | 'streetlight' | 'flooding' | 'road_damage' | 'construction' | 'manhole';
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  reportedAt: Date;
  verifications: number;
}

export type AppMode = 'explore' | 'search' | 'place' | 'directions' | 'navigate' | 'layers';
export type NavTab = 'explore' | 'go' | 'saved' | 'contribute' | 'updates';
export type MapType = 'standard' | 'satellite' | 'terrain';
export type TransportMode = 'driving' | 'walking' | 'transit' | 'cycling' | 'two-wheeler';
