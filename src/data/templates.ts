// src/data/templates.ts

import { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: "saas-pitch-deck",
    name: "SaaS Pitch Deck",
    title: "SaaS Pitch Deck",
    description: "Professional investor presentation template for SaaS startups",
    category: "pitch-deck",
    industry: "SaaS",
    stage: "Seed",
    designStyle: "Modern",
    badge: "Popular",
    rating: 4.9,
    pageCount: 15,
    isPremium: false,
    colorScheme: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#10B981",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "{{company_name}}",
        subheading: "{{tagline}}",
        body: "{{one_line_description}}\n\n{{funding_round}} Pitch Deck | {{date}}",
        layoutHint: "centered"
      },
      {
        id: "problem",
        type: "problem",
        heading: "The Problem",
        body: "{{target_market}} faces a critical challenge: {{problem_statement}}\n\nCurrent solutions fall short because {{why_existing_solutions_fail}}. This creates a ${{market_gap_value}} gap in the market.",
        bullets: [
          "{{pain_point_1}}",
          "{{pain_point_2}}",
          "{{pain_point_3}}"
        ],
        metrics: [
          {
            label: "Market Pain",
            value: "{{pain_metric}}"
          },
          {
            label: "Cost of Problem",
            value: "${{cost_of_problem}}"
          }
        ]
      },
      {
        id: "solution",
        type: "solution",
        heading: "Our Solution",
        body: "{{company_name}} provides {{solution_description}}.\n\nUnlike competitors, we {{unique_approach}}. Our platform enables {{key_capability}} resulting in {{key_benefit}} for customers.",
        bullets: [
          "{{feature_1}}: {{feature_1_benefit}}",
          "{{feature_2}}: {{feature_2_benefit}}",
          "{{feature_3}}: {{feature_3_benefit}}"
        ]
      },
      {
        id: "market",
        type: "market_analysis",
        heading: "Market Opportunity",
        body: "The {{industry_name}} market is projected to reach ${{market_size}} by {{market_year}}, growing at {{cagr}}% CAGR.",
        metrics: [
          {
            label: "TAM",
            value: "${{tam}}",
            trend: "up"
          },
          {
            label: "SAM",
            value: "${{sam}}",
            trend: "up"
          },
          {
            label: "SOM",
            value: "${{som}}",
            trend: "up"
          },
          {
            label: "CAGR",
            value: "{{cagr}}%",
            trend: "up"
          }
        ],
        bullets: [
          "{{market_trend_1}}",
          "{{market_trend_2}}",
          "{{market_trend_3}}"
        ]
      },
      {
        id: "business_model",
        type: "business_model",
        heading: "Business Model",
        body: "{{company_name}} operates on a {{revenue_model}} model with {{pricing_strategy}}.",
        bullets: [
          "{{tier_1_name}}: ${{tier_1_price}}/mo — {{tier_1_desc}}",
          "{{tier_2_name}}: ${{tier_2_price}}/mo — {{tier_2_desc}}",
          "{{tier_3_name}}: ${{tier_3_price}}/mo — {{tier_3_desc}}"
        ],
        metrics: [
          {
            label: "ACV",
            value: "${{acv}}"
          },
          {
            label: "LTV",
            value: "${{ltv}}"
          },
          {
            label: "CAC",
            value: "${{cac}}"
          },
          {
            label: "LTV:CAC",
            value: "{{ltv_cac_ratio}}x"
          }
        ]
      },
      {
        id: "traction",
        type: "traction",
        heading: "Traction & Milestones",
        body: "Since launching in {{launch_date}}, {{company_name}} has demonstrated strong market validation.",
        metrics: [
          {
            label: "MRR",
            value: "${{mrr}}",
            trend: "up"
          },
          {
            label: "Customers",
            value: "{{customer_count}}",
            trend: "up"
          },
          {
            label: "MoM Growth",
            value: "{{mom_growth}}%",
            trend: "up"
          },
          {
            label: "NRR",
            value: "{{nrr}}%",
            trend: "up"
          }
        ],
        bullets: [
          "{{milestone_1}}",
          "{{milestone_2}}",
          "{{milestone_3}}",
          "{{milestone_4}}"
        ]
      },
      {
        id: "competition",
        type: "competition",
        heading: "Competitive Landscape",
        body: "{{company_name}} differentiates through {{key_differentiator}}.",
        tableData: {
          headers: [
            "Feature",
            "{{company_name}}",
            "{{competitor_1}}",
            "{{competitor_2}}",
            "{{competitor_3}}"
          ],
          rows: [
            [
              "{{feature_row_1}}",
              "✅",
              "{{c1_f1}}",
              "{{c2_f1}}",
              "{{c3_f1}}"
            ],
            [
              "{{feature_row_2}}",
              "✅",
              "{{c1_f2}}",
              "{{c2_f2}}",
              "{{c3_f2}}"
            ],
            [
              "{{feature_row_3}}",
              "✅",
              "{{c1_f3}}",
              "{{c2_f3}}",
              "{{c3_f3}}"
            ],
            [
              "{{feature_row_4}}",
              "✅",
              "{{c1_f4}}",
              "{{c2_f4}}",
              "{{c3_f4}}"
            ]
          ]
        }
      },
      {
        id: "financials",
        type: "financial_projections",
        heading: "Financial Projections",
        body: "Our model projects sustainable growth with path to profitability by {{profitability_date}}.",
        tableData: {
          headers: [
            "Metric",
            "Year 1",
            "Year 2",
            "Year 3"
          ],
          rows: [
            [
              "Revenue",
              "${{rev_y1}}",
              "${{rev_y2}}",
              "${{rev_y3}}"
            ],
            [
              "Gross Margin",
              "{{gm_y1}}%",
              "{{gm_y2}}%",
              "{{gm_y3}}%"
            ],
            [
              "Customers",
              "{{cust_y1}}",
              "{{cust_y2}}",
              "{{cust_y3}}"
            ],
            [
              "Burn Rate",
              "${{burn_y1}}/mo",
              "${{burn_y2}}/mo",
              "${{burn_y3}}/mo"
            ]
          ]
        }
      },
      {
        id: "team",
        type: "team",
        heading: "The Team",
        body: "Our team brings {{total_experience}}+ years of combined experience in {{relevant_domains}}.",
        bullets: [
          "{{founder_1_name}}, {{founder_1_title}} — {{founder_1_bg}}",
          "{{founder_2_name}}, {{founder_2_title}} — {{founder_2_bg}}",
          "{{advisor_1_name}}, Advisor — {{advisor_1_bg}}"
        ]
      },
      {
        id: "ask",
        type: "investment_ask",
        heading: "The Ask",
        body: "{{company_name}} is raising ${{raise_amount}} in {{funding_round}} to {{use_of_funds_summary}}.",
        bullets: [
          "{{alloc_1_pct}}% — {{alloc_1_purpose}}",
          "{{alloc_2_pct}}% — {{alloc_2_purpose}}",
          "{{alloc_3_pct}}% — {{alloc_3_purpose}}"
        ],
        metrics: [
          {
            label: "Raising",
            value: "${{raise_amount}}"
          },
          {
            label: "Valuation",
            value: "${{valuation}}"
          },
          {
            label: "Runway",
            value: "{{runway_months}} months"
          }
        ]
      }
    ]
  },
  {
    id: "ecommerce-business-plan",
    name: "E-commerce Business Plan",
    title: "E-commerce Business Plan",
    description: "Comprehensive business strategy document for e-commerce ventures",
    category: "business-plan",
    industry: "E-commerce",
    stage: "Seed",
    designStyle: "Bold",
    badge: "New",
    rating: 4.8,
    pageCount: 25,
    isPremium: false,
    colorScheme: {
      primary: "#10B981",
      secondary: "#065F46",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "{{company_name}}",
        subheading: "Business Plan",
        body: "{{tagline}}\n\n{{date}} | Confidential",
        layoutHint: "centered"
      },
      {
        id: "exec",
        type: "executive_summary",
        heading: "Executive Summary",
        body: "{{company_name}} is an e-commerce platform specializing in {{product_category}}. Founded in {{founded_year}}, we target {{target_demographic}} seeking {{value_proposition}}.\n\nOur revenue model is {{revenue_model}} with projected first-year revenue of ${{projected_revenue_y1}}.",
        metrics: [
          {
            label: "Market Size",
            value: "${{market_size}}"
          },
          {
            label: "Year 1 Revenue",
            value: "${{projected_revenue_y1}}"
          },
          {
            label: "Gross Margin",
            value: "{{gross_margin}}%"
          }
        ]
      },
      {
        id: "market",
        type: "market_analysis",
        heading: "Market Analysis",
        body: "The {{product_category}} e-commerce market is valued at ${{market_size}} and growing at {{cagr}}% annually.",
        bullets: [
          "{{market_trend_1}}",
          "{{market_trend_2}}",
          "{{consumer_behavior_trend}}"
        ],
        metrics: [
          {
            label: "TAM",
            value: "${{tam}}",
            trend: "up"
          },
          {
            label: "Online Share",
            value: "{{online_pct}}%",
            trend: "up"
          }
        ]
      },
      {
        id: "products",
        type: "text",
        heading: "Products & Services",
        body: "{{company_name}} offers {{product_range_description}}.",
        bullets: [
          "{{product_1}}: {{product_1_desc}} — ${{product_1_price}}",
          "{{product_2}}: {{product_2_desc}} — ${{product_2_price}}",
          "{{product_3}}: {{product_3_desc}} — ${{product_3_price}}"
        ]
      },
      {
        id: "marketing",
        type: "text",
        heading: "Marketing Strategy",
        body: "Our go-to-market strategy focuses on {{primary_channel}} and {{secondary_channel}}.",
        bullets: [
          "Customer Acquisition: {{acquisition_strategy}}",
          "Retention: {{retention_strategy}}",
          "Brand: {{brand_positioning}}",
          "Budget: ${{marketing_budget}}/mo"
        ]
      },
      {
        id: "operations",
        type: "text",
        heading: "Operations",
        body: "{{company_name}} operates from {{headquarters}} with {{fulfillment_model}} fulfillment.",
        bullets: [
          "Suppliers: {{supplier_strategy}}",
          "Fulfillment: {{fulfillment_details}}",
          "Technology: {{tech_stack}}",
          "Customer Service: {{cs_approach}}"
        ]
      },
      {
        id: "financials",
        type: "financial_projections",
        heading: "Financial Projections",
        tableData: {
          headers: [
            "",
            "Year 1",
            "Year 2",
            "Year 3"
          ],
          rows: [
            [
              "Revenue",
              "${{rev_y1}}",
              "${{rev_y2}}",
              "${{rev_y3}}"
            ],
            [
              "COGS",
              "${{cogs_y1}}",
              "${{cogs_y2}}",
              "${{cogs_y3}}"
            ],
            [
              "Gross Profit",
              "${{gp_y1}}",
              "${{gp_y2}}",
              "${{gp_y3}}"
            ],
            [
              "Operating Expenses",
              "${{opex_y1}}",
              "${{opex_y2}}",
              "${{opex_y3}}"
            ],
            [
              "Net Profit",
              "${{np_y1}}",
              "${{np_y2}}",
              "${{np_y3}}"
            ]
          ]
        }
      },
      {
        id: "team",
        type: "team",
        heading: "Team",
        body: "Our team combines e-commerce expertise with technical and operational strength.",
        bullets: [
          "{{founder_name}}, {{founder_title}} — {{founder_background}}",
          "{{team_member_2}}, {{tm2_title}} — {{tm2_background}}",
          "{{team_member_3}}, {{tm3_title}} — {{tm3_background}}"
        ]
      },
      {
        id: "funding",
        type: "investment_ask",
        heading: "Funding Requirements",
        body: "{{company_name}} is seeking ${{raise_amount}} to {{funding_purpose}}.",
        bullets: [
          "{{alloc_1_pct}}% Inventory & Supply Chain",
          "{{alloc_2_pct}}% Marketing & Customer Acquisition",
          "{{alloc_3_pct}}% Technology & Platform",
          "{{alloc_4_pct}}% Operations & Team"
        ]
      }
    ]
  },
  {
    id: "startup-financial-model",
    name: "Startup Financial Model",
    title: "Startup Financial Model",
    description: "3-year financial projections and analysis",
    category: "financial-model",
    industry: "General",
    stage: "Seed",
    designStyle: "Minimal",
    badge: "Pro",
    rating: 4.7,
    pageCount: 12,
    isPremium: true,
    colorScheme: {
      primary: "#F59E0B",
      secondary: "#B45309",
      accent: "#10B981",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "Financial Model",
        subheading: "{{company_name}}",
        body: "3-Year Projections | {{date}}",
        layoutHint: "centered"
      },
      {
        id: "assumptions",
        type: "text",
        heading: "Key Assumptions",
        body: "This model is built on the following assumptions for {{company_name}} in the {{industry_name}} market.",
        tableData: {
          headers: [
            "Assumption",
            "Value",
            "Basis"
          ],
          rows: [
            [
              "Starting MRR",
              "${{starting_mrr}}",
              "{{mrr_basis}}"
            ],
            [
              "MoM Growth Rate",
              "{{growth_rate}}%",
              "{{growth_basis}}"
            ],
            [
              "Churn Rate",
              "{{churn_rate}}%",
              "{{churn_basis}}"
            ],
            [
              "ACV",
              "${{acv}}",
              "{{acv_basis}}"
            ],
            [
              "CAC",
              "${{cac}}",
              "{{cac_basis}}"
            ],
            [
              "Gross Margin",
              "{{gross_margin}}%",
              "{{gm_basis}}"
            ]
          ]
        }
      },
      {
        id: "revenue",
        type: "financial_projections",
        heading: "Revenue Projections",
        tableData: {
          headers: [
            "",
            "Q1",
            "Q2",
            "Q3",
            "Q4",
            "Year Total"
          ],
          rows: [
            [
              "MRR",
              "${{mrr_q1}}",
              "${{mrr_q2}}",
              "${{mrr_q3}}",
              "${{mrr_q4}}",
              "${{mrr_total}}"
            ],
            [
              "New Customers",
              "{{nc_q1}}",
              "{{nc_q2}}",
              "{{nc_q3}}",
              "{{nc_q4}}",
              "{{nc_total}}"
            ],
            [
              "Churn",
              "{{churn_q1}}",
              "{{churn_q2}}",
              "{{churn_q3}}",
              "{{churn_q4}}",
              "{{churn_total}}"
            ],
            [
              "ARR",
              "${{arr_q1}}",
              "${{arr_q2}}",
              "${{arr_q3}}",
              "${{arr_q4}}",
              "${{arr_total}}"
            ]
          ]
        }
      },
      {
        id: "costs",
        type: "financial_projections",
        heading: "Cost Structure",
        tableData: {
          headers: [
            "Category",
            "Monthly",
            "Annual",
            "% of Revenue"
          ],
          rows: [
            [
              "Engineering",
              "${{eng_monthly}}",
              "${{eng_annual}}",
              "{{eng_pct}}%"
            ],
            [
              "Sales & Marketing",
              "${{sm_monthly}}",
              "${{sm_annual}}",
              "{{sm_pct}}%"
            ],
            [
              "Operations",
              "${{ops_monthly}}",
              "${{ops_annual}}",
              "{{ops_pct}}%"
            ],
            [
              "G&A",
              "${{ga_monthly}}",
              "${{ga_annual}}",
              "{{ga_pct}}%"
            ],
            [
              "Total",
              "${{total_monthly}}",
              "${{total_annual}}",
              "100%"
            ]
          ]
        }
      },
      {
        id: "unit_econ",
        type: "metrics",
        heading: "Unit Economics",
        metrics: [
          {
            label: "LTV",
            value: "${{ltv}}",
            trend: "up"
          },
          {
            label: "CAC",
            value: "${{cac}}"
          },
          {
            label: "LTV:CAC",
            value: "{{ltv_cac}}x",
            trend: "up"
          },
          {
            label: "Payback Period",
            value: "{{payback_months}} mo"
          },
          {
            label: "Gross Margin",
            value: "{{gross_margin}}%"
          },
          {
            label: "Net Margin",
            value: "{{net_margin}}%"
          }
        ]
      },
      {
        id: "cashflow",
        type: "financial_projections",
        heading: "Cash Flow Projection",
        tableData: {
          headers: [
            "",
            "Year 1",
            "Year 2",
            "Year 3"
          ],
          rows: [
            [
              "Operating Cash Flow",
              "${{ocf_y1}}",
              "${{ocf_y2}}",
              "${{ocf_y3}}"
            ],
            [
              "Capital Expenditure",
              "${{capex_y1}}",
              "${{capex_y2}}",
              "${{capex_y3}}"
            ],
            [
              "Free Cash Flow",
              "${{fcf_y1}}",
              "${{fcf_y2}}",
              "${{fcf_y3}}"
            ],
            [
              "Ending Cash",
              "${{cash_y1}}",
              "${{cash_y2}}",
              "${{cash_y3}}"
            ]
          ]
        }
      },
      {
        id: "funding",
        type: "investment_ask",
        heading: "Funding Requirements",
        body: "Based on projected burn of ${{monthly_burn}}/mo, {{company_name}} requires ${{total_funding}} to reach {{funding_milestone}}.",
        metrics: [
          {
            label: "Raise",
            value: "${{raise_amount}}"
          },
          {
            label: "Runway",
            value: "{{runway}} months"
          },
          {
            label: "Break-even",
            value: "{{breakeven_date}}"
          }
        ]
      }
    ]
  },
  {
    id: "swot-analysis",
    name: "SWOT Analysis",
    title: "SWOT Analysis",
    description: "Strategic planning framework template",
    category: "business-plan",
    industry: "General",
    stage: "Growth",
    designStyle: "Corporate",
    badge: "Pro",
    rating: 4.6,
    pageCount: 4,
    isPremium: true,
    colorScheme: {
      primary: "#8B5CF6",
      secondary: "#6D28D9",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "SWOT Analysis",
        subheading: "{{company_name}}",
        body: "Strategic Assessment | {{date}}\n\nPrepared by {{prepared_by}}",
        layoutHint: "centered"
      },
      {
        id: "exec_summary",
        type: "executive_summary",
        heading: "Executive Summary",
        body: "This SWOT analysis evaluates {{company_name}}'s strategic position in the {{industry_name}} market. The assessment reveals {{key_finding_summary}}.\n\n{{company_name}} is positioned at the {{company_stage}} stage with {{competitive_position_summary}}."
      },
      {
        id: "strengths",
        type: "swot_grid",
        heading: "Strengths",
        body: "Internal capabilities and advantages that give {{company_name}} a competitive edge.",
        bullets: [
          "{{strength_1}}",
          "{{strength_2}}",
          "{{strength_3}}",
          "{{strength_4}}",
          "{{strength_5}}"
        ],
        backgroundColor: "#F0FDF4",
        textColor: "#166534"
      },
      {
        id: "weaknesses",
        type: "swot_grid",
        heading: "Weaknesses",
        body: "Internal limitations that may hinder {{company_name}}'s growth.",
        bullets: [
          "{{weakness_1}}",
          "{{weakness_2}}",
          "{{weakness_3}}",
          "{{weakness_4}}"
        ],
        backgroundColor: "#FEF2F2",
        textColor: "#991B1B"
      },
      {
        id: "opportunities",
        type: "swot_grid",
        heading: "Opportunities",
        body: "External factors {{company_name}} can leverage for growth.",
        bullets: [
          "{{opportunity_1}}",
          "{{opportunity_2}}",
          "{{opportunity_3}}",
          "{{opportunity_4}}"
        ],
        backgroundColor: "#EFF6FF",
        textColor: "#1E40AF"
      },
      {
        id: "threats",
        type: "swot_grid",
        heading: "Threats",
        body: "External challenges that could negatively impact {{company_name}}.",
        bullets: [
          "{{threat_1}}",
          "{{threat_2}}",
          "{{threat_3}}",
          "{{threat_4}}"
        ],
        backgroundColor: "#FEF3C7",
        textColor: "#92400E"
      },
      {
        id: "strategy",
        type: "text",
        heading: "Strategic Recommendations",
        body: "Based on the SWOT analysis, {{company_name}} should pursue the following strategic initiatives:",
        bullets: [
          "SO Strategy (Strengths + Opportunities): {{so_strategy}}",
          "WO Strategy (Weaknesses + Opportunities): {{wo_strategy}}",
          "ST Strategy (Strengths + Threats): {{st_strategy}}",
          "WT Strategy (Weaknesses + Threats): {{wt_strategy}}"
        ]
      },
      {
        id: "action",
        type: "roadmap",
        heading: "Action Plan",
        body: "Implementation timeline for strategic recommendations.",
        tableData: {
          headers: [
            "Priority",
            "Initiative",
            "Timeline",
            "Owner",
            "KPI"
          ],
          rows: [
            [
              "High",
              "{{action_1}}",
              "{{timeline_1}}",
              "{{owner_1}}",
              "{{kpi_1}}"
            ],
            [
              "High",
              "{{action_2}}",
              "{{timeline_2}}",
              "{{owner_2}}",
              "{{kpi_2}}"
            ],
            [
              "Medium",
              "{{action_3}}",
              "{{timeline_3}}",
              "{{owner_3}}",
              "{{kpi_3}}"
            ],
            [
              "Medium",
              "{{action_4}}",
              "{{timeline_4}}",
              "{{owner_4}}",
              "{{kpi_4}}"
            ]
          ]
        }
      }
    ]
  },
  {
    id: "investment-memo",
    name: "Investment Memo",
    title: "Investment Memo",
    description: "Strategic investment analysis template",
    category: "memo",
    industry: "Finance",
    stage: "Series A",
    designStyle: "Corporate",
    badge: "Pro",
    rating: 4.5,
    pageCount: 8,
    isPremium: true,
    colorScheme: {
      primary: "#1E40AF",
      secondary: "#1E3A5F",
      accent: "#10B981",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "Investment Memo",
        subheading: "{{company_name}} — {{funding_round}}",
        body: "Confidential | {{date}}\nPrepared by {{prepared_by}}",
        layoutHint: "centered"
      },
      {
        id: "thesis",
        type: "executive_summary",
        heading: "Investment Thesis",
        body: "We recommend {{investment_recommendation}} in {{company_name}}, a {{company_description}} targeting the ${{market_size}} {{industry_name}} market.\n\nKey conviction drivers:\n{{conviction_driver_1}}\n{{conviction_driver_2}}\n{{conviction_driver_3}}",
        metrics: [
          {
            label: "Ask",
            value: "${{investment_amount}}"
          },
          {
            label: "Valuation",
            value: "${{pre_money_valuation}}"
          },
          {
            label: "Ownership",
            value: "{{ownership_pct}}%"
          },
          {
            label: "Expected Return",
            value: "{{expected_return}}x"
          }
        ]
      },
      {
        id: "company",
        type: "text",
        heading: "Company Overview",
        body: "{{company_name}} was founded in {{founded_year}} by {{founders}}. The company {{company_history_summary}}.\n\nCurrent metrics: {{current_metrics_summary}}",
        bullets: [
          "Product: {{product_summary}}",
          "Market: {{market_position}}",
          "Team: {{team_size}} employees across {{office_locations}}",
          "Funding: {{total_raised}} raised to date"
        ]
      },
      {
        id: "market",
        type: "market_analysis",
        heading: "Market Analysis",
        body: "The {{industry_name}} market represents a ${{tam}} opportunity.",
        metrics: [
          {
            label: "TAM",
            value: "${{tam}}",
            trend: "up"
          },
          {
            label: "Growth Rate",
            value: "{{market_growth}}%",
            trend: "up"
          },
          {
            label: "Key Players",
            value: "{{num_competitors}}"
          }
        ],
        bullets: [
          "{{market_driver_1}}",
          "{{market_driver_2}}",
          "{{market_risk_1}}"
        ]
      },
      {
        id: "financials",
        type: "financial_projections",
        heading: "Financial Analysis",
        body: "{{company_name}} demonstrates {{financial_health_summary}}.",
        tableData: {
          headers: [
            "",
            "Actual LTM",
            "Projected Y1",
            "Projected Y2",
            "Projected Y3"
          ],
          rows: [
            [
              "Revenue",
              "${{rev_ltm}}",
              "${{rev_y1}}",
              "${{rev_y2}}",
              "${{rev_y3}}"
            ],
            [
              "Gross Margin",
              "{{gm_ltm}}%",
              "{{gm_y1}}%",
              "{{gm_y2}}%",
              "{{gm_y3}}%"
            ],
            [
              "EBITDA",
              "${{ebitda_ltm}}",
              "${{ebitda_y1}}",
              "${{ebitda_y2}}",
              "${{ebitda_y3}}"
            ],
            [
              "Cash Burn",
              "${{burn_ltm}}/mo",
              "${{burn_y1}}/mo",
              "${{burn_y2}}/mo",
              "—"
            ]
          ]
        }
      },
      {
        id: "risks",
        type: "text",
        heading: "Key Risks & Mitigants",
        tableData: {
          headers: [
            "Risk",
            "Severity",
            "Probability",
            "Mitigant"
          ],
          rows: [
            [
              "{{risk_1}}",
              "{{severity_1}}",
              "{{probability_1}}",
              "{{mitigant_1}}"
            ],
            [
              "{{risk_2}}",
              "{{severity_2}}",
              "{{probability_2}}",
              "{{mitigant_2}}"
            ],
            [
              "{{risk_3}}",
              "{{severity_3}}",
              "{{probability_3}}",
              "{{mitigant_3}}"
            ]
          ]
        }
      },
      {
        id: "terms",
        type: "text",
        heading: "Proposed Terms",
        body: "Investment structure: {{investment_structure}}",
        bullets: [
          "Investment: ${{investment_amount}} at ${{pre_money_valuation}} pre-money",
          "Instrument: {{instrument_type}}",
          "Board seat: {{board_seat}}",
          "Pro-rata rights: {{pro_rata}}",
          "Liquidation preference: {{liq_pref}}"
        ]
      },
      {
        id: "recommendation",
        type: "text",
        heading: "Recommendation",
        body: "Based on our analysis, we {{final_recommendation}} this investment.\n\n{{recommendation_rationale}}\n\nNext steps: {{next_steps}}"
      }
    ]
  },
  {
    id: "marketing-strategy",
    name: "Marketing Strategy",
    title: "Marketing Strategy",
    description: "Complete marketing plan and roadmap",
    category: "marketing",
    industry: "General",
    stage: "Growth",
    designStyle: "Bold",
    badge: "Popular",
    rating: 4.6,
    pageCount: 18,
    isPremium: false,
    colorScheme: {
      primary: "#EC4899",
      secondary: "#9D174D",
      accent: "#3B82F6",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "Marketing Strategy",
        subheading: "{{company_name}}",
        body: "{{fiscal_year}} Marketing Plan | {{date}}",
        layoutHint: "centered"
      },
      {
        id: "exec",
        type: "executive_summary",
        heading: "Executive Summary",
        body: "This marketing strategy outlines {{company_name}}'s plan to achieve {{primary_marketing_goal}} through {{strategic_approach}}.\n\nTotal budget: ${{annual_marketing_budget}}. Target ROI: {{target_roi}}x.",
        metrics: [
          {
            label: "Budget",
            value: "${{annual_marketing_budget}}"
          },
          {
            label: "Target ROI",
            value: "{{target_roi}}x"
          },
          {
            label: "Target Leads",
            value: "{{target_leads}}/mo"
          }
        ]
      },
      {
        id: "audience",
        type: "text",
        heading: "Target Audience",
        body: "Primary ICP: {{primary_icp_description}}",
        bullets: [
          "Demographics: {{demo_details}}",
          "Pain points: {{audience_pain_points}}",
          "Channels: {{preferred_channels}}",
          "Decision makers: {{decision_maker_profile}}"
        ]
      },
      {
        id: "channels",
        type: "text",
        heading: "Channel Strategy",
        tableData: {
          headers: [
            "Channel",
            "Budget",
            "Target KPI",
            "Owner"
          ],
          rows: [
            [
              "{{channel_1}}",
              "${{channel_1_budget}}",
              "{{channel_1_kpi}}",
              "{{channel_1_owner}}"
            ],
            [
              "{{channel_2}}",
              "${{channel_2_budget}}",
              "{{channel_2_kpi}}",
              "{{channel_2_owner}}"
            ],
            [
              "{{channel_3}}",
              "${{channel_3_budget}}",
              "{{channel_3_kpi}}",
              "{{channel_3_owner}}"
            ],
            [
              "{{channel_4}}",
              "${{channel_4_budget}}",
              "{{channel_4_kpi}}",
              "{{channel_4_owner}}"
            ]
          ]
        }
      },
      {
        id: "content",
        type: "text",
        heading: "Content Strategy",
        body: "Content pillars for {{company_name}}:",
        bullets: [
          "{{content_pillar_1}}: {{pillar_1_desc}}",
          "{{content_pillar_2}}: {{pillar_2_desc}}",
          "{{content_pillar_3}}: {{pillar_3_desc}}"
        ]
      },
      {
        id: "timeline",
        type: "roadmap",
        heading: "Marketing Roadmap",
        tableData: {
          headers: [
            "Quarter",
            "Focus",
            "Key Initiatives",
            "Budget"
          ],
          rows: [
            [
              "Q1",
              "{{q1_focus}}",
              "{{q1_initiatives}}",
              "${{q1_budget}}"
            ],
            [
              "Q2",
              "{{q2_focus}}",
              "{{q2_initiatives}}",
              "${{q2_budget}}"
            ],
            [
              "Q3",
              "{{q3_focus}}",
              "{{q3_initiatives}}",
              "${{q3_budget}}"
            ],
            [
              "Q4",
              "{{q4_focus}}",
              "{{q4_initiatives}}",
              "${{q4_budget}}"
            ]
          ]
        }
      },
      {
        id: "kpis",
        type: "metrics",
        heading: "KPIs & Measurement",
        metrics: [
          {
            label: "MQLs/mo",
            value: "{{target_mqls}}"
          },
          {
            label: "Conversion",
            value: "{{target_conversion}}%"
          },
          {
            label: "CAC",
            value: "${{target_cac}}"
          },
          {
            label: "Pipeline",
            value: "${{target_pipeline}}"
          }
        ]
      }
    ]
  },
  {
    id: "fintech-pitch-deck",
    name: "FinTech Pitch Deck",
    title: "FinTech Pitch Deck",
    description: "Specialized pitch deck for financial technology startups",
    category: "pitch-deck",
    industry: "FinTech",
    stage: "Seed",
    designStyle: "Modern",
    badge: "Popular",
    rating: 4.9,
    pageCount: 16,
    isPremium: false,
    colorScheme: {
      primary: "#1E40AF",
      secondary: "#1E3A5F",
      accent: "#10B981",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "{{company_name}}",
        subheading: "{{tagline}}",
        body: "Transforming {{fintech_sector}} | {{funding_round}} Deck",
        layoutHint: "centered"
      },
      {
        id: "problem",
        type: "problem",
        heading: "The Problem",
        body: "The {{fintech_sector}} industry processes ${{industry_volume}} annually, yet {{problem_description}}.",
        bullets: [
          "{{regulatory_pain}}",
          "{{consumer_pain}}",
          "{{technology_pain}}"
        ],
        metrics: [
          {
            label: "Market Inefficiency",
            value: "${{inefficiency_cost}}"
          }
        ]
      },
      {
        id: "solution",
        type: "solution",
        heading: "Our Solution",
        body: "{{company_name}} provides {{solution_description}} using {{technology_approach}}.",
        bullets: [
          "{{feature_1}}: {{feature_1_benefit}}",
          "{{feature_2}}: {{feature_2_benefit}}",
          "{{feature_3}}: {{feature_3_benefit}}"
        ]
      },
      {
        id: "regulatory",
        type: "text",
        heading: "Regulatory & Compliance",
        body: "{{company_name}} operates under {{regulatory_framework}}.",
        bullets: [
          "Licenses: {{licenses_held}}",
          "Compliance: {{compliance_standards}}",
          "Data Security: {{security_certifications}}",
          "Jurisdictions: {{operating_jurisdictions}}"
        ]
      },
      {
        id: "market",
        type: "market_analysis",
        heading: "Market Opportunity",
        metrics: [
          {
            label: "TAM",
            value: "${{tam}}",
            trend: "up"
          },
          {
            label: "SAM",
            value: "${{sam}}",
            trend: "up"
          },
          {
            label: "SOM",
            value: "${{som}}",
            trend: "up"
          }
        ],
        body: "The {{fintech_sector}} market is growing at {{cagr}}% CAGR."
      },
      {
        id: "model",
        type: "business_model",
        heading: "Revenue Model",
        body: "{{company_name}} monetizes through {{revenue_streams}}.",
        metrics: [
          {
            label: "Take Rate",
            value: "{{take_rate}}%"
          },
          {
            label: "ARPU",
            value: "${{arpu}}"
          },
          {
            label: "LTV",
            value: "${{ltv}}"
          }
        ]
      },
      {
        id: "traction",
        type: "traction",
        heading: "Traction",
        metrics: [
          {
            label: "TPV",
            value: "${{tpv}}",
            trend: "up"
          },
          {
            label: "Users",
            value: "{{users}}",
            trend: "up"
          },
          {
            label: "Revenue",
            value: "${{revenue}}",
            trend: "up"
          },
          {
            label: "Growth",
            value: "{{growth}}% MoM",
            trend: "up"
          }
        ]
      },
      {
        id: "team",
        type: "team",
        heading: "Team",
        bullets: [
          "{{founder_1}}, CEO — {{founder_1_bg}}",
          "{{founder_2}}, CTO — {{founder_2_bg}}",
          "{{advisor_1}} — {{advisor_1_bg}}"
        ]
      },
      {
        id: "ask",
        type: "investment_ask",
        heading: "Investment Ask",
        body: "Raising ${{raise_amount}} at ${{valuation}} valuation.",
        bullets: [
          "{{alloc_1_pct}}% — {{alloc_1}}",
          "{{alloc_2_pct}}% — {{alloc_2}}",
          "{{alloc_3_pct}}% — {{alloc_3}}"
        ]
      }
    ]
  },
  {
    id: "tech-one-pager",
    name: "Tech Startup One-Pager",
    title: "Tech Startup One-Pager",
    description: "Concise business overview document",
    category: "one-pager",
    industry: "Tech",
    stage: "Pre-seed",
    designStyle: "Minimal",
    badge: "New",
    rating: 4.8,
    pageCount: 1,
    isPremium: false,
    colorScheme: {
      primary: "#0D9488",
      secondary: "#115E59",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "header",
        type: "cover",
        heading: "{{company_name}}",
        subheading: "{{tagline}}",
        body: "{{website}} | {{contact_email}} | {{location}}",
        layoutHint: "centered"
      },
      {
        id: "overview",
        type: "executive_summary",
        heading: "Overview",
        body: "{{company_name}} is {{company_description}}. We solve {{problem_summary}} for {{target_customer}} by {{solution_summary}}.",
        metrics: [
          {
            label: "Stage",
            value: "{{company_stage}}"
          },
          {
            label: "Raising",
            value: "${{raise_amount}}"
          },
          {
            label: "Team Size",
            value: "{{team_size}}"
          }
        ]
      },
      {
        id: "traction",
        type: "traction",
        heading: "Traction",
        metrics: [
          {
            label: "{{metric_1_label}}",
            value: "{{metric_1_value}}",
            trend: "up"
          },
          {
            label: "{{metric_2_label}}",
            value: "{{metric_2_value}}",
            trend: "up"
          },
          {
            label: "{{metric_3_label}}",
            value: "{{metric_3_value}}",
            trend: "up"
          }
        ],
        bullets: [
          "{{traction_highlight_1}}",
          "{{traction_highlight_2}}"
        ]
      },
      {
        id: "ask",
        type: "investment_ask",
        heading: "The Ask",
        body: "Raising ${{raise_amount}} to {{funding_purpose}}.",
        bullets: [
          "{{use_1}}",
          "{{use_2}}",
          "{{use_3}}"
        ]
      },
      {
        id: "team",
        type: "team",
        heading: "Team",
        bullets: [
          "{{founder_1}} — {{founder_1_role}}, {{founder_1_bg}}",
          "{{founder_2}} — {{founder_2_role}}, {{founder_2_bg}}"
        ]
      }
    ]
  },
  {
    id: "data-room",
    name: "Data Room Template",
    title: "Data Room Template",
    description: "Comprehensive virtual data room index",
    category: "data-room",
    industry: "General",
    stage: "Series A",
    designStyle: "Corporate",
    badge: "Pro",
    rating: 4.6,
    pageCount: 20,
    isPremium: true,
    colorScheme: {
      primary: "#111827",
      secondary: "#374151",
      accent: "#3B82F6",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "index",
        type: "cover",
        heading: "Data Room",
        subheading: "{{company_name}}",
        body: "Virtual Data Room Index | {{date}} | Confidential",
        layoutHint: "centered"
      },
      {
        id: "overview",
        type: "executive_summary",
        heading: "Company Overview",
        body: "{{company_name}} — {{company_description}}\n\nFounded: {{founded_year}} | HQ: {{headquarters}} | Team: {{team_size}}",
        bullets: [
          "Legal Entity: {{legal_entity}}",
          "Registration: {{registration_number}}",
          "Website: {{website}}"
        ]
      },
      {
        id: "corporate",
        type: "text",
        heading: "Corporate Documents",
        bullets: [
          "Certificate of Incorporation: {{incorporation_status}}",
          "Articles of Association: {{articles_status}}",
          "Board Resolutions: {{board_resolutions_status}}",
          "Shareholder Agreements: {{sha_status}}",
          "Stock Option Plan: {{esop_status}}"
        ]
      },
      {
        id: "financials",
        type: "financial_projections",
        heading: "Financial Documents",
        bullets: [
          "Audited Financials ({{fin_years}}): {{audit_status}}",
          "Tax Returns: {{tax_status}}",
          "Bank Statements: {{bank_status}}",
          "Financial Model: {{model_status}}",
          "Cap Table: {{cap_table_status}}"
        ]
      },
      {
        id: "legal",
        type: "text",
        heading: "Legal & IP",
        bullets: [
          "Patents: {{patents_status}}",
          "Trademarks: {{trademarks_status}}",
          "Material Contracts: {{contracts_status}}",
          "Litigation: {{litigation_status}}",
          "Insurance: {{insurance_status}}"
        ]
      },
      {
        id: "product",
        type: "text",
        heading: "Product & Technology",
        bullets: [
          "Product Roadmap: {{roadmap_status}}",
          "Technical Architecture: {{architecture_status}}",
          "Security Audit: {{security_status}}",
          "SOC 2 Compliance: {{soc2_status}}"
        ]
      },
      {
        id: "customers",
        type: "text",
        heading: "Customers & Revenue",
        bullets: [
          "Customer List (Top {{top_n_customers}}): {{customer_list_status}}",
          "Revenue Breakdown: {{revenue_breakdown_status}}",
          "Churn Analysis: {{churn_analysis_status}}",
          "NPS Score: {{nps_status}}"
        ]
      },
      {
        id: "team_docs",
        type: "text",
        heading: "Team & HR",
        bullets: [
          "Org Chart: {{org_chart_status}}",
          "Key Employee Agreements: {{employment_agreements_status}}",
          "Advisory Board: {{advisory_status}}",
          "D&O Insurance: {{do_insurance_status}}"
        ]
      }
    ]
  },
  {
    id: "ai-ml-startup-deck",
    name: "AI/ML Startup Deck",
    title: "AI/ML Startup Deck",
    description: "Pitch deck for AI and machine learning startups",
    category: "pitch-deck",
    industry: "AI/ML",
    stage: "Seed",
    designStyle: "Tech",
    badge: "Popular",
    rating: 4.8,
    pageCount: 18,
    isPremium: false,
    colorScheme: {
      primary: "#8B5CF6",
      secondary: "#5B21B6",
      accent: "#10B981",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "cover",
        type: "cover",
        heading: "{{company_name}}",
        subheading: "{{tagline}}",
        body: "AI-Powered {{product_category}} | {{funding_round}}",
        layoutHint: "centered"
      },
      {
        id: "problem",
        type: "problem",
        heading: "The Problem",
        body: "{{industry_name}} generates {{data_volume}} of data annually, yet {{problem_statement}}.",
        bullets: [
          "{{pain_point_1}}",
          "{{pain_point_2}}",
          "{{pain_point_3}}"
        ]
      },
      {
        id: "solution",
        type: "solution",
        heading: "AI-Powered Solution",
        body: "{{company_name}} uses {{ml_approach}} to {{solution_description}}.",
        bullets: [
          "Model: {{model_type}} — {{model_description}}",
          "Data: {{data_advantage}}",
          "Accuracy: {{accuracy_metric}}"
        ]
      },
      {
        id: "technology",
        type: "text",
        heading: "Technology Deep Dive",
        body: "Our proprietary {{technology_name}} achieves {{performance_metric}} on {{benchmark_name}}.",
        bullets: [
          "Architecture: {{architecture_desc}}",
          "Training Data: {{training_data_desc}}",
          "Inference Speed: {{inference_speed}}",
          "Competitive Advantage: {{tech_moat}}"
        ]
      },
      {
        id: "market",
        type: "market_analysis",
        heading: "Market",
        metrics: [
          {
            label: "AI Market",
            value: "${{ai_market_size}}",
            trend: "up"
          },
          {
            label: "Growth",
            value: "{{ai_growth}}%",
            trend: "up"
          },
          {
            label: "Our Segment",
            value: "${{segment_size}}"
          }
        ]
      },
      {
        id: "model",
        type: "business_model",
        heading: "Business Model",
        body: "{{revenue_model_description}}",
        metrics: [
          {
            label: "API Calls/mo",
            value: "{{api_calls}}"
          },
          {
            label: "ARPU",
            value: "${{arpu}}"
          },
          {
            label: "Gross Margin",
            value: "{{gross_margin}}%"
          }
        ]
      },
      {
        id: "traction",
        type: "traction",
        heading: "Traction",
        metrics: [
          {
            label: "Customers",
            value: "{{customers}}",
            trend: "up"
          },
          {
            label: "ARR",
            value: "${{arr}}",
            trend: "up"
          },
          {
            label: "Growth",
            value: "{{growth}}%",
            trend: "up"
          }
        ]
      },
      {
        id: "team",
        type: "team",
        heading: "Team",
        bullets: [
          "{{founder_1}} — {{f1_title}}, {{f1_bg}}",
          "{{founder_2}} — {{f2_title}}, {{f2_bg}}"
        ]
      },
      {
        id: "ask",
        type: "investment_ask",
        heading: "The Ask",
        body: "Raising ${{raise_amount}} to {{funding_purpose}}.",
        metrics: [
          {
            label: "Raise",
            value: "${{raise_amount}}"
          },
          {
            label: "Valuation",
            value: "${{valuation}}"
          }
        ]
      }
    ]
  },
  {
    id: "gtm-one-pager",
    name: "GTM Strategy One-Pager",
    title: "GTM Strategy One-Pager",
    description: "Go-to-market strategy on a single page",
    category: "one-pager",
    industry: "General",
    stage: "Growth",
    designStyle: "Minimal",
    badge: "New",
    rating: 4.6,
    pageCount: 1,
    isPremium: false,
    colorScheme: {
      primary: "#059669",
      secondary: "#064E3B",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827"
    },
    sections: [
      {
        id: "header",
        type: "cover",
        heading: "GTM Strategy",
        subheading: "{{company_name}}",
        body: "{{product_name}} | {{target_launch_date}}",
        layoutHint: "centered"
      },
      {
        id: "target",
        type: "text",
        heading: "Target Market",
        body: "ICP: {{ideal_customer_profile}}",
        bullets: [
          "Segment: {{primary_segment}}",
          "Decision Maker: {{decision_maker}}",
          "Budget: ${{typical_budget}}",
          "Sales Cycle: {{sales_cycle_length}}"
        ]
      },
      {
        id: "channels",
        type: "text",
        heading: "Go-to-Market Channels",
        tableData: {
          headers: [
            "Channel",
            "Strategy",
            "KPI",
            "Budget"
          ],
          rows: [
            [
              "{{channel_1}}",
              "{{strategy_1}}",
              "{{kpi_1}}",
              "${{budget_1}}"
            ],
            [
              "{{channel_2}}",
              "{{strategy_2}}",
              "{{kpi_2}}",
              "${{budget_2}}"
            ],
            [
              "{{channel_3}}",
              "{{strategy_3}}",
              "{{kpi_3}}",
              "${{budget_3}}"
            ]
          ]
        }
      },
      {
        id: "pricing",
        type: "text",
        heading: "Pricing",
        body: "{{pricing_strategy_description}}",
        metrics: [
          {
            label: "Starter",
            value: "${{starter_price}}/mo"
          },
          {
            label: "Pro",
            value: "${{pro_price}}/mo"
          },
          {
            label: "Enterprise",
            value: "Custom"
          }
        ]
      },
      {
        id: "milestones",
        type: "roadmap",
        heading: "90-Day Milestones",
        bullets: [
          "Day 1-30: {{milestone_30}}",
          "Day 31-60: {{milestone_60}}",
          "Day 61-90: {{milestone_90}}"
        ]
      }
    ]
  },
  {
    id: 'non-disclosure-agreement',
    title: 'Non-Disclosure Agreement',
    description: 'Protect your confidential information with this standard NDA template.',
    category: 'Legal',
    icon: 'ShieldCheck',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'This Non-Disclosure Agreement (the "Agreement") is entered into by and between...' },
        { id: '2', type: 'text', content: '1. Definition of Confidential Information...' }
      ]
    }
  },
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    description: 'Standard employment agreement for new hires.',
    category: 'HR',
    icon: 'Users',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'This Employment Contract is made on [Date] between [Employer] and [Employee].' }
      ]
    }
  },
  {
    id: 'consulting-agreement',
    title: 'Consulting Agreement',
    description: 'Agreement for independent contractors and consultants.',
    category: 'Legal',
    icon: 'FileText',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'The Consultant shall provide the following services...' }
      ]
    }
  },
  {
    id: 'software-license-agreement',
    title: 'Software License Agreement',
    description: 'Terms for licensing software to end users.',
    category: 'Legal',
    icon: 'Code',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Subject to the terms of this Agreement, Licensor grants to Licensee...' }
      ]
    }
  },
  {
    id: 'privacy-policy-template',
    title: 'Privacy Policy',
    description: 'Standard privacy policy for websites and apps.',
    category: 'Legal',
    icon: 'Lock',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'We respect your privacy and are committed to protecting it...' }
      ]
    }
  },
  {
    id: 'terms-of-service-template',
    title: 'Terms of Service',
    description: 'Standard terms and conditions for your platform.',
    category: 'Legal',
    icon: 'FileText',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'By using our services, you agree to these terms...' }
      ]
    }
  },
  {
    id: 'partnership-agreement',
    title: 'Partnership Agreement',
    description: 'Formalize a business partnership.',
    category: 'Legal',
    icon: 'Handshake',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'The Partners agree to form a partnership for the purpose of...' }
      ]
    }
  },
  {
    id: 'sales-proposal',
    title: 'Sales Proposal',
    description: 'Professional proposal to win new clients.',
    category: 'Sales',
    icon: 'TrendingUp',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'We are pleased to submit this proposal for [Project Name]...' }
      ]
    }
  },
  {
    id: 'marketing-report',
    title: 'Marketing Report',
    description: 'Monthly or quarterly marketing performance report.',
    category: 'Marketing',
    icon: 'BarChart2',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Executive Summary of Marketing Performance...' }
      ]
    }
  },
  {
    id: 'social-media-strategy',
    title: 'Social Media Strategy',
    description: 'Plan your social media presence across platforms.',
    category: 'Marketing',
    icon: 'Share2',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Our social media goals for this quarter are...' }
      ]
    }
  },
  {
    id: 'content-calendar',
    title: 'Content Calendar',
    description: 'Organize your content production and publishing.',
    category: 'Marketing',
    icon: 'Calendar',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Upcoming content pieces and publication dates...' }
      ]
    }
  },
  {
    id: 'brand-guidelines',
    title: 'Brand Guidelines',
    description: 'Define your brand identity, voice, and visuals.',
    category: 'Marketing',
    icon: 'Palette',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Our brand mission and visual identity standards...' }
      ]
    }
  },
  {
    id: 'press-release',
    title: 'Press Release',
    description: 'Announce major news to the media.',
    category: 'Marketing',
    icon: 'Megaphone',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'FOR IMMEDIATE RELEASE: [Headline]...' }
      ]
    }
  },
  {
    id: 'seo-audit-report',
    title: 'SEO Audit Report',
    description: 'Analyze and improve your website search performance.',
    category: 'Marketing',
    icon: 'Search',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Current SEO status and recommendations for improvement...' }
      ]
    }
  },
  {
    id: 'customer-journey-map',
    title: 'Customer Journey Map',
    description: 'Visualize the customer experience with your brand.',
    category: 'Marketing',
    icon: 'Map',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Steps a customer takes from awareness to purchase...' }
      ]
    }
  },
  {
    id: 'product-roadmap',
    title: 'Product Roadmap',
    description: 'Plan and communicate your product vision.',
    category: 'Product',
    icon: 'Map',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Upcoming features and product milestones...' }
      ]
    }
  },
  {
    id: 'user-persona',
    title: 'User Persona',
    description: 'Define your target audience in detail.',
    category: 'Product',
    icon: 'User',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Meet [Persona Name], our target user...' }
      ]
    }
  },
  {
    id: 'feature-specification',
    title: 'Feature Specification',
    description: 'Detailed requirements for a new product feature.',
    category: 'Product',
    icon: 'FileCode',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Functional and non-functional requirements for [Feature]...' }
      ]
    }
  },
  {
    id: 'user-feedback-report',
    title: 'User Feedback Report',
    description: 'Summarize insights from user interviews and tests.',
    category: 'Product',
    icon: 'MessageSquare',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Key takeaways from recent user testing sessions...' }
      ]
    }
  },
  {
    id: 'incident-report',
    title: 'Incident Report',
    description: 'Document and analyze technical incidents.',
    category: 'Operations',
    icon: 'AlertTriangle',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Description of the incident and resolution steps...' }
      ]
    }
  },
  {
    id: 'project-charter',
    title: 'Project Charter',
    description: 'Define the scope and objectives of a new project.',
    category: 'Operations',
    icon: 'Clipboard',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Project goals, stakeholders, and high-level timeline...' }
      ]
    }
  },
  {
    id: 'meeting-minutes',
    title: 'Meeting Minutes',
    description: 'Record decisions and action items from meetings.',
    category: 'Operations',
    icon: 'Clock',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Attendees, discussion points, and next steps...' }
      ]
    }
  },
  {
    id: 'employee-handbook',
    title: 'Employee Handbook',
    description: 'Company policies and culture guide for employees.',
    category: 'HR',
    icon: 'BookOpen',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Welcome to the team! Here is what you need to know...' }
      ]
    }
  },
  {
    id: 'performance-review',
    title: 'Performance Review',
    description: 'Template for annual or quarterly employee reviews.',
    category: 'HR',
    icon: 'Star',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Review of achievements and areas for growth...' }
      ]
    }
  },
  {
    id: 'job-description',
    title: 'Job Description',
    description: 'Clear and compelling job posting template.',
    category: 'HR',
    icon: 'Briefcase',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'We are looking for a [Job Title] to join our team...' }
      ]
    }
  },
  {
    id: 'onboarding-checklist',
    title: 'Onboarding Checklist',
    description: 'Ensure a smooth start for new hires.',
    category: 'HR',
    icon: 'CheckSquare',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Tasks to complete during the first week...' }
      ]
    }
  },
  {
    id: 'exit-interview-form',
    title: 'Exit Interview Form',
    description: 'Gather feedback from departing employees.',
    category: 'HR',
    icon: 'LogOut',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Thank you for your time. Please share your feedback...' }
      ]
    }
  },
  {
    id: 'budget-proposal',
    title: 'Budget Proposal',
    description: 'Request funding for a project or department.',
    category: 'Finance',
    icon: 'DollarSign',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Estimated costs and justification for funding...' }
      ]
    }
  },
  {
    id: 'expense-report',
    title: 'Expense Report',
    description: 'Standard form for employee expense reimbursement.',
    category: 'Finance',
    icon: 'Receipt',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'List of expenses incurred for business purposes...' }
      ]
    }
  },
  {
    id: 'investment-teaser',
    title: 'Investment Teaser',
    description: 'One-page summary to attract potential investors.',
    category: 'Finance',
    icon: 'Zap',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'High-level overview of the investment opportunity...' }
      ]
    }
  },
  {
    id: 'term-sheet',
    title: 'Term Sheet',
    description: 'Outline the key terms of an investment deal.',
    category: 'Finance',
    icon: 'FileText',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Summary of terms for the proposed investment...' }
      ]
    }
  },
  {
    id: 'grant-proposal',
    title: 'Grant Proposal',
    description: 'Apply for funding from foundations or government.',
    category: 'Finance',
    icon: 'Award',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Project description and impact for grant application...' }
      ]
    }
  },
  {
    id: 'inventory-report',
    title: 'Inventory Report',
    description: 'Track and manage stock levels.',
    category: 'Operations',
    icon: 'Package',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Current stock levels and reorder points...' }
      ]
    }
  },
  {
    id: 'service-level-agreement',
    title: 'Service Level Agreement',
    description: 'Define service standards for clients.',
    category: 'Operations',
    icon: 'Clock',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Uptime guarantees and support response times...' }
      ]
    }
  },
  {
    id: 'quality-assurance-plan',
    title: 'Quality Assurance Plan',
    description: 'Ensure product quality through testing.',
    category: 'Operations',
    icon: 'CheckCircle',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Testing procedures and quality standards...' }
      ]
    }
  },
  {
    id: 'disaster-recovery-plan',
    title: 'Disaster Recovery Plan',
    description: 'Prepare for and recover from major disruptions.',
    category: 'Operations',
    icon: 'LifeBuoy',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Steps to take in the event of a disaster...' }
      ]
    }
  },
  {
    id: 'training-manual',
    title: 'Training Manual',
    description: 'Guide for training employees or customers.',
    category: 'Operations',
    icon: 'GraduationCap',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Step-by-step instructions for [Process]...' }
      ]
    }
  },
  {
    id: 'event-plan',
    title: 'Event Plan',
    description: 'Organize and manage business events.',
    category: 'Operations',
    icon: 'Calendar',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Event logistics, speakers, and schedule...' }
      ]
    }
  },
  {
    id: 'vendor-contract',
    title: 'Vendor Contract',
    description: 'Agreement for purchasing goods or services.',
    category: 'Legal',
    icon: 'Truck',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Terms and conditions for vendor services...' }
      ]
    }
  },
  {
    id: 'board-meeting-agenda',
    title: 'Board Meeting Agenda',
    description: 'Structure for productive board meetings.',
    category: 'Operations',
    icon: 'List',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Topics for discussion at the board meeting...' }
      ]
    }
  },
  {
    id: 'annual-report',
    title: 'Annual Report',
    description: 'Comprehensive summary of company performance.',
    category: 'Finance',
    icon: 'FileText',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Year in review and financial highlights...' }
      ]
    }
  },
  {
    id: 'strategic-plan',
    title: 'Strategic Plan',
    description: 'Long-term goals and action plans.',
    category: 'Business',
    icon: 'Target',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Our 3-5 year vision and strategic pillars...' }
      ]
    }
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Identify and mitigate business risks.',
    category: 'Operations',
    icon: 'Shield',
    content: {
      sections: [
        { id: '1', type: 'text', content: 'Analysis of potential risks and mitigation strategies...' }
      ]
    }
  }
];

export default TEMPLATES;
