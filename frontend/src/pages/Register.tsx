import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Lock, Mail, User, Building, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [businessType, setBusinessType] = useState('Beverage & Bottling');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password, company, businessType);
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      const serverMsg = err.response?.data?.message || err.message;
      if (serverMsg && serverMsg.includes('already exists')) {
        setError('An account with this email already exists. Please Sign In below.');
      } else {
        setError(serverMsg || 'Failed to create account. Please try another email or check credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl border border-gray-800 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-brand-500/20">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Create Advertiser Account</h2>
          <p className="text-xs text-gray-400">Deploy & track dynamic QR codes across product labels</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                required
                placeholder="Marcus Sterling"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                placeholder="marcus@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-300 mb-1">Company Name</label>
              <input
                type="text"
                placeholder="AquaPure Co."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-300 mb-1">Industry</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="Beverage & Bottling">Beverage & Bottling</option>
                <option value="Consumer Goods">Consumer Goods</option>
                <option value="Retail & Packaging">Retail & Packaging</option>
                <option value="Event Marketing">Event Marketing</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
