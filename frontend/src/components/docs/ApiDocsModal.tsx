import React from 'react';
import { X, BookOpen, Terminal, Code, CheckCircle, ShieldAlert } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const endpoints = [
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user & issue JWT token' },
    { method: 'POST', path: '/api/auth/register', desc: 'Register a new advertiser account' },
    { method: 'GET', path: '/r/:shortCode', desc: 'Dynamic QR redirection controller & scan tracking engine' },
    { method: 'POST', path: '/api/qr', desc: 'Generate a new dynamic QR code with custom styling' },
    { method: 'POST', path: '/api/qr/bulk', desc: 'Batch generate dynamic QRs via CSV array' },
    { method: 'GET', path: '/api/qr', desc: 'Fetch user QR inventory with search & status filters' },
    { method: 'GET', path: '/api/campaigns/roi-comparison', desc: 'Fetch side-by-side Campaign ROI metrics' },
    { method: 'GET', path: '/api/analytics/dashboard', desc: 'Retrieve aggregated dashboard KPIs & AI Insights' },
    { method: 'GET', path: '/api/export/scans/csv', desc: 'Export scan analytics report as downloadable CSV' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0C121E] w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">API & Dynamic QR Integration Documentation</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300">
            <h4 className="font-bold mb-1 flex items-center space-x-1">
              <Terminal className="w-4 h-4" />
              <span>Base URL & Dynamic Redirection</span>
            </h4>
            <p>
              Base API Endpoint: <code className="font-mono bg-white/40 dark:bg-black/40 px-1 py-0.5 rounded">http://localhost:5000/api</code>
            </p>
            <p className="mt-1">
              Short Redirect Format: <code className="font-mono bg-white/40 dark:bg-black/40 px-1 py-0.5 rounded">http://localhost:5000/r/:shortCode</code>
            </p>
          </div>

          <h4 className="font-bold text-gray-900 dark:text-white">Available REST API Endpoints</h4>
          <div className="space-y-2">
            {endpoints.map((ep, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-extrabold text-[10px] ${
                      ep.method === 'GET'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="font-mono font-semibold text-gray-900 dark:text-white">{ep.path}</code>
                </div>
                <span className="text-gray-500 dark:text-gray-400">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs">
            Close API Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
