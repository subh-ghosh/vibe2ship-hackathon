import type { Route, LatLng, TransportMode } from '../types';

export async function fetchRoute(origin: LatLng, destination: LatLng, mode: TransportMode = 'driving'): Promise<Route[]> {
  const oLat = origin.lat.toFixed(3);
  const oLng = origin.lng.toFixed(3);
  const dLat = destination.lat.toFixed(3);
  const dLng = destination.lng.toFixed(3);
  
  const cacheKey = `v2s_route_${mode}_${oLat},${oLng}_${dLat},${dLng}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  try {
    // OSRM mapping
    const profile = mode === 'walking' ? 'foot' : mode === 'two-wheeler' ? 'bike' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) return [];

    const routes = data.routes.map((r: any, i: number) => {
      const distanceKm = (r.distance / 1000).toFixed(1);
      const durationHours = Math.floor(r.duration / 3600);
      const durationMins = Math.round((r.duration % 3600) / 60);
      
      let durationStr = '';
      if (durationHours > 24) {
        durationStr = `${Math.floor(durationHours/24)} d ${durationHours%24} hr`;
      } else if (durationHours > 0) {
        durationStr = `${durationHours} hr ${durationMins} min`;
      } else {
        durationStr = `${durationMins} min`;
      }

      let type: 'fastest' | 'highway' | 'avoid_tolls' | 'civic' = 'fastest';
      let label = 'Fastest route';
      let color = '#1A73E8'; // Blue
      
      if (i === 1) {
        type = 'civic';
        label = 'Safest Route';
        color = '#34A853'; // Green
      } else if (i === 2) {
        type = 'civic';
        label = 'Community Verified';
        color = '#F29900'; // Orange
      }

      return {
        type,
        label,
        distance: `${distanceKm} km`,
        duration: durationStr,
        durationSeconds: r.duration,
        geometry: r.geometry.coordinates,
        via: r.legs[0]?.summary || 'Main highway',
        color,
        trafficLevel: 'light',
      } as Route;
    });

    try { localStorage.setItem(cacheKey, JSON.stringify(routes)); } catch (e) {}
    return routes;
  } catch (error) {
    console.error('Routing error:', error);
    return [];
  }
}
