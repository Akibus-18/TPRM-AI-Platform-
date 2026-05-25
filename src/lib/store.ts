"use client";
import { Vendor, Assessment, Evidence, ActivityLog, AppSettings } from "@/types";
import { sampleVendors, sampleAssessments, sampleEvidence, sampleActivity } from "./sample-data";
import { generateAISummary } from "./ai-summary";
import { calculateRiskScore } from "./risk-engine";

const STORAGE_KEYS = {
  vendors: "tprm_vendors",
  assessments: "tprm_assessments",
  evidence: "tprm_evidence",
  activity: "tprm_activity",
  settings: "tprm_settings",
  initialized: "tprm_initialized",
};

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

export function initializeData(): void {
  if (typeof window === "undefined") return;
  const initialized = localStorage.getItem(STORAGE_KEYS.initialized);
  if (!initialized) {
    setToStorage(STORAGE_KEYS.vendors, sampleVendors);
    // Generate AI summaries for completed assessments
    const assessments = sampleAssessments.map((a) => {
      const vendor = sampleVendors.find((v) => v.id === a.vendorId);
      if (vendor && a.findings.length > 0) {
        const riskScore = calculateRiskScore(a.findings);
        return { ...a, score: riskScore.overall, aiSummary: generateAISummary(vendor, riskScore, a.findings) };
      }
      return a;
    });
    setToStorage(STORAGE_KEYS.assessments, assessments);
    setToStorage(STORAGE_KEYS.evidence, sampleEvidence);
    setToStorage(STORAGE_KEYS.activity, sampleActivity);
    setToStorage(STORAGE_KEYS.initialized, "true");
  }
}

// Vendors
export function getVendors(): Vendor[] {
  return getFromStorage<Vendor[]>(STORAGE_KEYS.vendors, []);
}

export function getVendor(id: string): Vendor | undefined {
  return getVendors().find((v) => v.id === id);
}

export function saveVendor(vendor: Vendor): void {
  const vendors = getVendors();
  const index = vendors.findIndex((v) => v.id === vendor.id);
  if (index >= 0) {
    vendors[index] = { ...vendor, updatedAt: new Date().toISOString() };
  } else {
    vendors.push({ ...vendor, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  setToStorage(STORAGE_KEYS.vendors, vendors);
  addActivity({
    id: `act-${Date.now()}`,
    action: index >= 0 ? "Vendor updated" : "Vendor onboarded",
    entity: vendor.name,
    entityType: "vendor",
    timestamp: new Date().toISOString(),
    user: "Current User",
  });
}

export function deleteVendor(id: string): void {
  const vendors = getVendors().filter((v) => v.id !== id);
  setToStorage(STORAGE_KEYS.vendors, vendors);
}

// Assessments
export function getAssessments(): Assessment[] {
  return getFromStorage<Assessment[]>(STORAGE_KEYS.assessments, []);
}

export function getAssessment(id: string): Assessment | undefined {
  return getAssessments().find((a) => a.id === id);
}

export function getAssessmentsByVendor(vendorId: string): Assessment[] {
  return getAssessments().filter((a) => a.vendorId === vendorId);
}

export function saveAssessment(assessment: Assessment): void {
  const assessments = getAssessments();
  const index = assessments.findIndex((a) => a.id === assessment.id);
  if (index >= 0) {
    assessments[index] = assessment;
  } else {
    assessments.push(assessment);
  }
  setToStorage(STORAGE_KEYS.assessments, assessments);
  addActivity({
    id: `act-${Date.now()}`,
    action: index >= 0 ? "Assessment updated" : "Assessment created",
    entity: assessment.vendorName,
    entityType: "assessment",
    timestamp: new Date().toISOString(),
    user: "Current User",
  });
}

export function deleteAssessment(id: string): void {
  const assessments = getAssessments().filter((a) => a.id !== id);
  setToStorage(STORAGE_KEYS.assessments, assessments);
}

// Evidence
export function getEvidence(): Evidence[] {
  return getFromStorage<Evidence[]>(STORAGE_KEYS.evidence, []);
}

export function saveEvidence(evidence: Evidence): void {
  const all = getEvidence();
  all.push(evidence);
  setToStorage(STORAGE_KEYS.evidence, all);
  addActivity({
    id: `act-${Date.now()}`,
    action: "Evidence uploaded",
    entity: evidence.vendorName,
    entityType: "evidence",
    timestamp: new Date().toISOString(),
    user: "Current User",
  });
}

export function deleteEvidence(id: string): void {
  const all = getEvidence().filter((e) => e.id !== id);
  setToStorage(STORAGE_KEYS.evidence, all);
}

// Activity
export function getActivity(): ActivityLog[] {
  return getFromStorage<ActivityLog[]>(STORAGE_KEYS.activity, []);
}

export function addActivity(log: ActivityLog): void {
  const activity = getActivity();
  activity.unshift(log);
  if (activity.length > 50) activity.pop();
  setToStorage(STORAGE_KEYS.activity, activity);
}

// Settings
export function getSettings(): AppSettings {
  return getFromStorage<AppSettings>(STORAGE_KEYS.settings, {
    openaiApiKey: "",
    companyName: "Acme Corporation",
    riskTolerance: "medium",
    assessmentFrequency: 365,
  });
}

export function saveSettings(settings: AppSettings): void {
  setToStorage(STORAGE_KEYS.settings, settings);
}

// Reset
export function resetData(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  initializeData();
}

// Export/Import
export function exportData(): string {
  return JSON.stringify({
    vendors: getVendors(),
    assessments: getAssessments(),
    evidence: getEvidence(),
    activity: getActivity(),
    settings: getSettings(),
  }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.vendors) setToStorage(STORAGE_KEYS.vendors, data.vendors);
    if (data.assessments) setToStorage(STORAGE_KEYS.assessments, data.assessments);
    if (data.evidence) setToStorage(STORAGE_KEYS.evidence, data.evidence);
    if (data.activity) setToStorage(STORAGE_KEYS.activity, data.activity);
    if (data.settings) setToStorage(STORAGE_KEYS.settings, data.settings);
    return true;
  } catch {
    return false;
  }
}
