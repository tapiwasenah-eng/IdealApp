export type AnalyticsEvent =
  // Account lifecycle
  | "user_signed_up"
  | "user_logged_in"
  | "user_upgraded_plan"
  | "user_downgraded_plan"
  // Activation
  | "workspace_created"
  | "template_used"
  | "document_generated_from_wizard"
  | "section_edited"
  // Growth loops
  | "investor_view_link_created"
  | "investor_view_opened"
  | "data_room_link_created"
  | "data_room_viewed"
  | "document_exported"
  | "collaborator_invited"
  // Monetisation
  | "plan_limit_reached"
  | "upgrade_modal_shown"
  | "upgrade_clicked"
  // Legacy events to avoid breaking existing code
  | "doc_created"
  | "doc_added_to_dataroom"
  | "investor_touchpoint_created"
  | "shared_link_created"
  | "investor_update_sent"
  | "user_activation_step";

export interface AnalyticsProps {
  user_id?: string;
  workspace_id?: string;
  document_id?: string;
  plan_type?: string;
  source?: string;
  [key: string]: any;
}

export function track(event: AnalyticsEvent | string, props?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  // Placeholder: later we will plug PostHog/Mixpanel here.
  // For now, just console.log to verify.
  console.log("[analytics]", event, props);
}

export function trackTemplateEvent(
  event: AnalyticsEvent | string,
  props: Record<string, any>
) {
  track(event, props);
}
