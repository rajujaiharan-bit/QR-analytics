import React, { useEffect, useState } from 'react';
import { api } from '../api/axios.js';
import { QRCodeItem } from '../types/index.js';
import { QRCard } from '../components/qr/QRCard.js';
import { Plus, Upload, Search, Filter, Star, RefreshCcw } from 'lucide-react';

interface QRCodesListProps {
  onOpenNewQR: () => void;
  onOpenBulkModal: () => void;
  searchTerm?: string;
}

export const QRCodesList: React.FC<QRCodesListProps> = ({ onOpenNewQR, onOpenBulkModal, searchTerm = '' }) => {
  const [qrs, setQrs] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Edit Dynamic URL Modal
  const [editingQR, setEditingQR] = useState<QRCodeItem | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'paused' | 'expired'>('active');

  const fetchQRCodes = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (onlyFavorites) params.isFavorite = true;

      const res = await api.get('/api/qr', { params });
      setQrs(res.data.qrs || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [search, selectedCategory, selectedStatus, onlyFavorites]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this QR Code?')) {
      try {
        await api.delete(`/api/qr/${id}`);
        fetchQRCodes();
      } catch (err) {
        alert('Failed to delete QR');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.post(`/api/qr/${id}/duplicate`);
      fetchQRCodes();
    } catch (err) {
      alert('Failed to duplicate QR');
    }
  };

  const handleFavoriteToggle = async (qr: QRCodeItem) => {
    try {
      await api.put(`/api/qr/${qr._id}`, { isFavorite: !qr.isFavorite });
      fetchQRCodes();
    } catch (err) {
      alert('Failed to update favorite status');
    }
  };

  const handleStartEdit = (qr: QRCodeItem) => {
    setEditingQR(qr);
    setEditName(qr.name);
    setEditUrl(qr.destinationUrl);
    setEditStatus(qr.status);
  };

  const handleSaveEdit = async () => {
    if (!editingQR) return;
    try {
      await api.put(`/api/qr/${editingQR._id}`, {
        name: editName,
        destinationUrl: editUrl,
        status: editStatus
      });
      setEditingQR(null);
      fetchQRCodes();
    } catch (err) {
      alert('Failed to update dynamic QR properties');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Dynamic QR Codes</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage & update destination URLs without reprinting product labels
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenBulkModal}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <Upload className="w-4 h-4 text-brand-500" />
            <span>Bulk CSV Generator</span>
          </button>

          <button
            onClick={onOpenNewQR}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-brand-500/25 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New QR</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by QR name, brand, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          >
            <option value="">All Categories</option>
            <option value="Bottle Print">Bottle Print</option>
            <option value="Packaging">Packaging</option>
            <option value="Flyers">Flyers</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
          </select>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`p-2 rounded-xl border flex items-center space-x-1 font-semibold transition-all ${
              onlyFavorites
                ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                : 'border-gray-200 dark:border-gray-700 text-gray-500'
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* QR Cards Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-gray-500">Loading QR inventory...</div>
      ) : qrs.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No QR Codes Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your search filters or click "Generate New QR" to create your first dynamic QR code.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrs.map((qr) => (
            <QRCard
              key={qr._id}
              qr={qr}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {/* Edit Dynamic URL Modal */}
      {editingQR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0C121E] w-full max-w-md rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Edit Dynamic Target URL</h3>
            <p className="text-xs text-gray-500">
              Updating this URL will immediately route future QR scans without reprinting physical packaging.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">QR Code Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Destination URL</label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setEditingQR(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20"
              >
                Save Dynamic Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
