import React, { useState } from 'react';
import { LandingPage } from '../../types/index.js';
import { api } from '../../api/axios.js';
import { Layout, Save, Sparkles, Image as ImageIcon, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { LandingPagePreview } from './LandingPagePreview.js';

interface LandingPageBuilderProps {
  onSuccess?: () => void;
}

export const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [description, setDescription] = useState('');
  const [primaryButtonText, setPrimaryButtonText] = useState('Claim Free Offer');
  const [primaryButtonLink, setPrimaryButtonLink] = useState('https://');
  const [secondaryButtonText, setSecondaryButtonText] = useState('');
  const [secondaryButtonLink, setSecondaryButtonLink] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#0F172A');
  const [textColor, setTextColor] = useState('#F8FAFC');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [instagram, setInstagram] = useState('');

  const [loading, setLoading] = useState(false);

  const previewData: LandingPage = {
    _id: 'preview_id',
    title: title || 'Page Title Preview',
    brandName: brandName || 'Brand Name',
    brandLogo: brandLogo || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=150&q=80',
    heading: heading || 'Scan & Win Free Refreshment Pack!',
    subheading: subheading || 'Thank you for scanning our product QR label.',
    description: description || 'Enter your coupon code or click below to redeem your exclusive gift.',
    primaryButtonText: primaryButtonText || 'Redeem Offer',
    primaryButtonLink: primaryButtonLink || 'https://example.com',
    secondaryButtonText,
    secondaryButtonLink,
    bannerImage: bannerImage || 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    backgroundColor,
    textColor,
    phoneNumber,
    email,
    location,
    socialLinks: { instagram }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !brandName || !heading || !primaryButtonLink) {
      alert('Please fill in Page Title, Brand Name, Heading, and Primary Button Link.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/landing-pages', {
        title,
        brandName,
        brandLogo,
        heading,
        subheading,
        description,
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText,
        secondaryButtonLink,
        bannerImage,
        backgroundColor,
        textColor,
        phoneNumber,
        email,
        location,
        socialLinks: { instagram }
      });
      setLoading(false);
      alert('Landing Page created successfully!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      alert(err.response?.data?.message || 'Failed to save landing page');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Editor Controls Column */}
      <div className="lg:col-span-7 space-y-4">
        <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Layout className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Landing Page Studio</h3>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-brand-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Page...' : 'Publish Landing Page'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Page Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer Soda Rewards"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. AquaPure"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Main Heading *</label>
            <input
              type="text"
              required
              placeholder="e.g. Scan & Win $500 Refreshment Voucher!"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Subheading / Description</label>
            <textarea
              rows={3}
              placeholder="Welcome! Enter your contact details to redeem exclusive discounts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary CTA Button Text *</label>
              <input
                type="text"
                required
                value={primaryButtonText}
                onChange={(e) => setPrimaryButtonText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary CTA Link *</label>
              <input
                type="url"
                required
                value={primaryButtonLink}
                onChange={(e) => setPrimaryButtonLink(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Banner Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand Logo URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={brandLogo}
                onChange={(e) => setBrandLogo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (800) 555-AQUA"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="info@brand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                type="text"
                placeholder="Los Angeles, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Live Interactive Mobile Phone Mockup Preview */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full max-w-sm">
          <div className="mb-2 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-500">
              📱 Live Mobile Device Preview
            </span>
          </div>
          <LandingPagePreview page={previewData} />
        </div>
      </div>
    </div>
  );
};
