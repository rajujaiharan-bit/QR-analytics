import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { Navbar } from './components/layout/Navbar.js';

import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { Dashboard } from './pages/Dashboard.js';
import { QRCodesList } from './pages/QRCodesList.js';
import { QRDetails } from './pages/QRDetails.js';
import { CampaignROIDashboardPage } from './pages/CampaignROIDashboardPage.js';
import { AnalyticsViewPage } from './pages/AnalyticsViewPage.js';
import { LandingBuilderPage } from './pages/LandingBuilderPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { PublicLandingView } from './pages/PublicLandingView.js';

import { QRDesignStudio } from './components/qr/QRDesignStudio.js';
import { BulkQRModal } from './components/qr/BulkQRModal.js';
import { ApiDocsModal } from './components/docs/ApiDocsModal.js';

export const App: React.FC = () => {
  const { user, loading } = useAuth();

  const [showStudioModal, setShowStudioModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showApiDocsModal, setShowApiDocsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-white text-xs">
        Initializing QR Advertising Platform...
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Dynamic Landing Pages */}
        <Route path="/p/:shortCode" element={<PublicLandingView />} />

        {/* Global Access - Direct Dashboard Navigation */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex bg-gray-50 dark:bg-[#090D16] text-gray-900 dark:text-gray-100 transition-colors duration-200">
              <Sidebar
                onOpenApiDocs={() => setShowApiDocsModal(true)}
                onOpenNewQR={() => setShowStudioModal(true)}
              />
              <div className="flex-1 flex flex-col min-w-0">
                <Navbar onSearchChange={(t) => setSearchTerm(t)} />
                <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/register" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard onOpenNewQR={() => setShowStudioModal(true)} />} />
                    <Route
                      path="/qr-codes"
                      element={
                        <QRCodesList
                          onOpenNewQR={() => setShowStudioModal(true)}
                          onOpenBulkModal={() => setShowBulkModal(true)}
                          searchTerm={searchTerm}
                        />
                      }
                    />
                    <Route path="/qr/:id" element={<QRDetails />} />
                    <Route path="/campaign-roi" element={<CampaignROIDashboardPage />} />
                    <Route path="/analytics" element={<AnalyticsViewPage />} />
                    <Route path="/landing-builder" element={<LandingBuilderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>

      {/* Global Modals */}
      <QRDesignStudio
        isOpen={showStudioModal}
        onClose={() => setShowStudioModal(false)}
        onSuccess={() => window.location.reload()}
      />

      <BulkQRModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccess={() => window.location.reload()}
      />

      <ApiDocsModal
        isOpen={showApiDocsModal}
        onClose={() => setShowApiDocsModal(false)}
      />
    </>
  );
};
