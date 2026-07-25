import React, { useState } from 'react';
import { CampaignROIComparison } from '../components/analytics/CampaignROIComparison.js';
import { Plus, X } from 'lucide-react';
import { api } from '../api/axios.js';

export const CampaignROIDashboardPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Campaign Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Bottle Print');
  const [budget, setBudget] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand) {
      alert('Please fill in Campaign Name and Brand');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/campaigns', {
        name,
        brand,
        category,
        budget: budget ? parseFloat(budget) : 0,
        totalCost: totalCost ? parseFloat(totalCost) : budget ? parseFloat(budget) : 0,
        description
      });
      setLoading(false);
      setShowCreateModal(false);
      window.location.reload(); // Refresh matrix
    } catch (err) {
      setLoading(false);
      alert('Error creating campaign');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Campaign ROI Comparison Engine</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Side-by-side performance matrix comparing bottle prints, packaging, billboards & flyers
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-brand-500/25 flex items-center space-x-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Advertising Campaign</span>
        </button>
      </div>

      <CampaignROIComparison onOpenCreateCampaign={() => setShowCreateModal(true)} />

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0C121E] w-full max-w-md rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">New Advertising Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Soda Glass Bottle Label"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AquaPure"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
                  >
                    <option value="Bottle Print">Bottle Print</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Flyer & Poster">Flyer & Poster</option>
                    <option value="Billboard">Billboard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Cost ($)</label>
                  <input
                    type="number"
                    placeholder="4500"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Targeting west coast beverage retailers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow-md shadow-brand-500/20"
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
