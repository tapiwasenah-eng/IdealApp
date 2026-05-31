declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    clarity: (...args: unknown[]) => void;
  }
}

type GTagEventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

export function trackEvent(eventName: string, params?: GTagEventParams) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
}

// ── Conversion events ────────────────────────────────────────────────────────

// Fire on: successful account sign-up
export const trackSignUp = (method: string) =>
  trackEvent('sign_up', { method, event_category: 'conversion', value: 1 });

// Fire on: when user uses a template for the first time
export const trackTemplateUse = (templateName: string) =>
  trackEvent('template_use', { event_label: templateName, event_category: 'engagement' });

// Fire on: successful subscription purchase
export const trackSubscription = (plan: 'Pro' | 'Enterprise', value: number) =>
  trackEvent('purchase', { event_category: 'conversion', event_label: plan, value, currency: 'USD' });

// Fire on: upgrade CTA click
export const trackUpgradeClick = (from: string, to: string) =>
  trackEvent('upgrade_click', { event_category: 'monetisation', event_label: `${from} → ${to}` });

// Fire on: document created / exported
export const trackDocumentCreated = (documentType: string) =>
  trackEvent('document_created', { event_category: 'engagement', event_label: documentType });

// Fire on: investor database search
export const trackInvestorSearch = () =>
  trackEvent('investor_search', { event_category: 'engagement' });
