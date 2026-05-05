import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useStore } from './store'
import { seedTemplates, seedInvestors } from './lib/seedData'
import { useAuthAccess } from './hooks/useAuthAccess'

// Pages
import HomePage from './pages/HomePage'
import SolutionsPage from './pages/SolutionsPage'
import FeaturesPage from './pages/FeaturesPage'
import PerksPage from './pages/PerksPage'
import PricingPage from './pages/PricingPage'
import DashboardPage from './pages/DashboardPage'
import EditorPage from './pages/EditorPage'
import TemplatesPage from './pages/TemplatesPage'
import TutorialsPage from './pages/TutorialsPage'
import DocumentationPage from './pages/DocumentationPage'
import SettingsPage from './pages/SettingsPage'
import AuthPage from './pages/AuthPage'
import CheckoutPage from './pages/CheckoutPage'
import NotFoundPage from './pages/NotFoundPage'
import DocumentWizard from './components/wizard/DocumentWizard'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthModal from './components/auth/AuthModal'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { SuperAdminDashboard } from './components/Dashboard/SuperAdminDashboard'

import AboutPage from './pages/public/AboutPage';
import BlogPage from './pages/public/BlogPage';
import PressPage from './pages/public/PressPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import CookiesPage from './pages/public/CookiesPage';
import SecurityPage from './pages/public/SecurityPage';
import ChangelogPage from './pages/public/ChangelogPage';
import InvestorsPublicPage from './pages/public/InvestorsPublicPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { setUser, setLoading, showAuthModal } = useStore()
  useAuthAccess()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsub
  }, [setUser, setLoading])

  // Seed data strictly in development or via admin trigger
  useEffect(() => {
    if (import.meta.env.DEV) {
      seedTemplates()
      seedInvestors()
    }
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
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

        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<DocumentWizard />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/perks" element={<PerksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/auth" element={<AuthPage />} />
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
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
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
      </BrowserRouter>
    </ErrorBoundary>
  )
}
