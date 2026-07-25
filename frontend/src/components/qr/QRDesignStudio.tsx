import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Sparkles, Image as ImageIcon, Palette, Sliders, Globe, Layers } from 'lucide-react';
import { api } from '../../api/axios.js';
import { Campaign, LandingPage } from '../../types/index.js';

interface QRDesignStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QRDesignStudio: React.FC<QRDesignStudioProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');

  // Form State
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [destinationType, setDestinationType] = useState<string>('website');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [landingPageId, setLandingPageId] = useState('');

  // Design State
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [frameStyle, setFrameStyle] = useState<'square' | 'dots' | 'rounded' | 'gradient' | 'bordered'>('rounded');
  const [logoUrl, setLogoUrl] = useState('');
  const [category, setCategory] = useState('Bottle Print');

  // Constraints
  const [expiryDate, setExpiryDate] = useState('');
  const [maxScanLimit, setMaxScanLimit] = useState('');

  // Loaded Options
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownOptions();
    }
  }, [isOpen]);

  const fetchDropdownOptions = async () => {
    try {
      const [cRes, lRes] = await Promise.all([
        api.get('/api/campaigns'),
        api.get('/api/landing-pages')
      ]);
      setCampaigns(cRes.data.campaigns || []);
      setLandingPages(lRes.data.landingPages || []);
    } catch (err) {
      console.error('Failed to fetch studio dropdown options');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brandName || (!destinationUrl && destinationType !== 'landing_page')) {
      alert('Please fill in Name, Brand Name, and Destination URL');
      return;
    }

    let cleanUrl = destinationUrl.trim();
    if (cleanUrl) {
      cleanUrl = cleanUrl.replace(/^(https?:\/\/)+/i, 'https://');
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = `https://${cleanUrl}`;
      }
    }

    setLoading(true);
    try {
      await api.post('/api/qr', {
        name,
        brandName,
        description,
        destinationType,
        destinationUrl: cleanUrl || 'https://google.com',
        campaignId: campaignId || undefined,
        landingPageId: landingPageId || undefined,
        fgColor,
        bgColor,
        frameStyle,
        logoUrl,
        category,
        expiryDate: expiryDate || undefined,
        maxScanLimit: maxScanLimit ? parseInt(maxScanLimit, 10) : undefined
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      alert(err.response?.data?.message || 'Error generating QR Code');
    }
  };

  // Real-time canvas value: encodes destination URL directly or dynamic short code
  const getLiveCanvasValue = () => {
    if (destinationUrl && destinationUrl.trim().length > 0) {
      let u = destinationUrl.trim().replace(/^(https?:\/\/)+/i, 'https://');
      if (!u.startsWith('http://') && !u.startsWith('https://')) {
        u = `https://${u}`;
      }
      return u;
    }
    return `${window.location.origin}/r/preview`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0C121E] w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Input Form Panel */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
          <div>
            {/* Modal Title */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">QR Code Design Studio</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Generate high-converting dynamic QR codes</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 my-4 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === 'content'
                    ? 'bg-white dark:bg-[#111827] text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>1. Content</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === 'design'
                    ? 'bg-white dark:bg-[#111827] text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>2. Styling</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-[#111827] text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>3. Options</span>
              </button>
            </div>

            {/* Tab 1: Content */}
            {activeTab === 'content' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">QR Code Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Citrus Soda 500ml Bottle Label"
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
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Bottle Print">Bottle Print</option>
                      <option value="Packaging">Packaging & Box</option>
                      <option value="Flyer & Poster">Flyer & Poster</option>
                      <option value="Retail Display">Retail Display</option>
                      <option value="Digital Media">Digital Media</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Destination Type</label>
                  <select
                    value={destinationType}
                    onChange={(e) => setDestinationType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
                  >
                    <option value="website">Website URL</option>
                    <option value="landing_page">Custom Built Landing Page</option>
                    <option value="pdf">PDF Product Catalog</option>
                    <option value="video">Promotional Video</option>
                    <option value="google_form">Google Form / Survey</option>
                    <option value="contact_card">VCard Contact Card</option>
                    <option value="instagram">Instagram Profile</option>
                    <option value="whatsapp">WhatsApp Direct Chat</option>
                  </select>
                </div>

                {destinationType === 'landing_page' ? (
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Custom Landing Page</label>
                    <select
                      value={landingPageId}
                      onChange={(e) => setLandingPageId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">-- Choose Landing Page --</option>
                      {landingPages.map((lp) => (
                        <option key={lp._id} value={lp._id}>
                          {lp.title} ({lp.brandName})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Destination URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://yourbrand.com/promo"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Assign to Campaign (Optional)</label>
                  <select
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">-- Standalone (No Campaign) --</option>
                    {campaigns.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.brand})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Tab 2: Design */}
            {activeTab === 'design' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">QR Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0"
                      />
                      <span className="font-mono text-gray-600 dark:text-gray-400">{fgColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Background Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0"
                      />
                      <span className="font-mono text-gray-600 dark:text-gray-400">{bgColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Frame Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['square', 'rounded', 'dots', 'gradient'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setFrameStyle(style)}
                        className={`py-2 rounded-xl capitalize font-semibold border transition-all ${
                          frameStyle === style
                            ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                            : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand Logo Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://yourbrand.com/logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Logo will be embedded inside the center of the QR code canvas.</p>
                </div>
              </div>
            )}

            {/* Tab 3: Settings & Limits */}
            {activeTab === 'settings' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Maximum Scan Threshold (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={maxScanLimit}
                    onChange={(e) => setMaxScanLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20"
            >
              {loading ? 'Generating...' : 'Save & Publish QR'}
            </button>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="w-full md:w-80 bg-gray-50 dark:bg-[#090D16] p-6 flex flex-col items-center justify-center border-t md:border-t-0 border-gray-200 dark:border-gray-800">
          <div className="text-center mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
              Live Vector Preview
            </span>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-white truncate max-w-[220px]">
              {name || 'Dynamic QR Code'}
            </h4>
            <p className="text-[11px] text-gray-500 truncate max-w-[200px]">{brandName || 'Brand Preview'}</p>
          </div>

          {/* QR Preview Box */}
          <div
            className={`p-6 rounded-3xl shadow-xl transition-all duration-300 flex flex-col items-center ${
              frameStyle === 'gradient'
                ? 'bg-gradient-to-tr from-brand-500 to-indigo-600 p-[2px]'
                : frameStyle === 'bordered'
                ? 'border-4 border-brand-500'
                : ''
            }`}
          >
            <div
              className="p-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <QRCodeSVG
                value={getLiveCanvasValue()}
                size={180}
                fgColor={fgColor}
                bgColor={bgColor}
                imageSettings={
                  logoUrl
                    ? {
                        src: logoUrl,
                        x: undefined,
                        y: undefined,
                        height: 36,
                        width: 36,
                        excavate: true
                      }
                    : undefined
                }
              />
            </div>
          </div>

          <div className="mt-4 text-center space-y-1">
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              ⚡ Live Phone Scannable
            </span>
            <p className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">{destinationUrl || '/r/preview'}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
