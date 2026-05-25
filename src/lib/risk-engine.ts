import { RiskScore, Finding, RiskLevel } from "@/types";

const WEIGHTS = {
  accessControl: 0.20,
  dataProtection: 0.20,
  incidentResponse: 0.15,
  businessContinuity: 0.15,
  compliance: 0.15,
  vendorManagement: 0.15,
};

const STATUS_SCORES: Record<string, number> = {
  compliant: 0,
  not_applicable: 0,
  partial: 50,
  non_compliant: 75,
  missing: 100,
};

const DOMAIN_MAP: Record<string, keyof typeof WEIGHTS> = {
  "Access Control": "accessControl",
  "Identity Management": "accessControl",
  "Authentication": "accessControl",
  "Authorization": "accessControl",
  "Data Protection": "dataProtection",
  "Encryption": "dataProtection",
  "Data Loss Prevention": "dataProtection",
  "Data Classification": "dataProtection",
  "Incident Response": "incidentResponse",
  "Security Monitoring": "incidentResponse",
  "Business Continuity": "businessContinuity",
  "Disaster Recovery": "businessContinuity",
  "Backup Management": "businessContinuity",
  "Compliance": "compliance",
  "Audit": "compliance",
  "Regulatory": "compliance",
  "Vendor Management": "vendorManagement",
  "Third-Party Risk": "vendorManagement",
  "Supply Chain": "vendorManagement",
};

export function calculateRiskScore(findings: Finding[]): RiskScore {
  const categoryScores: Record<string, number[]> = {
    accessControl: [],
    dataProtection: [],
    incidentResponse: [],
    businessContinuity: [],
    compliance: [],
    vendorManagement: [],
  };

  findings.forEach((finding) => {
    const category = DOMAIN_MAP[finding.controlArea] || "compliance";
    const score = STATUS_SCORES[finding.status] ?? 50;
    categoryScores[category].push(score);
  });

  const categories = {
    accessControl: avg(categoryScores.accessControl),
    dataProtection: avg(categoryScores.dataProtection),
    incidentResponse: avg(categoryScores.incidentResponse),
    businessContinuity: avg(categoryScores.businessContinuity),
    compliance: avg(categoryScores.compliance),
    vendorManagement: avg(categoryScores.vendorManagement),
  };

  const overall = Math.round(
    categories.accessControl * WEIGHTS.accessControl +
    categories.dataProtection * WEIGHTS.dataProtection +
    categories.incidentResponse * WEIGHTS.incidentResponse +
    categories.businessContinuity * WEIGHTS.businessContinuity +
    categories.compliance * WEIGHTS.compliance +
    categories.vendorManagement * WEIGHTS.vendorManagement
  );

  const level = getRiskLevel(overall);
  const summary = generateRiskSummary(overall, categories, level);

  return { overall, categories, level, summary };
}

function avg(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  if (score > 0) return "low";
  return "none";
}

function generateRiskSummary(
  overall: number,
  categories: Record<string, number>,
  level: RiskLevel
): string {
  const weakAreas = Object.entries(categories)
    .filter(([, score]) => score >= 50)
    .map(([name]) => name.replace(/([A-Z])/g, " $1").trim());

  const strongAreas = Object.entries(categories)
    .filter(([, score]) => score < 25 && score > 0)
    .map(([name]) => name.replace(/([A-Z])/g, " $1").trim());

  let summary = `Overall risk assessment indicates ${level} risk level (score: ${overall}/100). `;

  if (weakAreas.length > 0) {
    summary += `Areas requiring immediate attention: ${weakAreas.join(", ")}. `;
  }
  if (strongAreas.length > 0) {
    summary += `Strong compliance posture observed in: ${strongAreas.join(", ")}. `;
  }
  if (overall >= 50) {
    summary += "Recommend prioritizing remediation efforts before vendor onboarding.";
  } else if (overall >= 25) {
    summary += "Vendor demonstrates acceptable risk posture with room for improvement.";
  } else {
    summary += "Vendor meets acceptable risk thresholds for continued engagement.";
  }

  return summary;
}

export function generateFindingRecommendations(finding: Finding): string {
  const recommendations: Record<string, Record<string, string>> = {
    "Access Control": {
      missing: "Implement multi-factor authentication (MFA) across all access points. Establish role-based access control (RBAC) with least privilege principles.",
      non_compliant: "Review and update access control policies to meet compliance requirements. Conduct access review and certification.",
      partial: "Expand existing access controls to cover all systems. Ensure consistent enforcement of authentication policies.",
    },
    "Data Protection": {
      missing: "Implement encryption at rest and in transit. Establish data classification and handling procedures.",
      non_compliant: "Update encryption standards to meet current best practices. Implement data loss prevention (DLP) controls.",
      partial: "Extend encryption coverage to all sensitive data stores. Review and test DLP policies.",
    },
    "Incident Response": {
      missing: "Develop and document incident response plan. Establish incident response team and communication protocols.",
      non_compliant: "Update incident response plan to address current threat landscape. Conduct tabletop exercises.",
      partial: "Enhance incident response procedures with automated detection and response capabilities.",
    },
    "Business Continuity": {
      missing: "Develop business continuity and disaster recovery plans. Implement regular backup testing procedures.",
      non_compliant: "Update BCP/DR plans to meet recovery time objectives. Establish backup verification schedules.",
      partial: "Conduct regular DR testing and update recovery procedures. Ensure backup integrity verification.",
    },
  };

  const areaRecs = recommendations[finding.controlArea];
  if (areaRecs && areaRecs[finding.status]) {
    return areaRecs[finding.status];
  }
  return finding.aiRecommendation || "Review and address the identified gap to improve compliance posture.";
}
