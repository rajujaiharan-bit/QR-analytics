import React, { useEffect, useState } from 'react';
import { api } from '../api/axios.js';
import { UserManagementTable } from '../components/admin/UserManagementTable.js';
import { ShieldCheck, Users, QrCode, Activity, HardDrive, Award } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading Admin System Stats...</div>;
  }

  const { stats, users, mostActiveUsers } = data;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-purple-500" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admin System Management</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Global SaaS tenant statistics & user role controls</p>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Total SaaS Users</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalUsers}</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Total QRs</span>
          <span className="text-2xl font-black text-brand-500">{stats.totalQRs}</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Total Scans Logged</span>
          <span className="text-2xl font-black text-accent-500">{stats.totalScans}</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Campaign Vectors</span>
          <span className="text-2xl font-black text-emerald-500">{stats.totalCampaigns}</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Storage Usage</span>
          <span className="text-2xl font-black text-amber-500">{stats.storageUsedMB} MB</span>
        </div>
      </div>

      {/* User Management Table */}
      <UserManagementTable users={users} onRefresh={fetchAdminData} />
    </div>
  );
};
