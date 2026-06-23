import { useEffect } from 'react';
import MapView from './components/Map';
import SearchBar from './components/SearchBar';
import BottomSheet from './components/BottomSheet';
import BottomNav from './components/BottomNav';
import MapControls from './components/MapControls';
import LayerPicker from './components/LayerPicker';
import ExploreSheet from './components/ExploreSheet';
import PlaceDetail from './components/PlaceDetail';
import DirectionsPanel from './components/DirectionsPanel';
import NavigationMode from './components/NavigationMode';
import { useMapStore } from './store/mapStore';
import { CIVIC_ISSUES } from './data/places';

export default function App() {
  const { setCivicIssues } = useMapStore();

  useEffect(() => {
    // Load initial civic issues
    setCivicIssues(CIVIC_ISSUES);
  }, [setCivicIssues]);

  return (
    <div className="relative w-full h-full bg-[#E8EAED] overflow-hidden select-none">
      {/* Map layer (bottom-most) */}
      <MapView />

      {/* Floating controls */}
      <MapControls />

      {/* UI Overlays */}
      <SearchBar />
      
      {/* Full screen panels */}
      <DirectionsPanel />
      <NavigationMode />
      <LayerPicker />

      {/* Bottom Sheet for Explore/Place details */}
      <BottomSheet>
        <ExploreSheet />
        <PlaceDetail />
      </BottomSheet>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
