import { DocumentSection } from "../types";

export type TemplateSector =
  | "saas"
  | "deeptech"
  | "fintech"
  | "b2b_marketplace"
  | "climate"
  | "consumer"
  | "healthcare"
  | "general"
  | "custom";


export interface PitchTemplate {
  id: string;
  name: string;
  sector: TemplateSector;
  stage: "pre_seed" | "seed" | "series_a" | "series_b_plus";
  complexity: "light" | "standard" | "advanced";
  body_markdown: string;
  created_at: import("firebase/firestore").Timestamp;
  updated_at: import("firebase/firestore").Timestamp;
}

export interface WorkspaceDoc {
  id: string;
  owner_uid: string;
  name: string;
  type: "pitch_deck" | "financial_model" | "data_room" | "memo";
  sector: TemplateSector | "general";
  template_id?: string;
  created_at: import("firebase/firestore").Timestamp;
  updated_at: import("firebase/firestore").Timestamp;
}
