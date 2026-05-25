import { Vendor, Assessment, Evidence, ActivityLog } from "@/types";

export const sampleVendors: Vendor[] = [
  {
    id: "v1", name: "CloudSecure Inc.", category: "Cloud Provider",
    contactEmail: "security@cloudsecure.com", contactName: "Sarah Chen",
    status: "active", riskLevel: "medium", riskScore: 38, tier: "critical",
    createdAt: "2025-11-15T00:00:00Z", updatedAt: "2026-04-20T00:00:00Z",
    nextAssessmentDue: "2026-11-15T00:00:00Z", tags: ["cloud", "infrastructure", "soc2"],
    industry: "Technology", website: "cloudsecure.io", dataAccess: "Full access to customer PII",
    serviceDescription: "Cloud infrastructure hosting and managed services"
  },
  {
    id: "v2", name: "DataVault Analytics", category: "SaaS",
    contactEmail: "compliance@datavault.io", contactName: "James Wright",
    status: "active", riskLevel: "high", riskScore: 62, tier: "high",
    createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z",
    nextAssessmentDue: "2026-07-10T00:00:00Z", tags: ["analytics", "data-processing", "saas"],
    industry: "Data Analytics", website: "datavault.io", dataAccess: "Access to business analytics data",
    serviceDescription: "Business intelligence and data analytics platform"
  },
  {
    id: "v3", name: "SecureAuth Solutions", category: "Security Vendor",
    contactEmail: "info@secureauth.com", contactName: "Michael Torres",
    status: "active", riskLevel: "low", riskScore: 18, tier: "medium",
    createdAt: "2025-08-20T00:00:00Z", updatedAt: "2026-03-15T00:00:00Z",
    nextAssessmentDue: "2026-08-20T00:00:00Z", tags: ["security", "iam", "sso"],
    industry: "Cybersecurity", website: "secureauth.com", dataAccess: "Identity and authentication data",
    serviceDescription: "Identity and access management platform"
  },
  {
    id: "v4", name: "PayFlow Systems", category: "FinTech",
    contactEmail: "risk@payflow.com", contactName: "Lisa Park",
    status: "under_review", riskLevel: "critical", riskScore: 81, tier: "critical",
    createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z",
    nextAssessmentDue: "2026-06-01T00:00:00Z", tags: ["payments", "financial", "pci"],
    industry: "Financial Services", website: "payflow.com", dataAccess: "Payment card data and financial records",
    serviceDescription: "Payment processing and financial transaction services"
  },
  {
    id: "v5", name: "HealthBridge Corp", category: "Healthcare IT",
    contactEmail: "hipaa@healthbridge.com", contactName: "Dr. Amanda Lee",
    status: "active", riskLevel: "medium", riskScore: 42, tier: "critical",
    createdAt: "2025-10-05T00:00:00Z", updatedAt: "2026-04-28T00:00:00Z",
    nextAssessmentDue: "2026-10-05T00:00:00Z", tags: ["healthcare", "hipaa", "ehr"],
    industry: "Healthcare", website: "healthbridge.com", dataAccess: "ePHI and patient health records",
    serviceDescription: "Electronic health records integration platform"
  },
  {
    id: "v6", name: "GlobalServ Consulting", category: "Consulting",
    contactEmail: "contracts@globalserv.com", contactName: "Robert Kim",
    status: "active", riskLevel: "low", riskScore: 22, tier: "low",
    createdAt: "2025-06-15T00:00:00Z", updatedAt: "2026-02-10T00:00:00Z",
    nextAssessmentDue: "2026-12-15T00:00:00Z", tags: ["consulting", "professional-services"],
    industry: "Professional Services", website: "globalserv.com", dataAccess: "Limited - project documentation only",
    serviceDescription: "Management and IT consulting services"
  },
  {
    id: "v7", name: "NexGen AI Labs", category: "AI/ML Vendor",
    contactEmail: "security@nexgenai.com", contactName: "David Okafor",
    status: "onboarding", riskLevel: "high", riskScore: 55, tier: "high",
    createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z",
    nextAssessmentDue: "2026-06-15T00:00:00Z", tags: ["ai", "machine-learning", "data-science"],
    industry: "Artificial Intelligence", website: "nexgenai.com", dataAccess: "Training data and model outputs",
    serviceDescription: "AI/ML model development and deployment services"
  },
  {
    id: "v8", name: "InfraWatch Monitoring", category: "DevOps",
    contactEmail: "support@infrawatch.io", contactName: "Emily Zhang",
    status: "active", riskLevel: "medium", riskScore: 35, tier: "medium",
    createdAt: "2025-12-01T00:00:00Z", updatedAt: "2026-05-05T00:00:00Z",
    nextAssessmentDue: "2026-12-01T00:00:00Z", tags: ["monitoring", "devops", "infrastructure"],
    industry: "IT Operations", website: "infrawatch.io", dataAccess: "Infrastructure metrics and logs",
    serviceDescription: "Infrastructure monitoring and alerting platform"
  }
];

export const sampleAssessments: Assessment[] = [
  {
    id: "a1", vendorId: "v1", vendorName: "CloudSecure Inc.", type: "soc2",
    status: "completed", score: 38,
    findings: [
      { id: "f1", controlArea: "Access Control", status: "compliant", riskLevel: "low", description: "MFA enforced for all admin accounts", aiRecommendation: "Maintain current MFA enforcement", evidenceIds: [] },
      { id: "f2", controlArea: "Access Control", status: "partial", riskLevel: "medium", description: "RBAC implemented but lacks quarterly access reviews", aiRecommendation: "Implement quarterly access certification process", evidenceIds: [] },
      { id: "f3", controlArea: "Data Protection", status: "compliant", riskLevel: "low", description: "AES-256 encryption at rest, TLS 1.3 in transit", aiRecommendation: "Continue monitoring encryption standards", evidenceIds: [] },
      { id: "f4", controlArea: "Incident Response", status: "partial", riskLevel: "medium", description: "IR plan exists but lacks tabletop exercise evidence", aiRecommendation: "Conduct annual tabletop exercises and document results", evidenceIds: [] },
      { id: "f5", controlArea: "Business Continuity", status: "non_compliant", riskLevel: "high", description: "DR plan not tested in 18 months", aiRecommendation: "Schedule immediate DR test and establish annual testing cadence", evidenceIds: [] },
      { id: "f6", controlArea: "Compliance", status: "compliant", riskLevel: "low", description: "SOC 2 Type II report current", aiRecommendation: "Continue annual SOC 2 audits", evidenceIds: [] },
      { id: "f7", controlArea: "Vendor Management", status: "partial", riskLevel: "medium", description: "Sub-processor list maintained but no formal assessment process", aiRecommendation: "Implement formal sub-processor risk assessment", evidenceIds: [] },
    ],
    aiSummary: "",
    createdAt: "2026-01-15T00:00:00Z", completedAt: "2026-02-20T00:00:00Z",
    dueDate: "2026-03-01T00:00:00Z", assignedTo: "GRC Team"
  },
  {
    id: "a2", vendorId: "v2", vendorName: "DataVault Analytics", type: "iso27001",
    status: "completed", score: 62,
    findings: [
      { id: "f8", controlArea: "Access Control", status: "partial", riskLevel: "high", description: "MFA not enforced for all user accounts", aiRecommendation: "Implement organization-wide MFA enforcement", evidenceIds: [] },
      { id: "f9", controlArea: "Access Control", status: "non_compliant", riskLevel: "high", description: "No evidence of regular access reviews", aiRecommendation: "Establish quarterly access certification process", evidenceIds: [] },
      { id: "f10", controlArea: "Data Protection", status: "compliant", riskLevel: "low", description: "Data encrypted at rest and in transit", aiRecommendation: "Maintain encryption standards", evidenceIds: [] },
      { id: "f11", controlArea: "Data Protection", status: "missing", riskLevel: "critical", description: "No DLP controls implemented", aiRecommendation: "Deploy DLP solution for sensitive data monitoring", evidenceIds: [] },
      { id: "f12", controlArea: "Incident Response", status: "partial", riskLevel: "high", description: "IR plan outdated (last updated 2 years ago)", aiRecommendation: "Update IR plan and conduct tabletop exercises", evidenceIds: [] },
      { id: "f13", controlArea: "Business Continuity", status: "compliant", riskLevel: "low", description: "Regular backup testing documented", aiRecommendation: "Continue quarterly backup restoration tests", evidenceIds: [] },
      { id: "f14", controlArea: "Compliance", status: "non_compliant", riskLevel: "high", description: "Missing ISO 27001 certification", aiRecommendation: "Pursue ISO 27001 certification within 12 months", evidenceIds: [] },
      { id: "f15", controlArea: "Vendor Management", status: "missing", riskLevel: "critical", description: "No formal vendor risk management program", aiRecommendation: "Establish TPRM program with annual assessments", evidenceIds: [] },
    ],
    aiSummary: "",
    createdAt: "2026-02-01T00:00:00Z", completedAt: "2026-03-15T00:00:00Z",
    dueDate: "2026-04-01T00:00:00Z", assignedTo: "Security Team"
  },
  {
    id: "a3", vendorId: "v3", vendorName: "SecureAuth Solutions", type: "soc2",
    status: "completed", score: 18,
    findings: [
      { id: "f16", controlArea: "Access Control", status: "compliant", riskLevel: "low", description: "Enterprise MFA with hardware tokens", aiRecommendation: "Continue current practices", evidenceIds: [] },
      { id: "f17", controlArea: "Access Control", status: "compliant", riskLevel: "low", description: "Automated provisioning and deprovisioning", aiRecommendation: "Maintain automation", evidenceIds: [] },
      { id: "f18", controlArea: "Data Protection", status: "compliant", riskLevel: "low", description: "End-to-end encryption implemented", aiRecommendation: "Continue monitoring", evidenceIds: [] },
      { id: "f19", controlArea: "Incident Response", status: "compliant", riskLevel: "low", description: "24/7 SOC with automated IR", aiRecommendation: "Maintain SOC operations", evidenceIds: [] },
      { id: "f20", controlArea: "Business Continuity", status: "compliant", riskLevel: "low", description: "Multi-region DR with automated failover", aiRecommendation: "Continue regular failover testing", evidenceIds: [] },
      { id: "f21", controlArea: "Compliance", status: "compliant", riskLevel: "low", description: "SOC 2 Type II and ISO 27001 certified", aiRecommendation: "Maintain certifications", evidenceIds: [] },
      { id: "f22", controlArea: "Vendor Management", status: "partial", riskLevel: "medium", description: "Sub-processor monitoring could be enhanced", aiRecommendation: "Implement continuous sub-processor monitoring", evidenceIds: [] },
    ],
    aiSummary: "",
    createdAt: "2025-09-01T00:00:00Z", completedAt: "2025-10-15T00:00:00Z",
    dueDate: "2026-09-01T00:00:00Z", assignedTo: "GRC Team"
  },
  {
    id: "a4", vendorId: "v4", vendorName: "PayFlow Systems", type: "custom",
    status: "in_progress", score: 0,
    findings: [
      { id: "f23", controlArea: "Access Control", status: "non_compliant", riskLevel: "critical", description: "Shared admin credentials observed", aiRecommendation: "Immediately implement individual accounts with MFA", evidenceIds: [] },
      { id: "f24", controlArea: "Data Protection", status: "partial", riskLevel: "high", description: "PCI DSS controls partially implemented", aiRecommendation: "Achieve full PCI DSS compliance", evidenceIds: [] },
      { id: "f25", controlArea: "Compliance", status: "missing", riskLevel: "critical", description: "No PCI DSS AOC on file", aiRecommendation: "Provide current PCI DSS Attestation of Compliance", evidenceIds: [] },
    ],
    aiSummary: "",
    createdAt: "2026-05-01T00:00:00Z",
    dueDate: "2026-06-01T00:00:00Z", assignedTo: "Risk Team"
  }
];

export const sampleEvidence: Evidence[] = [
  { id: "e1", vendorId: "v1", vendorName: "CloudSecure Inc.", filename: "SOC2_Type2_Report_2025.pdf", type: "report", uploadedAt: "2026-01-15T00:00:00Z", notes: "Annual SOC 2 Type II report", size: "2.4 MB" },
  { id: "e2", vendorId: "v1", vendorName: "CloudSecure Inc.", filename: "Security_Policy_v3.pdf", type: "policy", uploadedAt: "2026-01-15T00:00:00Z", notes: "Information security policy", size: "856 KB" },
  { id: "e3", vendorId: "v2", vendorName: "DataVault Analytics", filename: "ISO27001_Gap_Analysis.pdf", type: "report", uploadedAt: "2026-02-10T00:00:00Z", notes: "Gap analysis for ISO 27001 certification", size: "1.8 MB" },
  { id: "e4", vendorId: "v3", vendorName: "SecureAuth Solutions", filename: "SOC2_Certificate.pdf", type: "certificate", uploadedAt: "2025-10-01T00:00:00Z", notes: "SOC 2 Type II certification", size: "320 KB" },
  { id: "e5", vendorId: "v3", vendorName: "SecureAuth Solutions", filename: "ISO27001_Certificate.pdf", type: "certificate", uploadedAt: "2025-10-01T00:00:00Z", notes: "ISO 27001:2022 certification", size: "280 KB" },
  { id: "e6", vendorId: "v4", vendorName: "PayFlow Systems", filename: "PCI_DSS_SAQ.pdf", type: "questionnaire", uploadedAt: "2026-05-05T00:00:00Z", notes: "PCI DSS Self-Assessment Questionnaire", size: "1.2 MB" },
  { id: "e7", vendorId: "v5", vendorName: "HealthBridge Corp", filename: "HIPAA_Compliance_Report.pdf", type: "report", uploadedAt: "2026-03-20T00:00:00Z", notes: "Annual HIPAA compliance assessment", size: "3.1 MB" },
  { id: "e8", vendorId: "v7", vendorName: "NexGen AI Labs", filename: "AI_Security_Policy.pdf", type: "policy", uploadedAt: "2026-04-15T00:00:00Z", notes: "AI/ML security and data handling policy", size: "680 KB" },
];

export const sampleActivity: ActivityLog[] = [
  { id: "act1", action: "Assessment completed", entity: "CloudSecure Inc.", entityType: "assessment", timestamp: "2026-05-20T14:30:00Z", user: "GRC Team" },
  { id: "act2", action: "Vendor onboarded", entity: "NexGen AI Labs", entityType: "vendor", timestamp: "2026-05-18T09:15:00Z", user: "Risk Team" },
  { id: "act3", action: "Assessment started", entity: "PayFlow Systems", entityType: "assessment", timestamp: "2026-05-15T11:00:00Z", user: "Risk Team" },
  { id: "act4", action: "Evidence uploaded", entity: "HealthBridge Corp", entityType: "evidence", timestamp: "2026-05-10T16:45:00Z", user: "Compliance Team" },
  { id: "act5", action: "Risk level changed", entity: "DataVault Analytics", entityType: "vendor", timestamp: "2026-05-08T10:20:00Z", user: "Security Team" },
  { id: "act6", action: "Report generated", entity: "SecureAuth Solutions", entityType: "report", timestamp: "2026-05-05T13:30:00Z", user: "GRC Team" },
  { id: "act7", action: "Vendor updated", entity: "CloudSecure Inc.", entityType: "vendor", timestamp: "2026-05-01T08:00:00Z", user: "GRC Team" },
  { id: "act8", action: "Assessment expired", entity: "InfraWatch Monitoring", entityType: "assessment", timestamp: "2026-04-28T00:00:00Z", user: "System" },
];
