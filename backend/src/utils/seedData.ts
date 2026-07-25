import mongoose from 'mongoose';
import User from '../models/User';
import Campaign from '../models/Campaign';
import QRCode from '../models/QRCode';
import LandingPage from '../models/LandingPage';
import Scan from '../models/Scan';
import Notification from '../models/Notification';

export const seedDatabase = async () => {
  console.log('[Seeder] Resetting database collections...');
  await User.deleteMany({});
  await Campaign.deleteMany({});
  await QRCode.deleteMany({});
  await LandingPage.deleteMany({});
  await Scan.deleteMany({});
  await Notification.deleteMany({});

  console.log('[Seeder] Creating admin & demo users...');
  const adminUser = await User.create({
    name: 'Alexandra Vance',
    email: 'admin@qrads.com',
    password: 'Password123!',
    role: 'admin',
    company: 'Apex Beverage Brands',
    businessType: 'CPG & Bottling Operations',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    subscription: { plan: 'enterprise', status: 'active' }
  });

  const demoUser = await User.create({
    name: 'Marcus Sterling',
    email: 'demo@qrads.com',
    password: 'Password123!',
    role: 'user',
    company: 'AquaPure Refreshment Co.',
    businessType: 'Beverage & Consumer Goods',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    subscription: { plan: 'pro', status: 'active' }
  });

  console.log('[Seeder] Creating sample campaigns...');
  const campaign1 = await Campaign.create({
    creator: demoUser._id,
    name: 'Sparkling Citrus Bottle Print 2026',
    brand: 'AquaPure Citrus',
    description: 'Dynamic QR printed on 500ml glass bottles across West Coast retailers.',
    category: 'Bottle Label',
    budget: 4500,
    totalCost: 4200,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    targetAudience: 'Health & Fitness Enthusiasts'
  });

  const campaign2 = await Campaign.create({
    creator: demoUser._id,
    name: 'Airport Lounge Packaging Promo',
    brand: 'AquaPure Premium',
    description: 'QR codes printed on eco-friendly paper packaging distributed in international airport lounges.',
    category: 'Packaging',
    budget: 8000,
    totalCost: 7500,
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    targetAudience: 'Business Travelers'
  });

  const campaign3 = await Campaign.create({
    creator: demoUser._id,
    name: 'City Marathon Flyer Drop',
    brand: 'AquaPure Hydrate',
    description: 'QR flyers distributed during major metropolitan marathons.',
    category: 'Flyer & Posters',
    budget: 2500,
    totalCost: 2400,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    targetAudience: 'Runners & Athletes'
  });

  console.log('[Seeder] Creating custom landing page...');
  const landingPage1 = await LandingPage.create({
    creator: demoUser._id,
    title: 'AquaPure Summer Rewards Landing',
    brandName: 'AquaPure Refreshment',
    brandLogo: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=150&q=80',
    heading: 'Scan & Win $500 Summer Refreshment Pack!',
    subheading: 'Welcome to the official AquaPure loyalty experience.',
    description: 'Thank you for scanning our bottle packaging! Enter your contact details below to enter our weekly sweepstakes and get instant discount coupons.',
    primaryButtonText: 'Claim Your Free Voucher',
    primaryButtonLink: 'https://aquapure.com/rewards',
    secondaryButtonText: 'View Retail Store Locations',
    secondaryButtonLink: 'https://aquapure.com/stores',
    bannerImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    backgroundColor: '#0F172A',
    textColor: '#F8FAFC',
    phoneNumber: '+1 (800) 555-AQUA',
    email: 'rewards@aquapure.com',
    location: 'Los Angeles, CA',
    socialLinks: {
      instagram: 'https://instagram.com/aquapure',
      facebook: 'https://facebook.com/aquapure'
    }
  });

  console.log('[Seeder] Creating dynamic QR codes...');
  const qr1 = await QRCode.create({
    creator: demoUser._id,
    campaign: campaign1._id,
    landingPage: landingPage1._id,
    name: 'Bottle Front Label - Citrus Zero',
    brandName: 'AquaPure',
    description: '500ml Bottle label dynamic QR',
    shortCode: 'citrus500',
    destinationType: 'landing_page',
    destinationUrl: 'https://aquapure.com/citrus-rewards',
    status: 'active',
    isFavorite: true,
    category: 'Bottle Print',
    tags: ['Bottle', 'Citrus', 'Summer'],
    fgColor: '#0284C7',
    bgColor: '#FFFFFF',
    frameStyle: 'gradient',
    totalScans: 0,
    uniqueVisitors: 0,
    manualConversions: 42
  });

  const qr2 = await QRCode.create({
    creator: demoUser._id,
    campaign: campaign2._id,
    name: 'Airport Lounge Eco-Box QR',
    brandName: 'AquaPure Luxury',
    description: 'Printed on recycled paper boxes',
    shortCode: 'airbox99',
    destinationType: 'website',
    destinationUrl: 'https://aquapure.com/vip-lounge',
    status: 'active',
    isFavorite: true,
    category: 'Packaging',
    tags: ['Airport', 'Packaging', 'VIP'],
    fgColor: '#0F172A',
    bgColor: '#F8FAFC',
    frameStyle: 'rounded',
    totalScans: 0,
    uniqueVisitors: 0,
    manualConversions: 68
  });

  const qr3 = await QRCode.create({
    creator: demoUser._id,
    campaign: campaign3._id,
    name: 'Marathon Booth Flyer QR',
    brandName: 'AquaPure Hydrate',
    description: 'Flyer handed out at finish line booth',
    shortCode: 'runflyer26',
    destinationType: 'website',
    destinationUrl: 'https://aquapure.com/marathon',
    status: 'active',
    isFavorite: false,
    category: 'Flyers',
    tags: ['Marathon', 'Fitness'],
    fgColor: '#16A34A',
    bgColor: '#FFFFFF',
    frameStyle: 'dots',
    totalScans: 0,
    uniqueVisitors: 0,
    manualConversions: 19
  });

  console.log('[Seeder] Generating 180 historic scan records...');
  const cities = [
    { city: 'New York', state: 'NY', country: 'United States', lat: 40.7128, lon: -74.006 },
    { city: 'San Francisco', state: 'CA', country: 'United States', lat: 37.7749, lon: -122.4194 },
    { city: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { city: 'Tokyo', state: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { city: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707 },
    { city: 'Sydney', state: 'NSW', country: 'Australia', lat: -33.8688, lon: 151.2093 }
  ];

  const devices = ['Mobile', 'Mobile', 'Mobile', 'Tablet', 'Desktop'];
  const browsers = ['Chrome', 'Safari', 'Safari', 'Firefox', 'Edge'];
  const osList = ['iOS', 'iOS', 'Android', 'macOS', 'Windows'];

  const qrList = [qr1, qr2, qr3];

  const now = Date.now();
  for (let i = 0; i < 180; i++) {
    const selectedQR = qrList[i % qrList.length];
    const loc = cities[i % cities.length];
    const dev = devices[i % devices.length];
    const br = browsers[i % browsers.length];
    const os = osList[i % osList.length];

    // Randomize timestamp over last 14 days
    const randomDaysAgo = Math.floor(Math.random() * 14);
    const randomHour = Math.floor(Math.random() * 24);
    const timestamp = new Date(now - randomDaysAgo * 24 * 60 * 60 * 1000 + randomHour * 3600 * 1000);

    const visitorId = `visitor_hash_${i % 45}`; // 45 unique visitors

    await Scan.create({
      qrCode: selectedQR._id,
      campaign: selectedQR.campaign,
      visitorId,
      ip: `198.51.100.${i + 1}`,
      country: loc.country,
      state: loc.state,
      city: loc.city,
      device: dev,
      browser: br,
      os: os,
      referrer: i % 3 === 0 ? 'Direct QR Scan' : 'Camera App',
      latitude: loc.lat,
      longitude: loc.lon,
      timestamp
    });

    selectedQR.totalScans += 1;
  }

  // Calculate unique visitors
  for (const qr of qrList) {
    const scansForQR = await Scan.find({ qrCode: qr._id });
    const uniqueSet = new Set(scansForQR.map((s) => s.visitorId));
    qr.uniqueVisitors = uniqueSet.size;
    await qr.save();
  }

  console.log('[Seeder] Creating notifications...');
  await Notification.create({
    user: demoUser._id,
    title: '🚀 Platform Initialized',
    message: 'Welcome to QR Advertising Analytics Platform! Your sample bottle & packaging campaigns are ready.',
    type: 'qr_created',
    link: '/dashboard'
  });

  await Notification.create({
    user: demoUser._id,
    title: '🔥 Scan Spike Alert',
    message: 'Bottle Front Label - Citrus Zero reached 80 scans today!',
    type: 'milestone',
    link: `/qr/${qr1._id}`
  });

  console.log('[Seeder] Database successfully seeded! 🎉');
};
