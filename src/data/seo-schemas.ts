// src/data/seo-schemas.ts

// ── a) Organization ──────────────────────────────────────────────────────────
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ideal App",
  "legalName": "IdealApp Technology Ltd",
  "url": "https://idealapp.technology",
  "logo": {
    "@type": "ImageObject",
    "url": "https://idealapp.technology/logo.png",
    "width": 512,
    "height": 512
  },
  "description": "AI-powered business document creation platform for startups and founders. Create pitch decks, business plans, financial models, and investor-ready documents in minutes.",
  "foundingDate": "2025",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GB",
    "addressRegion": "England"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@idealapp.technology",
    "contactType": "customer support"
  },
  "sameAs": [
    "https://twitter.com/idealapp",
    "https://linkedin.com/company/idealapp",
    "https://www.crunchbase.com/organization/idealapp"
  ]
};

// ── b) SoftwareApplication ───────────────────────────────────────────────────
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Ideal App",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "url": "https://idealapp.technology",
  "description": "All-in-one AI platform for creating pitch decks, business plans, financial models, investor databases, data rooms, and legal documents.",
  "featureList": [
    "AI-powered document generation",
    "50+ professional templates",
    "Drag-and-drop canvas editor",
    "Investor database",
    "Data room management",
    "AI chat consultant",
    "Financial model generator",
    "Legal document templates",
    "Real-time collaboration",
    "One-click export to PDF and PowerPoint"
  ],
  "screenshot": "https://idealapp.technology/og/home.png",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier with access to core features and templates."
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "12",
      "priceCurrency": "USD",
      "billingIncrement": "P1M",
      "description": "Pro plan with unlimited documents, advanced AI features, and priority support."
    },
    {
      "@type": "Offer",
      "name": "Enterprise",
      "price": "29",
      "priceCurrency": "USD",
      "billingIncrement": "P1M",
      "description": "Enterprise plan with full platform access, investor database, data rooms, and custom integrations."
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "240",
    "bestRating": "5",
    "worstRating": "1"
  }
};

// ── c) WebSite with SearchAction ─────────────────────────────────────────────
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ideal App",
  "url": "https://idealapp.technology",
  "description": "AI-powered business document creation platform",
  "publisher": {
    "@type": "Organization",
    "name": "Ideal App"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://idealapp.technology/templates?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// ── d) FAQPage (Pricing page) ─────────────────────────────────────────────────
export const faqPricingSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Ideal App really free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Ideal App has a genuine free tier with no credit card required. You can create documents, use templates, and access core AI features without paying anything. Upgrade to Pro or Enterprise when you need advanced functionality."
      }
    },
    {
      "@type": "Question",
      "name": "What does the Pro plan include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Pro plan at $12/month gives you unlimited document creation, access to all 50+ templates, advanced AI generation, drag-and-drop canvas editor, PDF and PowerPoint exports, and priority email support."
      }
    },
    {
      "@type": "Question",
      "name": "What does the Enterprise plan include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Enterprise plan at $29/month includes everything in Pro plus access to the investor database, integrated data rooms, legal document templates, AI chat consultant, team collaboration, and custom branding options."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cancel my subscription at any time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All Ideal App subscriptions are monthly with no long-term contracts. You can cancel at any time from your account dashboard and you will retain access until the end of your billing period."
      }
    },
    {
      "@type": "Question",
      "name": "Is Ideal App cheaper than Gamma or Beautiful.ai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ideal App's Pro plan starts at $12/month and includes AI-powered pitch decks, business plans, financial models, and investor documents — a wider feature set than presentation-only tools like Gamma ($8/mo for decks only) or Beautiful.ai ($12/mo for presentations only). For all-in-one startup document needs, Ideal App offers significantly more value per pound."
      }
    },
    {
      "@type": "Question",
      "name": "Does Ideal App work for UK startups?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Ideal App is built by IdealApp Technology Ltd, registered in England and Wales. It supports UK-specific document formats, UK English, and includes templates relevant to UK fundraising including SEIS/EIS compliance documentation."
      }
    },
    {
      "@type": "Question",
      "name": "How many templates does Ideal App offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ideal App offers 50+ professionally designed templates covering pitch decks, business plans, financial models, one-pagers, investor memos, data room structures, and legal documents — all editable with the AI canvas editor."
      }
    },
    {
      "@type": "Question",
      "name": "Is there an investor database included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Enterprise plan includes access to a curated investor database of VCs, angel investors, and family offices. You can filter by stage, sector, geography, and ticket size to find the right investors for your raise."
      }
    }
  ]
};

// ── e) BreadcrumbList helper ─────────────────────────────────────────────────
export function breadcrumbSchema(path: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://idealapp.technology/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": label,
        "item": `https://idealapp.technology${path}`
      }
    ]
  };
}

// ── f) Article schema (for blog posts) ──────────────────────────────────────
// Usage: pass post data dynamically in each blog post page component
export function articleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  authorName,
  image,
  url,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  image: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ideal App",
      "logo": {
        "@type": "ImageObject",
        "url": "https://idealapp.technology/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}

// ── g) HowTo schema (for tutorials) ──────────────────────────────────────────
export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create a Pitch Deck with Ideal App",
  "description": "Step-by-step guide to building an investor-ready pitch deck using Ideal App's AI document creator.",
  "totalTime": "PT10M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Create a free account",
      "text": "Sign up at idealapp.technology. No credit card required.",
      "url": "https://idealapp.technology/auth"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Choose a pitch deck template",
      "text": "Browse 50+ templates and select a pitch deck layout that suits your industry and stage.",
      "url": "https://idealapp.technology/templates"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Enter your business details",
      "text": "Answer a few prompts about your startup. The AI will generate a complete first draft of your pitch deck."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Customise with the drag-and-drop editor",
      "text": "Edit slides, update your financials, and add your brand colours using the canvas editor."
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Export and share",
      "text": "Export your pitch deck as PDF or PowerPoint, or share a live link directly with investors."
    }
  ]
};
