import React from 'react';
import { LandingPage } from '../../types/index.js';
import { Phone, Mail, MapPin, ExternalLink, Instagram, Share2, Sparkles } from 'lucide-react';

interface LandingPagePreviewProps {
  page: LandingPage;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ page }) => {
  return (
    <div className="relative w-full max-w-[340px] h-[640px] bg-slate-950 rounded-[48px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
        <div className="w-10 h-1 bg-slate-900 rounded-full" />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 overflow-y-auto pt-8 pb-6 px-5 space-y-4 transition-colors"
        style={{ backgroundColor: page.backgroundColor || '#0F172A', color: page.textColor || '#F8FAFC' }}
      >
        {/* Brand Header */}
        <div className="flex items-center space-x-3 pt-2">
          {page.brandLogo ? (
            <img src={page.brandLogo} alt={page.brandName} className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/40" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
              {page.brandName.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold leading-tight">{page.brandName}</h4>
            <span className="text-[10px] opacity-70">Official Promotion</span>
          </div>
        </div>

        {/* Hero Banner Image */}
        {page.bannerImage && (
          <div className="w-full h-36 rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <img src={page.bannerImage} alt="Banner" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Main Copy */}
        <div className="space-y-1.5 text-center pt-2">
          <h2 className="text-base font-extrabold leading-snug">{page.heading}</h2>
          {page.subheading && <p className="text-xs opacity-80 font-medium">{page.subheading}</p>}
        </div>

        {page.description && (
          <p className="text-xs opacity-75 text-center leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
            {page.description}
          </p>
        )}

        {/* Primary CTA */}
        <div className="pt-2">
          <a
            href={page.primaryButtonLink}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white text-xs font-extrabold rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <span>{page.primaryButtonText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Secondary CTA */}
        {page.secondaryButtonText && page.secondaryButtonLink && (
          <div>
            <a
              href={page.secondaryButtonLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-2xl border border-white/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>{page.secondaryButtonText}</span>
            </a>
          </div>
        )}

        {/* Contact Info Footer */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] opacity-80">
          {page.phoneNumber && (
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>{page.phoneNumber}</span>
            </div>
          )}
          {page.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              <span>{page.email}</span>
            </div>
          )}
          {page.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>{page.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Phone Home Bar */}
      <div className="h-6 bg-slate-950 flex items-center justify-center">
        <div className="w-24 h-1 bg-slate-700 rounded-full" />
      </div>
    </div>
  );
};
