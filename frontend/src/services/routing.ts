import type { Route, LatLng, TransportMode } from '../types';

export async function fetchRoute(origin: LatLng, destination: LatLng, mode: TransportMode = 'driving'): Promise<Route[]> {
  try {
    // OSRM mapping
    const profile = mode === 'walking' ? 'foot' : mode === 'two-wheeler' ? 'bike' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) return [];

    return data.routes.map((r: any, i: number) => {
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

      return {
        type: i === 0 ? 'fastest' : 'alternative',
        label: i === 0 ? 'Fastest route' : 'Alternative route',
        distance: `${distanceKm} km`,
        duration: durationStr,
        durationSeconds: r.duration,
        geometry: r.geometry.coordinates,
        via: r.legs[0]?.summary || 'Main highway',
        color: i === 0 ? '#1A73E8' : '#8AB4F8',
        trafficLevel: 'light',
      } as Route;
    });
  } catch (error) {
    console.error('Routing error:', error);
    return [];
  }
}
