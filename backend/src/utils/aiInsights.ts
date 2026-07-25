import { IScan } from '../models/Scan';
import { IQRCode } from '../models/QRCode';

export interface AIInsight {
  id: string;
  type: 'peak_time' | 'device_trend' | 'location_spike' | 'growth' | 'roi_tip';
  title: string;
  message: string;
  impactScore: number; // 1-100
  metric: string;
}

export const generateAIInsights = (scans: IScan[], qrs: IQRCode[]): AIInsight[] => {
  const insights: AIInsight[] = [];

  if (scans.length === 0) {
    return [
      {
        id: '1',
        type: 'growth',
        title: 'Initial Launch Phase',
        message: 'Your QR campaigns are active. Share your dynamic QR codes across bottle prints and flyers to gather initial scan intelligence.',
        impactScore: 70,
        metric: '0 Scans'
      }
    ];
  }

  // 1. Peak Hour Calculation
  const hourCounts: { [hour: number]: number } = {};
  scans.forEach((scan) => {
    const h = new Date(scan.timestamp).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  let peakHour = 14;
  let maxHourScans = 0;
  Object.keys(hourCounts).forEach((hStr) => {
    const h = parseInt(hStr, 10);
    if (hourCounts[h] > maxHourScans) {
      maxHourScans = hourCounts[h];
      peakHour = h;
    }
  });

  const formatHour = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH} ${period}`;
  };

  insights.push({
    id: 'peak_time_1',
    type: 'peak_time',
    title: 'Peak Scan Window Detected',
    message: `Your advertising QRs receive maximum engagement around ${formatHour(peakHour)} – ${formatHour((peakHour + 3) % 24)}. Schedule targeted digital promos during this window for optimal ROI.`,
    impactScore: 92,
    metric: `${Math.round((maxHourScans / scans.length) * 100)}% peak density`
  });

  // 2. Location Distribution
  const cityCounts: { [city: string]: number } = {};
  scans.forEach((scan) => {
    const c = scan.city || 'Unknown City';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
  if (sortedCities.length > 0) {
    const [topCity, topCityCount] = sortedCities[0];
    const topCityPercentage = Math.round((topCityCount / scans.length) * 100);
    insights.push({
      id: 'location_spike_1',
      type: 'location_spike',
      title: `High Density Regional Surge in ${topCity}`,
      message: `Audience from ${topCity} accounts for ${topCityPercentage}% of all QR scans. Consider deploying physical billboards or localized product distribution in this region.`,
      impactScore: 88,
      metric: `${topCityPercentage}% from ${topCity}`
    });
  }

  // 3. Device & Mobile Split
  let mobileCount = 0;
  scans.forEach((scan) => {
    if (scan.device === 'Mobile' || scan.device === 'Tablet') {
      mobileCount++;
    }
  });
  const mobileShare = Math.round((mobileCount / scans.length) * 100);
  insights.push({
    id: 'device_trend_1',
    type: 'device_trend',
    title: `${mobileShare}% Mobile Traffic Dominance`,
    message: `${mobileShare}% of users scan via mobile devices. Ensure linked landing pages feature fast vertical scrolling, sticky CTAs, and mobile-optimized web forms.`,
    impactScore: 85,
    metric: `${mobileShare}% Mobile`
  });

  // 4. Best Performing Campaign QR
  if (qrs.length > 0) {
    const topQR = [...qrs].sort((a, b) => b.totalScans - a.totalScans)[0];
    insights.push({
      id: 'roi_tip_1',
      type: 'roi_tip',
      title: `Star Campaign: "${topQR.name}"`,
      message: `"${topQR.name}" on brand "${topQR.brandName}" is leading with ${topQR.totalScans} total scans. Replicate its visual frame design and placement strategy across secondary products.`,
      impactScore: 95,
      metric: `${topQR.totalScans} Total Scans`
    });
  }

  return insights;
};
