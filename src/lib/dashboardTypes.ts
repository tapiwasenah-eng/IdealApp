import { Timestamp } from "firebase/firestore";

export interface DashboardMetric {
  id: string;
  owner_uid: string;
  label: string;
  value: number;
  delta_pct?: number;
  direction?: "up" | "down" | "flat";
}

export interface InvestorInsight {
  id: string;
  owner_uid: string;
  workspace_id: string;
  firm_name: string;
  partner_name?: string;
  title: string;
  recorded_at: Timestamp;
  key_takeaways: string[];
  transcript_summary_id?: string;
}

export interface CompanyDNAProfile {
  id: string;
  owner_uid: string;
  name: string;
  sector: import("./firestoreTypes").TemplateSector | "general";
  stage: "pre_seed" | "seed" | "series_a" | "series_b_plus";
  geo: string;
  profile_completeness: number;
  missing_fields?: string[];
  updated_at: Timestamp;
}
