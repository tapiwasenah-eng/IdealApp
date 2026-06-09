import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  dashboardMetricsCollection,
  investorInsightsCollection,
  companyDnaCollection,
} from "./dashboardCollections";
import {
  DashboardMetric,
  InvestorInsight,
  CompanyDNAProfile,
} from "./dashboardTypes";

export async function fetchDashboardMetrics(ownerUid: string) {
  const q = query(
    dashboardMetricsCollection,
    where("owner_uid", "==", ownerUid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DashboardMetric);
}

export async function fetchRecentInvestorInsights(ownerUid: string) {
  const q = query(
    investorInsightsCollection,
    where("owner_uid", "==", ownerUid),
    orderBy("recorded_at", "desc"),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as InvestorInsight);
}

export async function fetchCompanyDNA(ownerUid: string) {
  const q = query(
    companyDnaCollection,
    where("owner_uid", "==", ownerUid),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as CompanyDNAProfile;
}
