// src/data/investors.ts

export interface InvestorRecord {
  name: string;
  type: 'vc' | 'angel' | 'family-office' | 'accelerator' | 'other';
  country: string;
  round: string;
  sectors: string[];
  website?: string;
  linkedin?: string;
  email?: string;
  description?: string;
  portfolio?: string[];
}

export const INVESTORS: InvestorRecord[] = [
  {
    name: "Sequoia Capital",
    type: "vc",
    country: "USA",
    round: "Seed to Series C",
    sectors: ["Technology", "Healthcare", "Fintech", "SaaS"],
    website: "https://www.sequoiacap.com",
    linkedin: "https://www.linkedin.com/company/sequoia-capital",
    description: "One of the world's leading venture capital firms, focused on helping founders build legendary companies.",
    portfolio: ["Apple", "Google", "Airbnb", "Stripe"]
  },
  {
    name: "Andreessen Horowitz (a16z)",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Crypto", "Bio + Health", "Consumer", "Enterprise"],
    website: "https://a16z.com",
    linkedin: "https://www.linkedin.com/company/a16z",
    description: "A venture capital firm that invests in entrepreneurs building the future through technology.",
    portfolio: ["Facebook", "Slack", "Coinbase", "Substack"]
  },
  {
    name: "Index Ventures",
    type: "vc",
    country: "UK",
    round: "Seed to Venture",
    sectors: ["E-commerce", "Fintech", "Gaming", "SaaS"],
    website: "https://www.indexventures.com",
    linkedin: "https://www.linkedin.com/company/index-ventures",
    description: "A multi-stage venture capital firm that helps the most ambitious entrepreneurs turn bold ideas into global businesses.",
    portfolio: ["Deliveroo", "Revolut", "Figma", "Roblox"]
  },
  {
    name: "LocalGlobe",
    type: "vc",
    country: "UK",
    round: "Pre-seed to Seed",
    sectors: ["Technology", "Impact", "Consumer", "B2B"],
    website: "https://localglobe.vc",
    linkedin: "https://www.linkedin.com/company/localglobe",
    description: "A UK-based venture capital firm focused on seed stage investments.",
    portfolio: ["TransferWise", "Citymapper", "Improbable"]
  },
  {
    name: "Y Combinator",
    type: "accelerator",
    country: "USA",
    round: "Pre-seed",
    sectors: ["All Sectors"],
    website: "https://www.ycombinator.com",
    linkedin: "https://www.linkedin.com/company/y-combinator",
    description: "The world's most successful startup accelerator.",
    portfolio: ["Airbnb", "Dropbox", "Stripe", "Reddit"]
  },
  {
    name: "Naval Ravikant",
    type: "angel",
    country: "USA",
    round: "Seed",
    sectors: ["Technology", "Crypto", "Web3"],
    website: "https://nav.al",
    linkedin: "https://www.linkedin.com/in/navalr",
    description: "Founder of AngelList and a prolific angel investor in early-stage technology companies."
  },
  {
    name: "Balderton Capital",
    type: "vc",
    country: "UK",
    round: "Series A",
    sectors: ["Technology", "Fintech", "Healthtech"],
    website: "https://www.balderton.com",
    linkedin: "https://www.linkedin.com/company/balderton-capital",
    description: "Europe's leading early-stage venture capital investor."
  },
  {
    name: "Accel",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["SaaS", "Consumer", "Infrastructure"],
    website: "https://www.accel.com",
    linkedin: "https://www.linkedin.com/company/accel-vc",
    description: "A leading venture capital firm that partners with exceptional founders with unique insights."
  },
  {
    name: "Point Nine Capital",
    type: "vc",
    country: "Germany",
    round: "Seed",
    sectors: ["SaaS", "B2B Marketplaces"],
    website: "https://www.pointnine.com",
    linkedin: "https://www.linkedin.com/company/point-nine-capital",
    description: "A seed-stage venture capital firm focused on B2B SaaS and B2B marketplaces."
  },
  {
    name: "Seedcamp",
    type: "vc",
    country: "UK",
    round: "Pre-seed to Seed",
    sectors: ["Technology", "Fintech", "SaaS"],
    website: "https://seedcamp.com",
    linkedin: "https://www.linkedin.com/company/seedcamp",
    description: "Europe's seed fund, investing early in world-class founders."
  },
  {
    name: "Tiger Global Management",
    type: "vc",
    country: "USA",
    round: "Growth",
    sectors: ["Internet", "Software", "Consumer"],
    website: "https://www.tigerglobal.com",
    linkedin: "https://www.linkedin.com/company/tiger-global-management",
    description: "An investment firm that focuses on public and private companies in the global Internet, software, consumer, and financial technology sectors."
  },
  {
    name: "SoftBank Vision Fund",
    type: "vc",
    country: "Japan",
    round: "Growth",
    sectors: ["AI", "Robotics", "IoT", "Fintech"],
    website: "https://visionfund.com",
    linkedin: "https://www.linkedin.com/company/softbank-vision-fund",
    description: "The world's largest technology-focused venture capital fund."
  },
  {
    name: "Greylock Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Series B",
    sectors: ["Enterprise", "Consumer", "Crypto"],
    website: "https://greylock.com",
    linkedin: "https://www.linkedin.com/company/greylock",
    description: "A venture capital firm that partners with entrepreneurs to build companies from the ground up."
  },
  {
    name: "Lightspeed Venture Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Enterprise", "Consumer", "Health"],
    website: "https://lsvp.com",
    linkedin: "https://www.linkedin.com/company/lightspeed-venture-partners",
    description: "A multi-stage venture capital firm focused on accelerating disruptive innovations and trends in the Enterprise and Consumer sectors."
  },
  {
    name: "Benchmark",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Social", "Mobile", "Local", "Cloud"],
    website: "https://www.benchmark.com",
    linkedin: "https://www.linkedin.com/company/benchmark-capital",
    description: "A venture capital firm that focuses on early-stage investments in technology companies."
  },
  {
    name: "Founders Fund",
    type: "vc",
    country: "USA",
    round: "All Stages",
    sectors: ["Aerospace", "AI", "Biotech", "Energy"],
    website: "https://foundersfund.com",
    linkedin: "https://www.linkedin.com/company/founders-fund",
    description: "A venture capital firm that invests in companies building revolutionary technologies."
  },
  {
    name: "Khosla Ventures",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Clean Tech", "Health", "AI", "Fintech"],
    website: "https://www.khoslaventures.com",
    linkedin: "https://www.linkedin.com/company/khosla-ventures",
    description: "A venture capital firm that provides venture assistance and strategic advice to entrepreneurs."
  },
  {
    name: "New Enterprise Associates (NEA)",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Technology", "Healthcare"],
    website: "https://www.nea.com",
    linkedin: "https://www.linkedin.com/company/nea",
    description: "A global venture capital firm focused on helping entrepreneurs build transformational businesses."
  },
  {
    name: "Bessemer Venture Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Healthcare"],
    website: "https://www.bvp.com",
    linkedin: "https://www.linkedin.com/company/bessemer-venture-partners",
    description: "A venture capital firm that helps entrepreneurs from their first days to their IPO."
  },
  {
    name: "General Catalyst",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Fintech", "Health"],
    website: "https://www.generalcatalyst.com",
    linkedin: "https://www.linkedin.com/company/general-catalyst",
    description: "A venture capital firm that invests in powerful, positive change that endures."
  },
  {
    name: "Kleiner Perkins",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Healthcare", "Fintech"],
    website: "https://www.kleinerperkins.com",
    linkedin: "https://www.linkedin.com/company/kleiner-perkins",
    description: "A venture capital firm that partners with the most imaginative founders to build world-changing companies."
  },
  {
    name: "GV (Google Ventures)",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Life Sciences", "Consumer", "Enterprise", "Crypto"],
    website: "https://www.gv.com",
    linkedin: "https://www.linkedin.com/company/gv-google-ventures-",
    description: "The venture capital investment arm of Alphabet Inc."
  },
  {
    name: "First Round Capital",
    type: "vc",
    country: "USA",
    round: "Seed",
    sectors: ["Technology", "Consumer", "Enterprise"],
    website: "https://firstround.com",
    linkedin: "https://www.linkedin.com/company/first-round-capital",
    description: "A venture capital firm that specializes in providing seed-stage funding to technology companies."
  },
  {
    name: "Floodgate",
    type: "vc",
    country: "USA",
    round: "Seed",
    sectors: ["Technology", "Consumer", "Enterprise"],
    website: "https://floodgate.com",
    linkedin: "https://www.linkedin.com/company/floodgate",
    description: "A venture capital firm that focuses on early-stage investments in technology companies."
  },
  {
    name: "True Ventures",
    type: "vc",
    country: "USA",
    round: "Seed",
    sectors: ["Technology", "Consumer", "Enterprise"],
    website: "https://trueventures.com",
    linkedin: "https://www.linkedin.com/company/true-ventures",
    description: "A venture capital firm that invests in early-stage technology startups."
  },
  {
    name: "Social Capital",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Healthcare", "Education", "Fintech", "Enterprise"],
    website: "https://www.socialcapital.com",
    linkedin: "https://www.linkedin.com/company/social-capital-lp",
    description: "A venture capital firm that invests in companies that solve hard problems."
  },
  {
    name: "Canaan Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Technology", "Healthcare"],
    website: "https://www.canaan.com",
    linkedin: "https://www.linkedin.com/company/canaan-partners",
    description: "A global venture capital firm that invests in early-stage technology and healthcare companies."
  },
  {
    name: "IVP (Institutional Venture Partners)",
    type: "vc",
    country: "USA",
    round: "Growth",
    sectors: ["Technology", "Consumer", "Enterprise"],
    website: "https://www.ivp.com",
    linkedin: "https://www.linkedin.com/company/institutional-venture-partners",
    description: "A premier later-stage venture capital and growth equity firm."
  },
  {
    name: "Redpoint Ventures",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Fintech"],
    website: "https://www.redpoint.com",
    linkedin: "https://www.linkedin.com/company/redpoint-ventures",
    description: "A venture capital firm that partners with visionary founders to build the next generation of market-defining companies."
  },
  {
    name: "Menlo Ventures",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Healthcare"],
    website: "https://www.menlovc.com",
    linkedin: "https://www.linkedin.com/company/menlo-ventures",
    description: "A venture capital firm that invests in early-stage and growth-stage technology companies."
  },
  {
    name: "DCM Ventures",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Mobile"],
    website: "https://www.dcm.com",
    linkedin: "https://www.linkedin.com/company/dcm",
    description: "A global venture capital firm that invests in early-stage technology companies in the US and Asia."
  },
  {
    name: "Mayfield Fund",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Consumer", "Enterprise", "Energy"],
    website: "https://www.mayfield.com",
    linkedin: "https://www.linkedin.com/company/mayfield-fund",
    description: "A global venture capital firm with a focus on early-stage technology companies."
  },
  {
    name: "Battery Ventures",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Software", "Hardware", "Consumer"],
    website: "https://www.battery.com",
    linkedin: "https://www.linkedin.com/company/battery-ventures",
    description: "A global, technology-focused investment firm."
  },
  {
    name: "Norwest Venture Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Healthcare"],
    website: "https://www.nvp.com",
    linkedin: "https://www.linkedin.com/company/norwest-venture-partners",
    description: "A multi-stage investment firm that manages more than $9.5 billion in capital."
  },
  {
    name: "Foundation Capital",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Consumer", "Enterprise", "Fintech"],
    website: "https://foundationcapital.com",
    linkedin: "https://www.linkedin.com/company/foundation-capital",
    description: "A venture capital firm that invests in early-stage technology companies."
  },
  {
    name: "US Venture Partners (USVP)",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["IT", "Healthcare"],
    website: "https://www.usvp.com",
    linkedin: "https://www.linkedin.com/company/u-s-venture-partners",
    description: "A leading Silicon Valley venture capital firm."
  },
  {
    name: "InterWest Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["IT", "Healthcare"],
    website: "https://www.interwest.com",
    linkedin: "https://www.linkedin.com/company/interwest-partners",
    description: "A leading venture capital firm investing in early-stage IT and healthcare companies."
  },
  {
    name: "August Capital",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Information Technology"],
    website: "https://www.augustcap.com",
    linkedin: "https://www.linkedin.com/company/august-capital",
    description: "A venture capital firm that invests in early-stage technology companies."
  },
  {
    name: "Trinity Ventures",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Consumer", "Enterprise", "Fintech"],
    website: "https://www.trinityventures.com",
    linkedin: "https://www.linkedin.com/company/trinity-ventures",
    description: "A venture capital firm that invests in early-stage technology companies."
  },
  {
    name: "Charles River Ventures (CRV)",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Consumer", "Enterprise"],
    website: "https://www.crv.com",
    linkedin: "https://www.linkedin.com/company/crv",
    description: "A venture capital firm that invests in early-stage technology companies."
  },
  {
    name: "Atlas Venture",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Life Sciences", "Technology"],
    website: "https://www.atlasventure.com",
    linkedin: "https://www.linkedin.com/company/atlas-venture",
    description: "A venture capital firm that invests in early-stage life sciences and technology companies."
  },
  {
    name: "Polaris Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Technology", "Healthcare"],
    website: "https://www.polarispartners.com",
    linkedin: "https://www.linkedin.com/company/polaris-partners",
    description: "A venture capital firm that invests in technology and healthcare companies."
  },
  {
    name: "Flybridge Capital Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Information Technology"],
    website: "https://www.flybridge.com",
    linkedin: "https://www.linkedin.com/company/flybridge-capital-partners",
    description: "A venture capital firm that invests in early-stage technology companies."
  },
  {
    name: "Spark Capital",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Consumer", "Enterprise", "Fintech"],
    website: "https://www.sparkcapital.com",
    linkedin: "https://www.linkedin.com/company/spark-capital",
    description: "A venture capital firm that invests in startups that are building products that people love."
  },
  {
    name: "Union Square Ventures (USV)",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Internet", "Mobile", "Web Services"],
    website: "https://www.usv.com",
    linkedin: "https://www.linkedin.com/company/union-square-ventures",
    description: "A venture capital firm that invests in companies that use the internet to create large networks."
  },
  {
    name: "RRE Ventures",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Information Technology"],
    website: "https://www.rre.com",
    linkedin: "https://www.linkedin.com/company/rre-ventures",
    description: "A venture capital firm that invests in early-stage technology companies."
  },
  {
    name: "Venrock",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Technology", "Healthcare"],
    website: "https://www.venrock.com",
    linkedin: "https://www.linkedin.com/company/venrock",
    description: "A venture capital firm that was founded by the Rockefeller family."
  },
  {
    name: "Draper Fisher Jurvetson (DFJ)",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Technology"],
    website: "https://dfj.com",
    linkedin: "https://www.linkedin.com/company/dfj",
    description: "A venture capital firm that invests in early-stage and growth-stage technology companies."
  },
  {
    name: "Sequoia Capital China",
    type: "vc",
    country: "China",
    round: "Seed to Growth",
    sectors: ["Technology", "Consumer", "Healthcare"],
    website: "https://www.sequoiacap.cn",
    linkedin: "https://www.linkedin.com/company/sequoia-capital-china",
    description: "The Chinese arm of Sequoia Capital."
  },
  {
    name: "IDG Capital",
    type: "vc",
    country: "China",
    round: "Seed to Growth",
    sectors: ["Technology", "Consumer", "Healthcare"],
    website: "https://www.idgcapital.com",
    linkedin: "https://www.linkedin.com/company/idg-capital",
    description: "A leading investment firm in China."
  },
  {
    name: "Accel Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Growth",
    sectors: ["Technology", "Healthcare", "Consumer"],
    website: "https://www.accel.com",
    linkedin: "https://www.linkedin.com/company/accel-vc",
    description: "A leading venture capital firm that partners with exceptional founders with unique insights."
  },
  {
    name: "Benchmark",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Technology", "Consumer"],
    website: "https://www.benchmark.com",
    linkedin: "https://www.linkedin.com/company/benchmark-capital",
    description: "A venture capital firm that invests in early-stage technology companies."
  },
  {
    name: "Greylock Partners",
    type: "vc",
    country: "USA",
    round: "Seed to Series A",
    sectors: ["Technology", "Enterprise", "Consumer"],
    website: "https://www.greylock.com",
    linkedin: "https://www.linkedin.com/company/greylock",
    description: "A venture capital firm that partners with entrepreneurs to build companies from the ground up."
  }
];
