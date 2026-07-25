import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/axios.js';
import { QRCodeItem, ScanRecord } from '../types/index.js';
import { QRCodeSVG } from 'qrcode.react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowLeft, Activity, Eye, Calendar, Clock, MapPin, Download, Globe, Shield, RefreshCw } from 'lucide-react';

export const QRDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{
    qr: QRCodeItem;
    metrics: {
      totalScans: number;
      uniqueVisitors: number;
      returningVisitors: number;
      firstScan?: string;
      lastScan?: string;
      avgDailyScans: string;
    };
    hourlyGraph: { hour: string; scans: number }[];
    topCities: { name: string; count: number }[];
    topCountries: { name: string; count: number }[];
    scansTable: ScanRecord[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchQRDetails = async () => {
    try {
      const res = await api.get(`/api/analytics/qr/${id}`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRDetails();
  }, [id]);

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading detailed QR report...</div>;
  }

  const { qr, metrics, hourlyGraph, topCities, topCountries, scansTable } = data;
  const backendUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';
  const shortRedirectUrl = `${backendUrl}/r/${qr.shortCode}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between">
        <Link to="/qr-codes" className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to QR Inventory</span>
        </Link>
        <button onClick={fetchQRDetails} className="p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Header Info Banner */}
      <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-inner shrink-0">
            <QRCodeSVG value={shortRedirectUrl} size={110} fgColor={qr.fgColor || '#000000'} bgColor={qr.bgColor || '#FFFFFF'} />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {qr.category || 'Bottle Print'}
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 capitalize">
                {qr.status}
              </span>
            </div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">{qr.name}</h1>
            <p className="text-xs text-gray-500">{qr.brandName} {qr.campaign ? `• Campaign: ${qr.campaign.name}` : ''}</p>
            <p className="text-xs font-mono text-brand-500 mt-2 truncate max-w-md">{qr.destinationUrl}</p>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={shortRedirectUrl}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 shrink-0"
        >
          Test Dynamic Redirection
        </a>
      </div>

      {/* Key Metric KPI Pill Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Total Scans</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{metrics.totalScans}</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Unique Visitors</span>
          <span className="text-2xl font-black text-brand-500">{metrics.uniqueVisitors}</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Returning Visitors</span>
          <span className="text-2xl font-black text-accent-500">{metrics.returningVisitors}</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Avg Daily Velocity</span>
          <span className="text-2xl font-black text-emerald-500">{metrics.avgDailyScans} / day</span>
        </div>
      </div>

      {/* Hourly Scan Distribution Chart */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Hourly Scan Peak Hours</h3>
        <p className="text-xs text-gray-500 mb-4">Distribution of scan volume by hour of day (00:00 - 23:00)</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF', fontSize: '12px' }} />
              <Bar dataKey="scans" fill="#0284C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* City & Country Geo Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Top Scanning Cities</h3>
          <div className="space-y-2">
            {topCities.map((city) => (
              <div key={city.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <span className="font-bold text-gray-800 dark:text-gray-200">{city.name}</span>
                <span className="font-extrabold text-brand-500">{city.count} Scans</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Top Countries</h3>
          <div className="space-y-2">
            {topCountries.map((country) => (
              <div key={country.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <span className="font-bold text-gray-800 dark:text-gray-200">{country.name}</span>
                <span className="font-extrabold text-accent-500">{country.count} Scans</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Scan Logs Table */}
      <div className="glass-card rounded-3xl p-6 overflow-hidden">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Scan Audit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 dark:bg-gray-800/60 text-gray-500 uppercase font-semibold">
              <tr>
                <th className="p-3.5 rounded-l-xl">Timestamp</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Device</th>
                <th className="p-3.5">OS</th>
                <th className="p-3.5">Browser</th>
                <th className="p-3.5 rounded-r-xl">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {scansTable.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="p-3.5 text-gray-400 font-mono">{new Date(s.timestamp).toLocaleString()}</td>
                  <td className="p-3.5 font-mono">{s.ip}</td>
                  <td className="p-3.5 font-semibold text-gray-900 dark:text-white">{s.city}, {s.country}</td>
                  <td className="p-3.5 font-medium">{s.device}</td>
                  <td className="p-3.5">{s.os}</td>
                  <td className="p-3.5">{s.browser}</td>
                  <td className="p-3.5 text-gray-500">{s.referrer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
