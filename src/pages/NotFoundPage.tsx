import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Home, ArrowLeft, FileX } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <SEOHead
        title="404 — Page Not Found | Ideal App"
        description="The page you are looking for does not exist."
        noIndex={true}
      />
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          {/* Illustration area */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-12"
          >
            <div className="relative w-48 h-48 mx-auto">
              {/* Background circle */}
              <div className="absolute inset-0 bg-blue-50 rounded-full" />
              {/* Decorative circles */}
              <div className="absolute top-2 right-4 w-8 h-8 bg-blue-100 rounded-full" />
              <div className="absolute bottom-4 left-2 w-5 h-5 bg-purple-100 rounded-full" />
              {/* Main icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-5">
                  <FileX className="w-16 h-16 text-[#3B82F6]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 404 number */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-6xl md:text-8xl font-black text-[#E5E7EB] leading-none mb-4"
          >
            404
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-2xl md:text-3xl font-black text-[#111827] mb-4"
          >
            Page not found
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="text-[#6B7280] mb-10 max-w-sm mx-auto leading-relaxed"
          >
            The page you're looking for doesn't exist or has been moved. Let's get you back on
            track.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-[#3B82F6] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 border border-[#E5E7EB] text-[#374151] px-8 py-3.5 rounded-xl font-semibold hover:bg-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={5}
            variants={fadeUp}
            className="mt-12 pt-8 border-t border-[#E5E7EB]"
          >
            <p className="text-sm text-[#9CA3AF] mb-4">You might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Templates', path: '/solutions' },
                { label: 'Features', path: '/features' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'Dashboard', path: '/dashboard' },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="text-sm text-[#3B82F6] hover:underline underline-offset-4 font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
