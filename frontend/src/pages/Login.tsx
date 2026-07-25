import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to sign in. Please check credentials or backend status.');
    }
  };

  const fillDemoUser = async () => {
    setEmail('demo@qrads.com');
    setPassword('Password123!');
    setLoading(true);
    setError('');
    try {
      await login('demo@qrads.com', 'Password123!');
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to sign in as Demo user');
    }
  };

  const fillAdminUser = async () => {
    setEmail('admin@qrads.com');
    setPassword('Password123!');
    setLoading(true);
    setError('');
    try {
      await login('admin@qrads.com', 'Password123!');
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to sign in as Admin user');
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl border border-gray-800 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-brand-500/20">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to your QR Advertising Analytics Dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                placeholder="name@company.com"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div className="pt-4 border-t border-gray-800/80 space-y-2 text-center">
          <span className="text-[11px] text-gray-500 font-medium block">⚡ Instant 1-Click Demo Login</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={fillDemoUser}
              disabled={loading}
              className="flex-1 py-2 px-3 rounded-xl bg-gray-800/60 hover:bg-gray-800 text-gray-300 text-[11px] font-semibold border border-gray-700 transition-colors"
            >
              Demo Advertiser
            </button>
            <button
              type="button"
              onClick={fillAdminUser}
              disabled={loading}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 text-[11px] font-semibold border border-purple-800/50 transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
