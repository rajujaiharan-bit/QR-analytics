import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios.js';
import { LandingPagePreview } from '../components/landing/LandingPagePreview.js';
import { LandingPage } from '../types/index.js';

export const PublicLandingView: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await api.get(`/r/${shortCode}?json=true`);
        if (res.data.landingPage) {
          setPage(res.data.landingPage);
        } else if (res.data.destinationUrl) {
          window.location.href = res.data.destinationUrl;
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading dynamic landing page');
        setLoading(false);
      }
    };
    fetchLandingData();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
        Redirecting & Processing QR Analytics...
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
        <h2 className="text-xl font-bold">QR Campaign Unavailable</h2>
        <p className="text-xs text-gray-400 max-w-sm">{error || 'This QR Code target is unavailable.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LandingPagePreview page={page} />
      </div>
    </div>
  );
};
