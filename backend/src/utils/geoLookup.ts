import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export interface ScanMetadata {
  device: string;
  browser: string;
  os: string;
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
}

export const extractScanMetadata = (ip: string, userAgentStr?: string): ScanMetadata => {
  // UA Parser
  const parser = new UAParser(userAgentStr || '');
  const uaResult = parser.getResult();

  const deviceType = uaResult.device.type
    ? uaResult.device.type.charAt(0).toUpperCase() + uaResult.device.type.slice(1)
    : 'Desktop';

  const browserName = uaResult.browser.name || 'Unknown Browser';
  const osName = uaResult.os.name || 'Unknown OS';

  // GeoIP lookup
  let country = 'United States';
  let state = 'California';
  let city = 'San Francisco';
  let latitude = 37.7749;
  let longitude = -122.4194;

  const cleanIp = ip.replace('::ffff:', '');
  const geo = geoip.lookup(cleanIp);

  if (geo) {
    country = geo.country || country;
    state = geo.region || state;
    city = geo.city || city;
    if (geo.ll && geo.ll.length === 2) {
      latitude = geo.ll[0];
      longitude = geo.ll[1];
    }
  } else if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp.startsWith('192.168.')) {
    // Provide realistic varied data for local testing
    const sampleCities = [
      { c: 'New York', s: 'NY', co: 'United States', lat: 40.7128, lon: -74.006 },
      { c: 'London', s: 'England', co: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
      { c: 'Tokyo', s: 'Tokyo', co: 'Japan', lat: 35.6762, lon: 139.6503 },
      { c: 'San Francisco', s: 'CA', co: 'United States', lat: 37.7749, lon: -122.4194 },
      { c: 'Sydney', s: 'NSW', co: 'Australia', lat: -33.8688, lon: 151.2093 }
    ];
    const picked = sampleCities[Math.floor(Math.random() * sampleCities.length)];
    city = picked.c;
    state = picked.s;
    country = picked.co;
    latitude = picked.lat;
    longitude = picked.lon;
  }

  return {
    device: deviceType,
    browser: browserName,
    os: osName,
    country,
    state,
    city,
    latitude,
    longitude
  };
};
