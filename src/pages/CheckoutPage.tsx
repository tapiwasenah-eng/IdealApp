import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronLeft, CreditCard, Lock } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import SEOHead from '../components/Shared/SEOHead';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const billing = searchParams.get('billing') || 'monthly';
  const price = searchParams.get('price') || '39.00';
  const navigate = useNavigate();
  const { user, profile, updateSubscription, loading } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?mode=signup&redirect=checkout');
    }
  }, [user, loading, navigate]);

  const planDetails = {
    pro: {
      name: 'Pro Plan',
      price: price,
      description: `${billing === 'annual' ? 'Annual' : 'Monthly'} subscription for serious founders`
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 'Custom',
      description: 'For large teams & organizations'
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro;

  const handleSuccess = async (details: any) => {
    setIsProcessing(true);
    try {
      await updateSubscription(plan as any);
      toast.success('Payment successful! Your account has been upgraded.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error upgrading account:', error);
      toast.error('Payment successful, but failed to upgrade account. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (err: any) => {
    console.error('PayPal Error:', err);
    toast.error('Payment failed. Please try again.');
  };

  if (!user || loading) {
    return null;
  }

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const paypalPlanId = import.meta.env.VITE_PAYPAL_PRO_PLAN_ID;
  const isConfigured = Boolean(paypalClientId && paypalPlanId && paypalClientId !== 'test');

  return (
    <PageWrapper>
      <SEOHead
        title="Secure Checkout | Ideal App"
        description="Complete your Ideal App subscription."
        noIndex={true}
      />
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Pricing
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Complete your order</h1>
                <p className="text-slate-500">You're just one step away from unlocking full potential.</p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-indigo-600" size={20} />
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">{currentPlan.name}</p>
                      <p className="text-sm text-slate-500">{currentPlan.description}</p>
                    </div>
                    <p className="font-bold text-slate-900">${currentPlan.price}</p>
                  </div>
                  
                  <div className="h-px bg-slate-100 my-4" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-slate-900">Total Due Today</span>
                    <span className="font-black text-indigo-600">${currentPlan.price}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-3">
                  <ShieldCheck className="text-green-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-bold text-green-900">Secure Checkout</p>
                    <p className="text-xs text-green-700">Your payment information is encrypted and secure.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">PCI Compliant</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-8">Payment Method</h2>
              
              {!isConfigured ? (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
                  <h3 className="font-bold mb-2">Checkout Not Configured</h3>
                  <p className="text-sm mb-4">Please set your PayPal API keys in the Environment Variables settings to enable checkout:</p>
                  <ul className="text-sm list-disc pl-5 space-y-1 mb-4 opacity-80">
                    <li><code className="font-mono bg-amber-100 px-1 py-0.5 rounded">VITE_PAYPAL_CLIENT_ID</code></li>
                    <li><code className="font-mono bg-amber-100 px-1 py-0.5 rounded">VITE_PAYPAL_PRO_PLAN_ID</code></li>
                  </ul>
                  <p className="text-xs opacity-70">
                    Ensure the Plan ID corresponds to a valid billing plan created in your PayPal Developer Dashboard.
                  </p>
                </div>
              ) : (
                <PayPalScriptProvider options={{ 
                  clientId: paypalClientId,
                  vault: true,
                  intent: "subscription"
                }}>
                  <div className="space-y-6">
                    <PayPalButtons
                      style={{ 
                        layout: "vertical",
                        shape: "pill",
                        label: "subscribe"
                      }}
                      createSubscription={(data, actions) => {
                        return actions.subscription.create({
                          plan_id: paypalPlanId
                        });
                      }}
                      onApprove={async (data, actions) => {
                        handleSuccess(data);
                      }}
                      onError={handleError}
                    />
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-slate-400 font-medium tracking-widest">Or pay with card</span>
                      </div>
                    </div>

                    <button 
                      disabled={true}
                      className="w-full py-4 rounded-full border-2 border-slate-200 text-slate-400 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <CreditCard size={20} />
                      Debit or Credit Card
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-400 leading-relaxed">
                      By completing your purchase, you agree to our <a href="/terms" className="underline hover:text-indigo-600">Terms of Service</a> and <a href="/privacy" className="underline hover:text-indigo-600">Privacy Policy</a>. Subscriptions auto-renew until cancelled.
                    </p>
                  </div>
                </PayPalScriptProvider>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
