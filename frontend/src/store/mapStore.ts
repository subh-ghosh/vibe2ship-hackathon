import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Place, AppMode, NavTab, LatLng } from '../types';

interface MapStore {
  center: LatLng;
  zoom: number;
  setCenter: (c: LatLng) => void;
  setZoom: (z: number) => void;

  // App mode
  mode: AppMode;
  setMode: (m: AppMode) => void;

  exploreCenter: LatLng | null;
  setExploreCenter: (c: LatLng | null) => void;

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

  userLocation: LatLng | null;
  setUserLocation: (l: LatLng | null) => void;

  // Bottom sheet
  sheetSnap: 'peek' | 'half' | 'full';
  setSheetSnap: (s: MapStore['sheetSnap']) => void;

  // Routing
  transportMode: import('../types').TransportMode;
  setTransportMode: (m: import('../types').TransportMode) => void;
  routes: import('../types').Route[];
  setRoutes: (r: import('../types').Route[]) => void;
  selectedRouteIndex: number;
  setSelectedRouteIndex: (i: number) => void;

  // User
  userAvatar: string;
}

export const useMapStore = create<MapStore>()(
  persist(
    (set) => ({
      center: { lat: 12.9716, lng: 77.5946 }, // Bangalore default
      zoom: 13,
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),

      mode: 'explore',
      setMode: (mode) => set({ mode }),

      exploreCenter: null,
      setExploreCenter: (exploreCenter) => set({ exploreCenter }),

      activeTab: 'explore',
      setActiveTab: (activeTab) => set({ activeTab }),

      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      searchFocused: false,
      setSearchFocused: (searchFocused) => set({ searchFocused }),

      selectedPlace: null,
      setSelectedPlace: (selectedPlace) => set({ selectedPlace }),

      userLocation: null,
      setUserLocation: (userLocation) => set({ userLocation }),

      sheetSnap: 'peek',
      setSheetSnap: (sheetSnap) => set({ sheetSnap }),

      transportMode: 'driving',
      setTransportMode: (transportMode) => set({ transportMode }),
      routes: [],
      setRoutes: (routes) => set({ routes }),
      selectedRouteIndex: 0,
      setSelectedRouteIndex: (selectedRouteIndex) => set({ selectedRouteIndex }),

      userAvatar: '/cnlogo-32511.png',
    }),
    {
      name: 'vibe2ship-map-storage',
      // Only persist map position and user location
      partialize: (state) => ({ 
        center: state.center, 
        zoom: state.zoom,
        userLocation: state.userLocation
      }),
    }
  )
);
