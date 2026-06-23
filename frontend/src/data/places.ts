import { Place, CivicIssue } from '../types';

// Bengaluru center
export const CITY_CENTER = { lat: 12.9716, lng: 77.5946 };

// Realistic Bengaluru places
export const PLACES: Place[] = [
  {
    id: 'p1', name: 'Lalbagh Botanical Garden', category: 'Park',
    categoryIcon: '🌳', address: 'Mavalli, Bengaluru, Karnataka 560004',
    rating: 4.6, reviewCount: 42800, lat: 12.9507, lng: 77.5848,
    isOpen: true, hours: 'Open · Closes 7 PM', tags: ['Garden', 'Historic', 'Park'],
    civicScore: 82, photos: [],
  },
  {
    id: 'p2', name: 'Cubbon Park', category: 'Park',
    categoryIcon: '🌳', address: 'Kasturba Rd, Ambedkar Veedhi, Bengaluru',
    rating: 4.5, reviewCount: 38200, lat: 12.9763, lng: 77.5929,
    isOpen: true, hours: 'Open · Closes 6 PM', tags: ['Park', 'Landmark'],
    civicScore: 78,
  },
  {
    id: 'p3', name: 'Vidhana Soudha', category: 'Government building',
    categoryIcon: '🏛️', address: 'Dr Ambedkar Veedhi, Bengaluru 560001',
    rating: 4.4, reviewCount: 22100, lat: 12.9799, lng: 77.5907,
    isOpen: false, hours: 'Closed · Opens 10 AM Mon', tags: ['Landmark', 'Historic'],
    civicScore: 91,
  },
  {
    id: 'p4', name: 'Bangalore Palace', category: 'Tourist attraction',
    categoryIcon: '🏰', address: 'Vasanth Nagar, Bengaluru 560052',
    rating: 4.2, reviewCount: 18700, lat: 12.9987, lng: 77.5920,
    isOpen: true, hours: 'Open · Closes 5:30 PM', priceLevel: 2, tags: ['Historic', 'Museum'],
    civicScore: 74,
  },
  {
    id: 'p5', name: 'Forum Mall', category: 'Shopping mall',
    categoryIcon: '🛍️', address: 'Hosur Rd, Koramangala, Bengaluru',
    rating: 4.3, reviewCount: 31500, lat: 12.9259, lng: 77.6029,
    isOpen: true, hours: 'Open · Closes 10 PM', priceLevel: 3, tags: ['Shopping', 'Food'],
    civicScore: 69,
  },
  {
    id: 'p6', name: 'MTR Restaurant', category: 'South Indian restaurant',
    categoryIcon: '🍽️', address: 'Lalbagh Rd, Mavalli, Bengaluru',
    rating: 4.4, reviewCount: 26900, lat: 12.9474, lng: 77.5762,
    isOpen: true, hours: 'Open · Closes 9 PM', priceLevel: 1, tags: ['Breakfast', 'South Indian'],
    civicScore: 85,
  },
  {
    id: 'p7', name: 'Café Coffee Day – Koramangala', category: 'Café',
    categoryIcon: '☕', address: '80 Feet Rd, Koramangala, Bengaluru',
    rating: 4.1, reviewCount: 5800, lat: 12.9352, lng: 77.6245,
    isOpen: true, hours: 'Open · Closes 11 PM', priceLevel: 2, tags: ['Coffee', 'Wifi'],
    civicScore: 72,
  },
  {
    id: 'p8', name: 'ISRO Headquarters', category: 'Government office',
    categoryIcon: '🚀', address: 'Antariksh Bhavan, New BEL Rd, Bengaluru',
    rating: 4.5, reviewCount: 8400, lat: 13.0183, lng: 77.5718,
    isOpen: false, hours: 'Closed · Opens 9 AM Mon', tags: ['Landmark', 'Government'],
    civicScore: 95,
  },
  {
    id: 'p9', name: 'Indiranagar 100 Feet Road', category: 'Neighborhood',
    categoryIcon: '🏙️', address: 'Indiranagar, Bengaluru',
    rating: 4.3, reviewCount: 12000, lat: 12.9784, lng: 77.6408,
    isOpen: true, hours: 'Always open', tags: ['Nightlife', 'Restaurants', 'Shopping'],
    civicScore: 68,
  },
  {
    id: 'p10', name: 'Kempegowda International Airport', category: 'Airport',
    categoryIcon: '✈️', address: 'Devanahalli, Bengaluru 560300',
    rating: 4.4, reviewCount: 89200, lat: 13.1979, lng: 77.7063,
    isOpen: true, hours: 'Open 24 hours', tags: ['Airport', 'Transport'],
    civicScore: 88,
  },
  {
    id: 'p11', name: 'MG Road Metro Station', category: 'Metro station',
    categoryIcon: '🚇', address: 'MG Road, Bengaluru 560001',
    rating: 4.2, reviewCount: 15300, lat: 12.9758, lng: 77.6097,
    isOpen: true, hours: 'Open · Closes 10:30 PM', tags: ['Transit', 'Metro'],
    civicScore: 79,
  },
  {
    id: 'p12', name: 'Bangalore City Railway Station', category: 'Train station',
    categoryIcon: '🚂', address: 'Gubbi Thotadappa Rd, Majestic, Bengaluru',
    rating: 3.9, reviewCount: 44700, lat: 12.9775, lng: 77.5713,
    isOpen: true, hours: 'Open 24 hours', tags: ['Transit', 'Railway'],
    civicScore: 61,
  },
  {
    id: 'p13', name: 'Bengaluru One – Koramangala', category: 'Government office',
    categoryIcon: '🏢', address: '5th Block, Koramangala, Bengaluru',
    rating: 3.7, reviewCount: 4200, lat: 12.9296, lng: 77.6273,
    isOpen: true, hours: 'Open · Closes 5 PM', tags: ['Government', 'Services'],
    civicScore: 73,
  },
  {
    id: 'p14', name: 'Royal Orchid Central', category: 'Hotel',
    categoryIcon: '🏨', address: 'Nandidurga Rd, Benson Town, Bengaluru',
    rating: 4.1, reviewCount: 3900, lat: 12.9935, lng: 77.5954,
    isOpen: true, hours: 'Open 24 hours', priceLevel: 3, tags: ['Hotel', 'Restaurant'],
    civicScore: 80,
  },
  {
    id: 'p15', name: 'Wonderla Amusement Park', category: 'Amusement park',
    categoryIcon: '🎡', address: 'Mysore Rd, Bengaluru 562109',
    rating: 4.5, reviewCount: 67800, lat: 12.8458, lng: 77.4614,
    isOpen: true, hours: 'Open · Closes 6 PM', priceLevel: 3, tags: ['Fun', 'Family'],
    civicScore: 90,
  },
];

// Civic issues scattered around Bengaluru
export const CIVIC_ISSUES: CivicIssue[] = [
  { id: 'ci1', type: 'pothole', lat: 12.9716, lng: 77.5946, severity: 'high', title: 'Large pothole near signal', reportedAt: new Date('2025-06-20'), verifications: 12 },
  { id: 'ci2', type: 'garbage', lat: 12.9352, lng: 77.6245, severity: 'medium', title: 'Overflowing garbage bin', reportedAt: new Date('2025-06-22'), verifications: 8 },
  { id: 'ci3', type: 'flooding', lat: 12.9592, lng: 77.6974, severity: 'critical', title: 'Stormwater flooding road', reportedAt: new Date('2025-06-23'), verifications: 23 },
  { id: 'ci4', type: 'streetlight', lat: 12.9784, lng: 77.6408, severity: 'low', title: 'Broken streetlight', reportedAt: new Date('2025-06-18'), verifications: 5 },
  { id: 'ci5', type: 'road_damage', lat: 13.0031, lng: 77.5715, severity: 'high', title: 'Road cave-in', reportedAt: new Date('2025-06-21'), verifications: 17 },
  { id: 'ci6', type: 'manhole', lat: 12.9081, lng: 77.6476, severity: 'critical', title: 'Open manhole cover missing', reportedAt: new Date('2025-06-23'), verifications: 31 },
  { id: 'ci7', type: 'water_leakage', lat: 12.9166, lng: 77.6101, severity: 'medium', title: 'BWSSB pipe burst', reportedAt: new Date('2025-06-22'), verifications: 9 },
  { id: 'ci8', type: 'construction', lat: 12.9922, lng: 77.5568, severity: 'low', title: 'Unmarked construction hazard', reportedAt: new Date('2025-06-19'), verifications: 4 },
  { id: 'ci9', type: 'pothole', lat: 12.8399, lng: 77.6770, severity: 'medium', title: 'Multiple potholes after rain', reportedAt: new Date('2025-06-21'), verifications: 14 },
  { id: 'ci10', type: 'garbage', lat: 13.0353, lng: 77.5970, severity: 'high', title: 'Illegal dumping site', reportedAt: new Date('2025-06-20'), verifications: 19 },
];

export const EXPLORE_CATEGORIES = [
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️', color: '#EA4335' },
  { id: 'coffee', label: 'Coffee', icon: '☕', color: '#795548' },
  { id: 'hotels', label: 'Hotels', icon: '🏨', color: '#1A73E8' },
  { id: 'atm', label: 'ATMs', icon: '🏧', color: '#34A853' },
  { id: 'petrol', label: 'Petrol', icon: '⛽', color: '#FBBC04' },
  { id: 'hospital', label: 'Hospital', icon: '🏥', color: '#EA4335' },
  { id: 'pharmacy', label: 'Pharmacy', icon: '💊', color: '#34A853' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#A142F4' },
];

export const RECENT_SEARCHES = [
  { id: 'r1', label: 'Koramangala', sublabel: 'Bengaluru, Karnataka', lat: 12.9352, lng: 77.6245, type: 'recent' as const, icon: '🕐' },
  { id: 'r2', label: 'Indiranagar', sublabel: 'Bengaluru, Karnataka', lat: 12.9784, lng: 77.6408, type: 'recent' as const, icon: '🕐' },
  { id: 'r3', label: 'Home', sublabel: 'Whitefield, Bengaluru', lat: 12.9698, lng: 77.7500, type: 'recent' as const, icon: '🏠' },
  { id: 'r4', label: 'Work', sublabel: 'MG Road, Bengaluru', lat: 12.9758, lng: 77.6097, type: 'recent' as const, icon: '💼' },
];
