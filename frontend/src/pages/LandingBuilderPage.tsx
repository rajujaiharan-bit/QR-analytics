import React, { useEffect, useState } from 'react';
import { LandingPageBuilder } from '../components/landing/LandingPageBuilder.js';
import { api } from '../api/axios.js';
import { LandingPage } from '../types/index.js';
import { Layout, Plus, Trash2, ExternalLink } from 'lucide-react';

export const LandingBuilderPage: React.FC = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);

  const fetchLandingPages = async () => {
    try {
      const res = await api.get('/api/landing-pages');
      setPages(res.data.landingPages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLandingPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this landing page?')) {
      try {
        await api.delete(`/api/landing-pages/${id}`);
        fetchLandingPages();
      } catch (err) {
        alert('Failed to delete landing page');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Custom Landing Page Builder</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Build mobile-optimized promo pages linked dynamically to physical product QRs
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showBuilder ? 'View Saved Pages' : 'Create New Landing Page'}</span>
        </button>
      </div>

      {showBuilder ? (
        <LandingPageBuilder
          onSuccess={() => {
            setShowBuilder(false);
            fetchLandingPages();
          }}
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Saved Landing Pages</h3>
          {pages.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-xs text-gray-500">
              No custom landing pages created yet. Click "Create New Landing Page" above to build your first offer page.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((p) => (
                <div key={p._id} className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand-500">{p.brandName}</span>
                      <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{p.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{p.heading}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-400">Primary CTA: {p.primaryButtonText}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
