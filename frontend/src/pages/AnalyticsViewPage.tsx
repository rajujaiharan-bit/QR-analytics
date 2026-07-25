import React, { useEffect, useState } from 'react';
import { api } from '../api/axios.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Download, Calendar, Smartphone, Globe, Filter } from 'lucide-react';

export const AnalyticsViewPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [filterRange, setFilterRange] = useState('7days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics/dashboard');
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [filterRange]);

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading Analytics Hub...</div>;
  }

  const COLORS = ['#0284C7', '#6366F1', '#10B981', '#F59E0B', '#EC4899'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Analytics Hub & Intelligence</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Deep scan metrics, browser, OS, and location distributions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Time Filter Buttons */}
          <div className="flex space-x-1 p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold">
            {['today', '7days', '30days', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setFilterRange(range)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filterRange === range
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <a
            href="/api/export/scans/csv"
            download
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-brand-500/20 flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Browser & OS Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Browser Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Target client browser software</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.browserDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="count">
                  {data.browserDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Operating System Split</h3>
          <p className="text-xs text-gray-500 mb-4">iOS vs Android vs Desktop OS</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.osDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
