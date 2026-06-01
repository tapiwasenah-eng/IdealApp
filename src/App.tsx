import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useStore } from './store'
import { seedTemplates, seedInvestors } from './lib/seedData'
import { useAuthAccess } from './hooks/useAuthAccess'

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'))
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'))
const PerksPage = lazy(() => import('./pages/PerksPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const EditorPage = lazy(() => import('./pages/EditorPage'))
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'))
const TemplateDetailPage = lazy(() => import('./pages/TemplateDetailPage'))
const TutorialsPage = lazy(() => import('./pages/TutorialsPage'))
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'))
import { DashboardAnalytics } from './pages/dashboard/DashboardAnalytics';
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const DocumentWizard = lazy(() => import('./components/wizard/DocumentWizard'))
const GenerateDocumentPage = lazy(() => import('./pages/GenerateDocumentPage'))
const OnboardingFlow = lazy(() => import('./pages/onboarding/OnboardingFlow'))
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })))
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview').then(m => ({ default: m.DashboardOverview })))
const DashboardDocuments = lazy(() => import('./pages/dashboard/DashboardDocuments').then(m => ({ default: m.DashboardDocuments })))
const DashboardTemplates = lazy(() => import('./pages/dashboard/DashboardTemplates').then(m => ({ default: m.DashboardTemplates })))
const CompanyDNAEditor = lazy(() => import('./pages/dashboard/CompanyDNAEditor').then(m => ({ default: m.CompanyDNAEditor })))
const DocumentWorkspaceLayout = lazy(() => import('./pages/workspace/DocumentWorkspaceLayout').then(m => ({ default: m.DocumentWorkspaceLayout })))
const InvestorExplorerPage = lazy(() => import('./pages/dashboard/investors/InvestorExplorerPage').then(m => ({ default: m.InvestorExplorerPage })))
const OutreachTrackerPage = lazy(() => import('./pages/dashboard/outreach/OutreachTrackerPage').then(m => ({ default: m.OutreachTrackerPage })))

const DataRoomPage = lazy(() => import('./pages/dashboard/dataroom/DataRoomPage').then(m => ({ default: m.DataRoomPage })))
const InvestorDataRoomView = lazy(() => import('./pages/public/InvestorDataRoomView').then(m => ({ default: m.InvestorDataRoomView })))
const PricingPage = lazy(() => import('./pages/dashboard/billing/PricingPage').then(m => ({ default: m.PricingPage })))

// Lazy Load Public Pages
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const BlogPage = lazy(() => import('./pages/public/BlogPage'))
const PressPage = lazy(() => import('./pages/public/PressPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/public/TermsPage'))
const CookiesPage = lazy(() => import('./pages/public/CookiesPage'))
const SecurityPage = lazy(() => import('./pages/public/SecurityPage'))
const ChangelogPage = lazy(() => import('./pages/public/ChangelogPage'))
const InvestorsPublicPage = lazy(() => import('./pages/public/InvestorsPublicPage'))

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthModal from './components/auth/AuthModal'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { SuperAdminDashboard } from './components/Dashboard/SuperAdminDashboard'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);
}

function TrackingHandler() {
  usePageTracking();
  return null;
}

export default function App() {
  const { showAuthModal } = useStore()
  useAuthAccess()

  // Seed data strictly in development or via admin trigger
  useEffect(() => {
    if (import.meta.env.DEV) {
      seedTemplates()
      seedInvestors()
    }
    // Fire render event for pre-rendering
    document.dispatchEvent(new Event('render-event'));
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <TrackingHandler />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#111827',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
            },
          }}
        />

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => useStore.getState().setShowAuthModal(false)}
          />
        )}

        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div></div>}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/data-room-demo" element={<Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div></div>}><InvestorDataRoomView /></Suspense>} />
            <Route path="/r/:roomId" element={<Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div></div>}><InvestorDataRoomView /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div></div>}><PricingPage /></Suspense>} />

            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/perks" element={<PerksPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:id" element={<TemplateDetailPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/investors" element={<InvestorsPublicPage />} />

            {/* Protected pages */}
            <Route path="/documents/:documentId" element={<ProtectedRoute><DocumentWorkspaceLayout /></ProtectedRoute>} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path="dna" element={<CompanyDNAEditor />} />
              <Route path="documents" element={<DashboardDocuments />} />
              <Route path="templates" element={<DashboardTemplates />} />
              <Route path="data-room" element={<DataRoomPage />} />
              <Route path="investors" element={<InvestorExplorerPage />} />
              <Route path="outreach" element={<OutreachTrackerPage />} />
              {/* Other dashboard routes will go here later */}
              <Route path="analytics" element={<DashboardAnalytics />} />
              <Route path="settings" element={<SettingsPage inDashboard />} />
              <Route path="*" element={
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
                    <p className="text-slate-500">The dashboard page you're looking for doesn't exist or is currently unavailable.</p>
                  </div>
                </div>
              } />
            </Route>

            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <GenerateDocumentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <GenerateDocumentPage />
                </ProtectedRoute>
              }
            />
            <Route
               path="/consultant"
               element={
                 <ProtectedRoute>
                   <GenerateDocumentPage />
                 </ProtectedRoute>
               }
             />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:documentId"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
