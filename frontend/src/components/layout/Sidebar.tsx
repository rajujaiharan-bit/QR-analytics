import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  QrCode,
  BarChart3,
  PieChart,
  Layout,
  User,
  ShieldCheck,
  Zap,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface SidebarProps {
  onOpenApiDocs?: () => void;
  onOpenNewQR?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenApiDocs, onOpenNewQR }) => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My QR Codes', path: '/qr-codes', icon: QrCode },
    { label: 'Campaign ROI', path: '/campaign-roi', icon: PieChart, badge: 'ROI Engine' },
    { label: 'Analytics Hub', path: '/analytics', icon: BarChart3 },
    { label: 'Landing Builder', path: '/landing-builder', icon: Layout },
    { label: 'Profile & Account', path: '/profile', icon: User }
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: ShieldCheck, badge: 'Admin' });
  }

  return (
    <aside className="w-64 bg-white dark:bg-[#0C121E] border-r border-gray-200 dark:border-gray-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-500 to-cyan-400 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold bg-gradient-to-r from-gray-900 via-brand-600 to-accent-600 dark:from-white dark:via-gray-100 dark:to-brand-400 bg-clip-text text-transparent">
                QR Advert
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">
                Analytics SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={onOpenNewQR}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New QR</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & API Docs Link */}
      <div className="p-4 border-t border-gray-200/80 dark:border-gray-800/80 space-y-3">
        <button
          onClick={onOpenApiDocs}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/40"
        >
          <BookOpen className="w-4 h-4" />
          <span>API Documentation</span>
        </button>

        <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-gray-50 dark:bg-[#111827] border border-gray-200/60 dark:border-gray-800/60">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize truncate">{user?.subscription.plan} Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
