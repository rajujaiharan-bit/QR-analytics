import React from 'react';
import { AIInsightItem } from '../../types/index.js';
import { Sparkles, Clock, Smartphone, MapPin, TrendingUp, Zap } from 'lucide-react';

interface AIInsightsCardProps {
  insights: AIInsightItem[];
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'peak_time':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'device_trend':
        return <Smartphone className="w-4 h-4 text-brand-500" />;
      case 'location_spike':
        return <MapPin className="w-4 h-4 text-rose-500" />;
      case 'roi_tip':
        return <Zap className="w-4 h-4 text-emerald-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">AI Advertising Insights</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Real-time machine recommendation engine</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-extrabold uppercase tracking-wider">
          AI Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800/60 flex items-start space-x-3 hover:border-brand-500/30 transition-all"
          >
            <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm shrink-0">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 shrink-0 ml-2">
                  {item.metric}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
