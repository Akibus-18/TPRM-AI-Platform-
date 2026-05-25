export type RiskLevel = "critical" | "high" | "medium" | "low" | "none";
export type VendorStatus = "active" | "inactive" | "under_review" | "onboarding";
export type VendorTier = "critical" | "high" | "medium" | "low";
export type AssessmentType = "soc2" | "iso27001" | "hipaa" | "nist" | "custom";
export type AssessmentStatus = "draft" | "in_progress" | "completed" | "expired";
export type FindingStatus = "compliant" | "partial" | "non_compliant" | "missing" | "not_applicable";
export type EvidenceType = "policy" | "certificate" | "report" | "questionnaire" | "other";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactEmail: string;
  contactName: string;
  status: VendorStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  tier: VendorTier;
  createdAt: string;
  updatedAt: string;
  nextAssessmentDue: string;
  tags: string[];
  industry: string;
  website: string;
  dataAccess: string;
  serviceDescription: string;
}

export interface Assessment {
  id: string;
  vendorId: string;
  vendorName: string;
  type: AssessmentType;
  status: AssessmentStatus;
  score: number;
  findings: Finding[];
  aiSummary: string;
  createdAt: string;
  completedAt?: string;
  dueDate: string;
  assignedTo: string;
}

export interface Finding {
  id: string;
  controlArea: string;
  status: FindingStatus;
  riskLevel: RiskLevel;
  description: string;
  aiRecommendation: string;
  evidenceIds: string[];
}

export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  controls: Control[];
}

export interface Control {
  id: string;
  domain: string;
  controlId: string;
  description: string;
  requirement: string;
}

export interface Evidence {
  id: string;
  vendorId: string;
  vendorName: string;
  filename: string;
  type: EvidenceType;
  uploadedAt: string;
  notes: string;
  size: string;
}

export interface RiskScore {
  overall: number;
  categories: {
    accessControl: number;
    dataProtection: number;
    incidentResponse: number;
    businessContinuity: number;
    compliance: number;
    vendorManagement: number;
  };
  level: RiskLevel;
  summary: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityType: "vendor" | "assessment" | "evidence" | "report";
  timestamp: string;
  user: string;
}

export interface AppSettings {
  openaiApiKey: string;
  companyName: string;
  riskTolerance: "low" | "medium" | "high";
  assessmentFrequency: number; // days
}
