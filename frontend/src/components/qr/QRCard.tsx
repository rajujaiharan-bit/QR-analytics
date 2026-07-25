import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeItem } from '../../types/index.js';
import {
  Download,
  BarChart2,
  Copy,
  Star,
  Trash2,
  Edit,
  ExternalLink,
  Share2,
  Calendar,
  Eye,
  Activity,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QRCardProps {
  qr: QRCodeItem;
  onEdit: (qr: QRCodeItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onFavoriteToggle: (qr: QRCodeItem) => void;
}

export const QRCard: React.FC<QRCardProps> = ({ qr, onEdit, onDelete, onDuplicate, onFavoriteToggle }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const backendUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001';
  const shortRedirectUrl = `${backendUrl}/r/${qr.shortCode}`;

  const downloadPNG = () => {
    const svg = document.getElementById(`qr-svg-${qr._id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = qr.bgColor || '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 400, 400);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${qr.name.replace(/\s+/g, '_')}_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group relative transition-all duration-200">
      <div>
        {/* Top Header & Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
            {qr.category || 'Packaging'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFavoriteToggle(qr)}
              className={`p-1 rounded-lg transition-colors ${
                qr.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400 hover:text-amber-400'
              }`}
            >
              <Star className="w-4 h-4" />
            </button>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                qr.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : qr.status === 'paused'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {qr.status}
            </span>
          </div>
        </div>

        {/* QR Vector Preview & Meta */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-inner flex items-center justify-center">
            <QRCodeSVG
              id={`qr-svg-${qr._id}`}
              value={shortRedirectUrl}
              size={85}
              fgColor={qr.fgColor || '#000000'}
              bgColor={qr.bgColor || '#FFFFFF'}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={qr.name}>
              {qr.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{qr.brandName}</p>
            {qr.campaign && (
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium truncate mt-0.5">
                Campaign: {qr.campaign.name}
              </p>
            )}
            <div className="flex items-center space-x-1 text-[11px] text-gray-400 mt-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Metrics Pill Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-brand-500" />
            <div>
              <span className="block text-[10px] text-gray-400 uppercase font-semibold">Total Scans</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{qr.totalScans}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-3.5 h-3.5 text-accent-500" />
            <div>
              <span className="block text-[10px] text-gray-400 uppercase font-semibold">Unique Visitors</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{qr.uniqueVisitors}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Destination Link Preview */}
        <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-gray-100 dark:bg-gray-800/80 font-mono text-gray-600 dark:text-gray-400 truncate">
          <span className="truncate">{qr.destinationUrl}</span>
          <a
            href={shortRedirectUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand-500 hover:text-brand-600 ml-2 flex items-center shrink-0"
            title="Test Dynamic QR Redirection"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Card Footer Action Bar */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center space-x-1">
          <button
            onClick={downloadPNG}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Download PNG QR"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(qr)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Edit Dynamic URL"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(qr._id)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Duplicate QR"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(qr._id)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Delete QR"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <Link
          to={`/qr/${qr._id}`}
          className="px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </Link>
      </div>
    </div>
  );
};
