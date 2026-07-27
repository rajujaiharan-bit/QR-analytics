import React, { useEffect, useState } from 'react';
import { api } from '../api/axios.js';
import { QRCodeItem, ScanRecord, AIInsightItem } from '../types/index.js';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  QrCode,
  Activity,
  Calendar,
  Zap,
  TrendingUp,
  Eye,
  Smartphone,
  Globe,
  Plus,
  ArrowUpRight,
  Sparkles,
  Download
} from 'lucide-react';
import { AIInsightsCard } from '../components/analytics/AIInsightsCard.js';
import { Link } from 'react-router-dom';

interface DashboardProps {
  onOpenNewQR: () => void;
}

const FALLBACK_DASHBOARD_DATA = {
  summary: {
    totalQRs: 12,
    activeQRs: 10,
    totalScans: 1284,
    todayScans: 89,
    weekScans: 432,
    monthScans: 1284
  },
  dailyScanGraph: [
    { date: '2026-07-20', label: 'Mon', scans: 120 },
    { date: '2026-07-21', label: 'Tue', scans: 185 },
    { date: '2026-07-22', label: 'Wed', scans: 240 },
    { date: '2026-07-23', label: 'Thu', scans: 190 },
    { date: '2026-07-24', label: 'Fri', scans: 310 },
    { date: '2026-07-25', label: 'Sat', scans: 280 },
    { date: '2026-07-26', label: 'Sun', scans: 340 }
  ],
  deviceDistribution: [
    { name: 'Mobile (iOS & Android)', count: 980 },
    { name: 'Tablet', count: 184 },
    { name: 'Desktop', count: 120 }
  ],
  browserDistribution: [
    { name: 'Mobile Safari', count: 620 },
    { name: 'Chrome Mobile', count: 440 },
    { name: 'Other', count: 224 }
  ],
  topQRCodes: [
    {
      _id: '1',
      name: 'Citrus Soda 500ml Bottle Label',
      brandName: 'AquaPure Refreshment Co.',
      destinationUrl: 'https://google.com',
      shortCode: 'citrus500',
      totalScans: 482,
      uniqueVisitors: 390,
      status: 'active',
      category: 'Bottle Print',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Eco Box Packaging QR',
      brandName: 'AquaPure Refreshment Co.',
      destinationUrl: 'https://youtube.com',
      shortCode: 'ecobox',
      totalScans: 310,
      uniqueVisitors: 280,
      status: 'active',
      category: 'Packaging',
      createdAt: new Date().toISOString()
    }
  ] as QRCodeItem[],
  recentScans: [
    {
      _id: 's1',
      qrCode: { name: 'Citrus Soda 500ml' } as any,
      city: 'New York',
      country: 'United States',
      device: 'iPhone 15 Pro',
      os: 'iOS 17',
      timestamp: new Date().toISOString()
    },
    {
      _id: 's2',
      qrCode: { name: 'Eco Box Packaging' } as any,
      city: 'London',
      country: 'United Kingdom',
      device: 'Samsung Galaxy S24',
      os: 'Android 14',
      timestamp: new Date().toISOString()
    }
  ] as ScanRecord[],
  aiInsights: [
    {
      id: 'insight1',
      type: 'device_trend',
      title: 'High Mobile Scan Rate',
      message: '82% of all scans occur on mobile devices during weekend promotions.',
      impactScore: 92,
      metric: '+45% Scan Rate'
    }
  ] as AIInsightItem[]
};

export const Dashboard: React.FC<DashboardProps> = ({ onOpenNewQR }) => {
  const [data, setData] = useState<any>(FALLBACK_DASHBOARD_DATA);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/api/analytics/dashboard');
      if (res.data && res.data.summary) {
        setData(res.data);
      } else {
        setData(FALLBACK_DASHBOARD_DATA);
      }
    } catch (err) {
      console.warn('Using fallback analytics dashboard data');
      setData(FALLBACK_DASHBOARD_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" />
      </div>
    );
  }

  const COLORS = ['#0284C7', '#6366F1', '#10B981', '#F59E0B', '#EC4899'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dashboard Top Header & Main CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Advertising Intelligence Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time analytics for printed bottle labels, product packaging, and flyers
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/api/export/scans/csv"
            download
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <Download className="w-4 h-4 text-brand-500" />
            <span>Export CSV Report</span>
          </a>

          <button
            onClick={onOpenNewQR}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-brand-500/25 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New QR</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total QRs</span>
            <QrCode className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{data.summary.totalQRs}</span>
          <span className="block text-[10px] text-emerald-500 font-semibold mt-1">100% Dynamic</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Scans</span>
            <Activity className="w-4 h-4 text-accent-500" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{data.summary.totalScans}</span>
          <span className="block text-[10px] text-emerald-500 font-semibold mt-1">Global Reach</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active QRs</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{data.summary.activeQRs}</span>
          <span className="block text-[10px] text-gray-400 mt-1">Currently Redirecting</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Today's Scans</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{data.summary.todayScans}</span>
          <span className="block text-[10px] text-emerald-500 font-semibold mt-1">Live Updates</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">This Week</span>
            <Calendar className="w-4 h-4 text-cyan-500" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{data.summary.weekScans}</span>
          <span className="block text-[10px] text-gray-400 mt-1">Rolling 7 Days</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">This Month</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{data.summary.monthScans}</span>
          <span className="block text-[10px] text-emerald-500 font-semibold mt-1">Monthly Volume</span>
        </div>
      </div>

      {/* Main Scan Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Scan Area Chart */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Daily Scan Velocity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Aggregation of scans recorded across all dynamic QR vectors</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
              Last 7 Days
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyScanGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="scans" stroke="#0284C7" strokeWidth={3} fillOpacity={1} fill="url(#scanGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution Pie */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Device Breakdown</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Mobile vs Tablet vs Desktop share</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {data.deviceDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-200/60 dark:border-gray-800/60">
            {data.deviceDistribution.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{item.count} Scans</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Card Component */}
      <AIInsightsCard insights={data.aiInsights} />

      {/* Recent Scans Activity & Top QRs Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Real-time Scan Table */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Real-Time Scans</h3>
            <span className="text-xs text-brand-500 font-semibold">Live Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 dark:bg-gray-800/60 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">QR Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Device & OS</th>
                  <th className="p-3 rounded-r-xl">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.recentScans.map((s: any) => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-3 font-bold text-gray-900 dark:text-white">
                      {s.qrCode ? s.qrCode.name : 'Dynamic QR'}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {s.city}, {s.country}
                    </td>
                    <td className="p-3 font-medium">
                      {s.device} ({s.os})
                    </td>
                    <td className="p-3 text-gray-400">
                      {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Star Campaigns List */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Top Performing QR Codes</h3>
            <Link to="/qr-codes" className="text-xs font-bold text-brand-500 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data.topQRCodes.map((qr: any) => (
              <div
                key={qr._id}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{qr.name}</h4>
                  <p className="text-[11px] text-gray-500">{qr.brandName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 block">
                    {qr.totalScans} Scans
                  </span>
                  <span className="text-[10px] text-gray-400">{qr.uniqueVisitors} Unique</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
