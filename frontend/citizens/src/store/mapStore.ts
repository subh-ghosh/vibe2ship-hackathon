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
  userSpeed: number | null;
  setUserSpeed: (s: number | null) => void;

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
  
  showPredictions: boolean;
  setShowPredictions: (b: boolean) => void;

  // Civic Issues
  issues: import('../types').Issue[];
  setIssues: (i: import('../types').Issue[]) => void;
  activeIssue: import('../types').Issue | null;
  setActiveIssue: (i: import('../types').Issue | null) => void;
  fetchIssues: () => Promise<void>;
  createIssue: (issue: Partial<import('../types').Issue>) => Promise<void>;

  // User
  userAvatar: string;
}

const DEFAULT_MOCK_ISSUES: import('../types').Issue[] = [
  {
    id: 'mock-1',
    type: 'pothole',
    lat: 12.9716, lng: 77.5946,
    status: 'verified', severity: 'high',
    upvotes: 24, downvotes: 1,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    description: 'Deep pothole on the left lane.'
  },
  {
    id: 'mock-2',
    type: 'garbage',
    lat: 12.9726, lng: 77.5936,
    status: 'reported', severity: 'low',
    upvotes: 5, downvotes: 0,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    description: 'Trash bins overflowing for 3 days.'
  },
  {
    id: 'mock-3',
    type: 'flooding',
    lat: 12.9706, lng: 77.5956,
    status: 'resolving', severity: 'critical',
    upvotes: 120, downvotes: 2,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    description: 'Waterlogging up to knees, avoid this route.',
    predicted: true
  }
];

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
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

      userSpeed: null,
      setUserSpeed: (userSpeed) => set({ userSpeed }),

      sheetSnap: 'half',
      setSheetSnap: (sheetSnap) => set({ sheetSnap }),

      transportMode: 'driving',
      setTransportMode: (transportMode) => set({ transportMode }),
      routes: [],
      setRoutes: (routes) => set({ routes }),
      selectedRouteIndex: 0,
      setSelectedRouteIndex: (selectedRouteIndex) => set({ selectedRouteIndex }),

      showPredictions: false,
      setShowPredictions: (showPredictions) => set({ showPredictions }),

      issues: DEFAULT_MOCK_ISSUES,
      setIssues: (issues) => set({ issues }),
      activeIssue: null,
      setActiveIssue: (activeIssue) => set({ activeIssue }),
      
      fetchIssues: async () => {
        try {
          const res = await fetch('http://localhost:8080/api/issues?size=10000');
          const data = await res.json();
          if (data && data.content && data.content.length > 0) {
            set({ issues: data.content });
          }
        } catch (e) {
          console.log('Backend offline, using fallback mock issues.');
        }
      },
      
      createIssue: async (issueParams) => {
        try {
          const res = await fetch('http://localhost:8080/api/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueParams)
          });
          const savedIssue = await res.json();
          set({ issues: [savedIssue, ...get().issues] });
        } catch (e) {
          console.log('Backend offline, adding issue to local state only.');
          const localIssue = {
            id: `issue-${Date.now()}`,
            ...issueParams,
            status: 'reported',
            severity: 'medium',
            upvotes: 1,
            downvotes: 0,
            createdAt: new Date().toISOString()
          } as import('../types').Issue;
          set({ issues: [localIssue, ...get().issues] });
        }
      },

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
