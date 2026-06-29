const fs = require('fs');

const generateData = () => {
  const issues = [];
  const types = ['pothole', 'garbage', 'water_leak', 'broken_light', 'road_damage', 'flooding', 'manhole'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['reported', 'verified', 'resolving', 'resolved'];

  // Bounding box for India roughly
  const minLat = 8.4;
  const maxLat = 35.0;
  const minLng = 68.7;
  const maxLng = 97.2;

  let sql = 'INSERT INTO issues (type, title, description, lat, lng, severity, status, upvotes, downvotes) VALUES\n';

  const numRecords = 100000;
  for (let i = 0; i < numRecords; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);
    const upvotes = Math.floor(Math.random() * 100);
    const downvotes = Math.floor(Math.random() * 10);
    
    // Add more density to major cities
    // Delhi: 28.6, 77.2
    // Mumbai: 19.0, 72.8
    // Bangalore: 12.9, 77.5
    let fLat = lat;
    let fLng = lng;
    
    if (Math.random() > 0.5) {
      const cities = [
        {lat: 28.61, lng: 77.20}, // Delhi
        {lat: 19.07, lng: 72.87}, // Mumbai
        {lat: 12.97, lng: 77.59}, // Bangalore
        {lat: 13.08, lng: 80.27}, // Chennai
        {lat: 22.57, lng: 88.36}, // Kolkata
        {lat: 17.38, lng: 78.48}, // Hyderabad
      ];
      const city = cities[Math.floor(Math.random() * cities.length)];
      fLat = city.lat + (Math.random() - 0.5) * 0.5;
      fLng = city.lng + (Math.random() - 0.5) * 0.5;
    }

    const title = `${type.replace('_', ' ')} reported`;
    const desc = `Automated generation for ${type}`;
    
    sql += `('${type}', '${title}', '${desc}', ${fLat.toFixed(6)}, ${fLng.toFixed(6)}, '${severity}', '${status}', ${upvotes}, ${downvotes})`;
    if (i < numRecords - 1) {
      sql += ',\n';
    } else {
      sql += ';\n';
    }
  }

  fs.writeFileSync('seed_100k.sql', sql);
};

generateData();
