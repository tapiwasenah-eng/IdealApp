// src/utils/consent.ts
export function hasConsent(): boolean {
  return localStorage.getItem('cookie_consent') === 'accepted';
}

export function setConsent(accepted: boolean) {
  localStorage.setItem('cookie_consent', accepted ? 'accepted' : 'declined');
  if (accepted) {
    loadAnalytics();
  }
}

function loadAnalytics() {
  // Dynamically load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  document.head.appendChild(script);
}
