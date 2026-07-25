import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';
import { api } from '../../api/axios.js';

interface BulkQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkQRModal: React.FC<BulkQRModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [csvText, setCsvText] = useState(
    `Name,Brand,DestinationURL,Category\nBottle Label 1,AquaPure,https://aquapure.com/1,Bottle Print\nBottle Label 2,AquaPure,https://aquapure.com/2,Bottle Print\nPackaging Box A,AquaPure,https://aquapure.com/box,Packaging`
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBulkSubmit = async () => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      alert('Please provide CSV data with a header and at least one item line.');
      return;
    }

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 3) {
        items.push({
          name: parts[0].trim(),
          brandName: parts[1].trim(),
          destinationUrl: parts[2].trim(),
          category: parts[3] ? parts[3].trim() : 'Bulk Created'
        });
      }
    }

    if (items.length === 0) {
      alert('No valid rows found in CSV data.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/qr/bulk', { items });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      alert(err.response?.data?.message || 'Error executing bulk generation');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0C121E] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Bulk QR Generator</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 text-xs space-y-3">
          <p className="text-gray-600 dark:text-gray-300">
            Paste or edit CSV rows below (Format: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Name,Brand,DestinationURL,Category</code>):
          </p>

          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleBulkSubmit}
            disabled={loading}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20"
          >
            {loading ? 'Processing Bulk...' : 'Batch Generate QRs'}
          </button>
        </div>
      </div>
    </div>
  );
};
