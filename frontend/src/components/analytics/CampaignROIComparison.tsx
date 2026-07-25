import React, { useEffect, useState } from 'react';
import { ROIComparisonItem } from '../../types/index.js';
import { api } from '../../api/axios.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Trophy, TrendingUp, DollarSign, Award, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';

interface CampaignROIComparisonProps {
  onOpenCreateCampaign?: () => void;
}

export const CampaignROIComparison: React.FC<CampaignROIComparisonProps> = ({ onOpenCreateCampaign }) => {
  const [data, setData] = useState<{
    comparison: ROIComparisonItem[];
    bestCampaign: ROIComparisonItem | null;
    worstCampaign: ROIComparisonItem | null;
  }>({
    comparison: [],
    bestCampaign: null,
    worstCampaign: null
  });
  const [loading, setLoading] = useState(true);

  const fetchROIComparison = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/campaigns/roi-comparison');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchROIComparison();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading Campaign ROI comparison matrix...</div>;
  }

  const chartData = data.comparison.map((c) => ({
    name: c.name.length > 18 ? c.name.substring(0, 15) + '...' : c.name,
    Scans: c.totalScans,
    Visitors: c.uniqueVisitors,
    CostPerScan: c.costPerScan
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Star Campaign Winner */}
        {data.bestCampaign && (
          <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">Top Performing ROI Campaign</span>
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <h4 className="text-base font-extrabold text-gray-900 dark:text-white truncate">{data.bestCampaign.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{data.bestCampaign.brand} ({data.bestCampaign.category})</p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200/60 dark:border-gray-800/60">
              <div>
                <span className="text-[10px] text-gray-400 block">Total Scans</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{data.bestCampaign.totalScans} Scans</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Cost Per Scan</span>
                <span className="font-bold text-gray-900 dark:text-white">${data.bestCampaign.costPerScan.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Total Campaigns Monitored */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-500">Active Advertising Vectors</span>
            <Award className="w-5 h-5 text-brand-500" />
          </div>
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">{data.comparison.length} Campaigns</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Comparing bottle prints, flyers & packaging</p>
          <div className="flex items-center space-x-1 text-xs text-emerald-500 font-semibold pt-3 border-t border-gray-200/60 dark:border-gray-800/60">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Continuous Real-Time Tracking</span>
          </div>
        </div>

        {/* Average Cost Per Scan */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-500">Avg Cost Efficiency</span>
            <DollarSign className="w-5 h-5 text-accent-500" />
          </div>
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">
            $
            {(
              data.comparison.reduce((acc, c) => acc + c.costPerScan, 0) / (data.comparison.length || 1)
            ).toFixed(2)}{' '}
            <span className="text-xs text-gray-400 font-normal">/ scan</span>
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Optimized advertising acquisition cost</p>
          <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200/60 dark:border-gray-800/60">
            <span className="text-gray-400">Reach Rating</span>
            <span className="font-bold text-emerald-500">High Conversion Efficiency</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side ROI Comparison Bar Chart */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Campaign Side-by-Side Scan Performance</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Comparing total scans vs unique visitors per campaign channel</p>
          </div>
          <button
            onClick={fetchROIComparison}
            className="p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Scans" fill="#0284C7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Visitors" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Side-by-Side ROI Table */}
      <div className="glass-card rounded-3xl p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Full Campaign ROI Breakdown Matrix</h3>
          <button
            onClick={onOpenCreateCampaign}
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Campaign</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 dark:bg-gray-800/60 text-gray-500 uppercase font-semibold">
              <tr>
                <th className="p-3.5 rounded-l-xl">Campaign Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Total Cost</th>
                <th className="p-3.5">QR Count</th>
                <th className="p-3.5">Scans</th>
                <th className="p-3.5">Unique Visitors</th>
                <th className="p-3.5">Conversions</th>
                <th className="p-3.5">Cost / Scan</th>
                <th className="p-3.5 rounded-r-xl">Reach Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {data.comparison.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-gray-900 dark:text-white">{c.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold">${c.totalCost.toLocaleString()}</td>
                  <td className="p-3.5 font-semibold">{c.qrCount} QRs</td>
                  <td className="p-3.5 font-bold text-brand-600 dark:text-brand-400">{c.totalScans}</td>
                  <td className="p-3.5 font-semibold text-accent-500">{c.uniqueVisitors}</td>
                  <td className="p-3.5 font-semibold">{c.manualConversions}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">${c.costPerScan.toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {c.reachRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
