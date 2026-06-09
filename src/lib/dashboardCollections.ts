import { collection } from "firebase/firestore";
import { db } from "./firebase";

export const dashboardMetricsCollection = collection(db, "dashboard_metrics");
export const investorInsightsCollection = collection(db, "investor_insights");
export const companyDnaCollection = collection(db, "company_dna");
