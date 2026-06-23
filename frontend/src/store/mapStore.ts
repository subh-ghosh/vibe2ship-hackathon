import { create } from 'zustand';
import type { Place, AppMode, NavTab, MapType, TransportMode, Route, RouteStep, CivicIssue, LatLng } from '../types';

interface MapStore {
  // Map state
  center: LatLng;
  zoom: number;
  mapType: MapType;
  setCenter: (c: LatLng) => void;
  setZoom: (z: number) => void;
  setMapType: (t: MapType) => void;

  // App mode
  mode: AppMode;
  setMode: (m: AppMode) => void;

  // Bottom nav
  activeTab: NavTab;
  setActiveTab: (t: NavTab) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchFocused: boolean;
  setSearchFocused: (f: boolean) => void;

  // Selected place
  selectedPlace: Place | null;
  setSelectedPlace: (p: Place | null) => void;

  // Directions
  origin: { label: string; latlng: LatLng } | null;
  destination: { label: string; latlng: LatLng } | null;
  setOrigin: (o: MapStore['origin']) => void;
  setDestination: (d: MapStore['destination']) => void;
  transportMode: TransportMode;
  setTransportMode: (m: TransportMode) => void;
  routes: Route[];
  setRoutes: (r: Route[]) => void;
  activeRoute: Route | null;
  setActiveRoute: (r: Route | null) => void;
  routeSteps: RouteStep[];
  setRouteSteps: (s: RouteStep[]) => void;

  // Navigation
  navigating: boolean;
  setNavigating: (n: boolean) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (i: number) => void;
  userLocation: LatLng | null;
  setUserLocation: (l: LatLng | null) => void;

  // Layers
  showTraffic: boolean;
  setShowTraffic: (v: boolean) => void;
  showCivicLayer: boolean;
  setShowCivicLayer: (v: boolean) => void;
  showSatellite: boolean;
  setShowSatellite: (v: boolean) => void;

  // Civic
  civicIssues: CivicIssue[];
  setCivicIssues: (issues: CivicIssue[]) => void;

  // Bottom sheet
  sheetSnap: 'peek' | 'half' | 'full';
  setSheetSnap: (s: MapStore['sheetSnap']) => void;

  // User
  userAvatar: string;
}

export const useMapStore = create<MapStore>((set) => ({
  center: { lat: 12.9716, lng: 77.5946 },
  zoom: 13,
  mapType: 'standard',
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setMapType: (mapType) => set({ mapType }),

  mode: 'explore',
  setMode: (mode) => set({ mode }),

  activeTab: 'explore',
  setActiveTab: (activeTab) => set({ activeTab }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  searchFocused: false,
  setSearchFocused: (searchFocused) => set({ searchFocused }),

  selectedPlace: null,
  setSelectedPlace: (selectedPlace) => set({ selectedPlace }),

  origin: null,
  destination: null,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  transportMode: 'driving',
  setTransportMode: (transportMode) => set({ transportMode }),
  routes: [],
  setRoutes: (routes) => set({ routes }),
  activeRoute: null,
  setActiveRoute: (activeRoute) => set({ activeRoute }),
  routeSteps: [],
  setRouteSteps: (routeSteps) => set({ routeSteps }),

  navigating: false,
  setNavigating: (navigating) => set({ navigating }),
  currentStepIndex: 0,
  setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),
  userLocation: null,
  setUserLocation: (userLocation) => set({ userLocation }),

  showTraffic: false,
  setShowTraffic: (showTraffic) => set({ showTraffic }),
  showCivicLayer: false,
  setShowCivicLayer: (showCivicLayer) => set({ showCivicLayer }),
  showSatellite: false,
  setShowSatellite: (showSatellite) => set({ showSatellite }),

  civicIssues: [],
  setCivicIssues: (civicIssues) => set({ civicIssues }),

  sheetSnap: 'peek',
  setSheetSnap: (sheetSnap) => set({ sheetSnap }),

  userAvatar: 'https://ui-avatars.com/api/?name=User&background=1A73E8&color=fff&rounded=true',
}));
