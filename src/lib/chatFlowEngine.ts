export type StepKey =
  | 'documentType'
  | 'industry'
  | 'stage'
  | 'keyDetail'
  | 'audience'
  | 'companyAndNotes'
  | 'confirmation';

export interface ChatOption {
  label: string;
  value: string;
  isOther?: boolean;
}

export interface FlowStep {
  key: StepKey;
  aiMessage: string;
  type: 'options' | 'freeText' | 'dualInput' | 'summary';
  options?: ChatOption[];
  placeholder?: string;
  inputs?: Array<{ key: string; label: string; placeholder: string; required: boolean; multiline?: boolean }>;
}

export const FLOW_STEPS: FlowStep[] = [
  {
    key: 'documentType',
    aiMessage: 'What type of document would you like to create?',
    type: 'freeText',
    placeholder: 'e.g. Pitch Deck, Business Plan, One-Pager…',
  },
  {
    key: 'industry',
    aiMessage: 'Great choice! What industry or sector is this for?',
    type: 'options',
    options: [
      { label: 'SaaS / Technology', value: 'SaaS / Technology' },
      { label: 'Fintech / Financial Services', value: 'Fintech / Financial Services' },
      { label: 'Healthcare / BioTech', value: 'Healthcare / BioTech' },
      { label: 'E-commerce / Retail', value: 'E-commerce / Retail' },
      { label: 'AI / Machine Learning', value: 'AI / Machine Learning' },
      { label: 'Real Estate', value: 'Real Estate' },
      { label: 'Education / EdTech', value: 'Education / EdTech' },
      { label: 'Clean Energy / Sustainability', value: 'Clean Energy / Sustainability' },
      { label: 'Food & Beverage', value: 'Food & Beverage' },
      { label: 'Non-Profit / Social Impact', value: 'Non-Profit / Social Impact' },
      { label: 'Other', value: 'Other', isOther: true },
    ],
  },
  {
    key: 'stage',
    aiMessage: 'What stage is your business at?',
    type: 'options',
    options: [
      { label: 'Idea / Pre-Revenue', value: 'Idea / Pre-Revenue' },
      { label: 'Pre-Seed / Building MVP', value: 'Pre-Seed / Building MVP' },
      { label: 'Seed / Early Traction', value: 'Seed / Early Traction' },
      { label: 'Series A / Growth', value: 'Series A / Growth' },
      { label: 'Series B+ / Scaling', value: 'Series B+ / Scaling' },
      { label: 'Established / Profitable', value: 'Established / Profitable' },
      { label: 'Other', value: 'Other', isOther: true },
    ],
  },
  {
    key: 'keyDetail',
    aiMessage: '',
    type: 'options',
    options: [],
  },
  {
    key: 'audience',
    aiMessage: 'Who is the primary audience for this document?',
    type: 'options',
    options: [
      { label: 'Investors / VCs', value: 'Investors / VCs' },
      { label: 'Board of Directors', value: 'Board of Directors' },
      { label: 'Internal Team', value: 'Internal Team' },
      { label: 'Clients / Customers', value: 'Clients / Customers' },
      { label: 'Partners / Vendors', value: 'Partners / Vendors' },
      { label: 'Bank / Financial Institution', value: 'Bank / Financial Institution' },
      { label: 'General Public', value: 'General Public' },
      { label: 'Other', value: 'Other', isOther: true },
    ],
  },
  {
    key: 'companyAndNotes',
    aiMessage: "Almost done! What's your company name? And any specific requirements or details you'd like included?",
    type: 'dualInput',
    inputs: [
      { key: 'companyName', label: 'Company Name', placeholder: 'e.g. Ideal App', required: true, multiline: false },
      { key: 'additionalNotes', label: 'Additional notes (optional)', placeholder: 'e.g. Focus on UK market, include 3-year projections…', required: false, multiline: true },
    ],
  },
  {
    key: 'confirmation',
    aiMessage: "Here's what I'll create for you:",
    type: 'summary',
  },
];

export function getKeyDetailStep(documentType: string): FlowStep {
  switch (documentType) {
    case 'Pitch Deck':
    case 'One-Pager':
      return {
        key: 'keyDetail',
        aiMessage: 'Tell me about your business in 1-2 sentences. What does your company do?',
        type: 'freeText',
        placeholder: 'e.g. We build AI-powered document tools for startups…',
      };
    case 'Business Plan':
      return {
        key: 'keyDetail',
        aiMessage: "What's the primary goal of this business plan?",
        type: 'options',
        options: [
          { label: 'Secure funding from investors', value: 'Secure funding from investors' },
          { label: 'Internal strategic planning', value: 'Internal strategic planning' },
          { label: 'Bank loan application', value: 'Bank loan application' },
          { label: 'Partner/stakeholder presentation', value: 'Partner/stakeholder presentation' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    case 'Financial Model':
      return {
        key: 'keyDetail',
        aiMessage: 'What type of financial projection do you need?',
        type: 'options',
        options: [
          { label: '3-Year Revenue Forecast', value: '3-Year Revenue Forecast' },
          { label: 'Unit Economics / Margins', value: 'Unit Economics / Margins' },
          { label: 'Cash Flow Projection', value: 'Cash Flow Projection' },
          { label: 'Fundraising / Valuation Model', value: 'Fundraising / Valuation Model' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    case 'Marketing Plan':
      return {
        key: 'keyDetail',
        aiMessage: "What's the main marketing objective?",
        type: 'options',
        options: [
          { label: 'Brand Launch / Awareness', value: 'Brand Launch / Awareness' },
          { label: 'Lead Generation / Growth', value: 'Lead Generation / Growth' },
          { label: 'Product Launch Campaign', value: 'Product Launch Campaign' },
          { label: 'Content Strategy', value: 'Content Strategy' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    case 'Legal Document':
      return {
        key: 'keyDetail',
        aiMessage: 'What type of legal document do you need?',
        type: 'options',
        options: [
          { label: 'NDA (Non-Disclosure Agreement)', value: 'NDA (Non-Disclosure Agreement)' },
          { label: 'Term Sheet', value: 'Term Sheet' },
          { label: 'SAFE Note', value: 'SAFE Note' },
          { label: 'Shareholders Agreement', value: 'Shareholders Agreement' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    case 'Investment Memo':
      return {
        key: 'keyDetail',
        aiMessage: "What's the context for this memo?",
        type: 'options',
        options: [
          { label: 'Evaluating a startup for investment', value: 'Evaluating a startup for investment' },
          { label: 'Internal fund thesis', value: 'Internal fund thesis' },
          { label: 'Due diligence summary', value: 'Due diligence summary' },
          { label: 'Angel investment decision', value: 'Angel investment decision' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    case 'Proposal':
      return {
        key: 'keyDetail',
        aiMessage: 'What type of proposal is this?',
        type: 'options',
        options: [
          { label: 'Consulting engagement', value: 'Consulting engagement' },
          { label: 'Strategic partnership', value: 'Strategic partnership' },
          { label: 'Sponsorship / event', value: 'Sponsorship / event' },
          { label: 'Project scope / SOW', value: 'Project scope / SOW' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    case 'Report':
      return {
        key: 'keyDetail',
        aiMessage: 'What type of report are you creating?',
        type: 'options',
        options: [
          { label: 'Annual company report', value: 'Annual company report' },
          { label: 'Quarterly review', value: 'Quarterly review' },
          { label: 'Market research', value: 'Market research' },
          { label: 'Competitive analysis', value: 'Competitive analysis' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    case 'Data Room':
      return {
        key: 'keyDetail',
        aiMessage: 'What stage of fundraising is this data room for?',
        type: 'options',
        options: [
          { label: 'Series A', value: 'Series A' },
          { label: 'Series B', value: 'Series B' },
          { label: 'M&A / Acquisition', value: 'M&A / Acquisition' },
          { label: 'Due Diligence', value: 'Due Diligence' },
          { label: 'Other', value: 'Other', isOther: true },
        ],
      };
    default:
      return {
        key: 'keyDetail',
        aiMessage: 'Tell me more about what you need. What is the main purpose of this document?',
        type: 'freeText',
        placeholder: 'Describe the key purpose and requirements…',
      };
  }
}
