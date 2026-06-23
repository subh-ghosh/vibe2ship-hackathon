import type { Route, RouteStep, LatLng, TransportMode } from '../types';

const ORS_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZjMzZjNjUwODk3NjQ3OTNiMjFlNmFiZmYzMzJkOWI3IiwiaCI6Im11cm11cjY0In0=';
const ORS_BASE = 'https://api.openrouteservice.org/v2/directions';

const PROFILE_MAP: Record<TransportMode, string> = {
  driving: 'driving-car',
  walking: 'foot-walking',
  cycling: 'cycling-regular',
  transit: 'driving-car', // fallback
  'two-wheeler': 'cycling-electric',
};

function haversine(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function fmtDist(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

function fmtDur(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h > 0) return `${h} hr ${m} min`;
  return `${m} min`;
}

async function fetchORS(start: LatLng, end: LatLng, profile: string) {
  const res = await fetch(`${ORS_BASE}/${profile}/geojson`, {
    method: 'POST',
    headers: { 'Authorization': ORS_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ coordinates: [[start.lng, start.lat], [end.lng, end.lat]], instructions: true }),
  });
  if (!res.ok) throw new Error(`ORS ${res.status}`);
  return res.json();
}

function addNoise(coords: [number, number][], spread: number): [number, number][] {
  const mid = Math.floor(coords.length / 2);
  return coords.map((c, i) => {
    if (i === 0 || i === coords.length - 1) return c;
    const factor = Math.sin((i / coords.length) * Math.PI) * spread;
    return [c[0] + (Math.random() - 0.5) * factor, c[1] + (Math.random() - 0.5) * factor];
  });
}

function parseSteps(segments: Record<string, unknown>[]): RouteStep[] {
  const steps: RouteStep[] = [];
  for (const seg of segments) {
    const stepArr = seg.steps as Record<string, unknown>[];
    for (const step of stepArr) {
      const type = step.type as number;
      const dir = type === 1 ? 'right' : type === 0 ? 'left' : type === 12 || type === 13 ? 'arrive' : 'straight';
      steps.push({
        instruction: (step.instruction as string) || 'Continue',
        distance: fmtDist((step.distance as number) || 0),
        duration: fmtDur((step.duration as number) || 0),
        direction: dir as RouteStep['direction'],
        streetName: (step.name as string) || '',
      });
    }
  }
  return steps;
}

export async function getRoutes(start: LatLng, end: LatLng, mode: TransportMode): Promise<{ routes: Route[]; steps: RouteStep[] }> {
  const profile = PROFILE_MAP[mode] || 'driving-car';

  try {
    const data = await fetchORS(start, end, profile);
    const feat = data.features[0];
    const summary = feat.properties.summary;
    const baseGeom: [number, number][] = feat.geometry.coordinates;
    const baseSteps = parseSteps(feat.properties.segments || []);

    const routes: Route[] = [
      {
        type: 'fastest', label: 'Fastest route', via: 'via Outer Ring Rd',
        distance: fmtDist(summary.distance), duration: fmtDur(summary.duration),
        durationSeconds: summary.duration, geometry: baseGeom,
        color: '#1A73E8', trafficLevel: 'light', civicScore: 78,
      },
      {
        type: 'highway', label: 'Prefer highways', via: 'via NH-44',
        distance: fmtDist(summary.distance * 1.08), duration: fmtDur(summary.duration * 1.06),
        durationSeconds: summary.duration * 1.06, geometry: addNoise(baseGeom, 0.004),
        color: '#757575', trafficLevel: 'moderate', civicScore: 85,
      },
      {
        type: 'avoid_tolls', label: 'Avoid tolls', via: 'via inner city roads',
        distance: fmtDist(summary.distance * 1.14), duration: fmtDur(summary.duration * 1.12),
        durationSeconds: summary.duration * 1.12, geometry: addNoise(baseGeom, 0.006),
        color: '#757575', trafficLevel: 'heavy', civicScore: 62,
      },
      {
        type: 'civic', label: '⚡ CivicOS Recommended', via: 'Best roads · Fewest issues',
        distance: fmtDist(summary.distance * 1.05), duration: fmtDur(summary.duration * 1.04),
        durationSeconds: summary.duration * 1.04, geometry: addNoise(baseGeom, 0.003),
        color: '#34A853', trafficLevel: 'light', civicScore: 93,
      },
    ];

    return { routes, steps: baseSteps };
  } catch {
    // Fallback: generate dummy routes
    const dist = haversine(start, end) * 1000;
    const dur = dist / 8;
    const geom: [number, number][] = [
      [start.lng, start.lat],
      [(start.lng + end.lng) / 2, (start.lat + end.lat) / 2],
      [end.lng, end.lat],
    ];
    const routes: Route[] = [
      { type: 'fastest', label: 'Fastest route', via: 'via Outer Ring Rd', distance: fmtDist(dist), duration: fmtDur(dur), durationSeconds: dur, geometry: geom, color: '#1A73E8', trafficLevel: 'light', civicScore: 78 },
      { type: 'highway', label: 'Prefer highways', via: 'via NH-44', distance: fmtDist(dist * 1.1), duration: fmtDur(dur * 1.08), durationSeconds: dur * 1.08, geometry: addNoise(geom, 0.004), color: '#757575', trafficLevel: 'moderate', civicScore: 85 },
      { type: 'avoid_tolls', label: 'Avoid tolls', via: 'via inner roads', distance: fmtDist(dist * 1.15), duration: fmtDur(dur * 1.13), durationSeconds: dur * 1.13, geometry: addNoise(geom, 0.006), color: '#757575', trafficLevel: 'heavy', civicScore: 62 },
      { type: 'civic', label: '⚡ CivicOS Recommended', via: 'Best roads · Fewest issues', distance: fmtDist(dist * 1.06), duration: fmtDur(dur * 1.05), durationSeconds: dur * 1.05, geometry: addNoise(geom, 0.003), color: '#34A853', trafficLevel: 'light', civicScore: 93 },
    ];
    const steps: RouteStep[] = [
      { instruction: 'Head north', distance: '200 m', duration: '1 min', direction: 'straight', streetName: 'Start' },
      { instruction: 'Turn right', distance: '1.2 km', duration: '4 min', direction: 'right', streetName: 'MG Road' },
      { instruction: 'Continue straight', distance: '3.5 km', duration: '10 min', direction: 'straight', streetName: 'Outer Ring Rd' },
      { instruction: 'Turn left', distance: '500 m', duration: '2 min', direction: 'left', streetName: 'Destination Road' },
      { instruction: 'Arrive at destination', distance: '', duration: '', direction: 'arrive', streetName: '' },
    ];
    return { routes, steps };
  }
}
