import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthAccess } from '../hooks/useAuthAccess';

import { FirstSessionWizard } from '../components/dashboard/FirstSessionWizard';
import { DocumentWizard } from '../components/wizard/DocumentWizard';
import { AuraVoiceGate } from '../components/aura/AuraVoiceGate';

// Lazy load pages
const HomePage = lazy(() => import('../pages/HomePage'));
const DocumentPage = lazy(() => import('../pages/DocumentPage'));
const DataRoomPage = lazy(() => import('../pages/DataRoomPage'));
const InvestorExplorerPage = lazy(() => import('../pages/InvestorExplorerPage'));
const OutreachTrackerPage = lazy(() => import('../pages/OutreachTrackerPage'));
const TemplatesPage = lazy(() => import('../pages/TemplatesPage'));
const TemplateDetailPage = lazy(() => import('../pages/TemplateDetailPage'));
const CommunityTemplatesGallery = lazy(() => import('../pages/templates/CommunityTemplatesGallery'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const DocumentsSpacePage = lazy(() => import('../pages/DocumentsSpacePage'));
const PublicDocumentView = lazy(() => import('../pages/public/PublicDocumentView'));

import { DashboardLayout } from '../pages/dashboard/DashboardLayout';
import { DashboardOverview } from '../pages/dashboard/DashboardOverview';
import { CompanyDNAEditor } from '../pages/dashboard/CompanyDNAEditor';
import { DashboardAnalytics } from '../pages/dashboard/DashboardAnalytics';

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-obsidian">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-space-indigo border-t-transparent" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((state) => state.user);
  const authInitialized = useAppStore((state) => state.authInitialized);

  if (!authInitialized) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  useAuthAccess();

  return (
    <Suspense fallback={<Spinner />}>
      <AuraVoiceGate />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<Navigate to="/auth?mode=signup" />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/wizard" element={<ProtectedRoute><DocumentWizard /></ProtectedRoute>} />
        <Route path="/templates/community" element={<CommunityTemplatesGallery />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateDetailPage />} />
        
        {/* Public Distriubtion Links */}
        <Route path="/view/:id" element={<PublicDocumentView />} />
        
        <Route path="/app" element={<Navigate to="/dashboard/documents" />} />
        
        {/* Dashboard Layout Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardOverview />} />
          <Route path="dna" element={<CompanyDNAEditor />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="documents" element={<DocumentsSpacePage />} />
          <Route path="documents/:id" element={<DocumentPage />} />
          <Route path="data-room" element={<DataRoomPage />} />
          <Route path="investors" element={<InvestorExplorerPage />} />
          <Route path="outreach" element={<OutreachTrackerPage />} />
          <Route path="templates/*" element={<Navigate to="/templates" replace />} />
        </Route>
        
        {/* Top-level aliases for backwards compatibility if needed, or remove them */}
        <Route path="/data-room" element={<Navigate to="/dashboard/data-room" replace />} />
        <Route path="/investors" element={<Navigate to="/dashboard/investors" replace />} />
        <Route path="/outreach" element={<Navigate to="/dashboard/outreach" replace />} />

        <Route path="*" element={<HomePage />} />
      </Routes>
      <FirstSessionWizard />
    </Suspense>
  );
}
