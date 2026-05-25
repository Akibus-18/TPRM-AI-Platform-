import { Finding, RiskScore, Vendor } from "@/types";

const RISK_TEMPLATES = {
  critical: [
    "Vendor presents critical security risks requiring immediate remediation before any data access is granted.",
    "Multiple critical control gaps identified. Engagement should be paused until remediation is verified.",
  ],
  high: [
    "Vendor demonstrates significant security deficiencies that require targeted remediation efforts.",
    "Elevated risk posture warrants enhanced monitoring and contractual protections.",
  ],
  medium: [
    "Vendor shows acceptable baseline security controls with areas for improvement.",
    "Moderate risk level supports continued engagement with periodic reassessment.",
  ],
  low: [
    "Vendor demonstrates strong security posture with minimal identified gaps.",
    "Low risk level supports full engagement with standard monitoring.",
  ],
  none: [
    "Insufficient assessment data to determine risk level. Assessment required.",
  ],
};

export function generateAISummary(
  vendor: Vendor,
  riskScore: RiskScore,
  findings: Finding[]
): string {
  const template = RISK_TEMPLATES[riskScore.level];
  const header = template[Math.floor(Math.random() * template.length)];

  const compliantCount = findings.filter((f) => f.status === "compliant").length;
  const totalCount = findings.length;
  const complianceRate = totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 0;

  const criticalFindings = findings.filter((f) => f.riskLevel === "critical" && f.status !== "compliant");
  const highFindings = findings.filter((f) => f.riskLevel === "high" && f.status !== "compliant");

  let summary = `**Risk Assessment: ${vendor.name}**\n\n`;
  summary += `${header}\n\n`;
  summary += `**Compliance Rate:** ${complianceRate}% (${compliantCount}/${totalCount} controls compliant)\n`;
  summary += `**Risk Score:** ${riskScore.overall}/100 (${riskScore.level.toUpperCase()})\n\n`;

  if (criticalFindings.length > 0) {
    summary += `**Critical Findings (${criticalFindings.length}):**\n`;
    criticalFindings.forEach((f) => {
      summary += `- ${f.controlArea}: ${f.description}\n`;
    });
    summary += "\n";
  }

  if (highFindings.length > 0) {
    summary += `**High-Risk Findings (${highFindings.length}):**\n`;
    highFindings.forEach((f) => {
      summary += `- ${f.controlArea}: ${f.description}\n`;
    });
    summary += "\n";
  }

  const weakCategories = Object.entries(riskScore.categories)
    .filter(([, score]) => score >= 50)
    .sort(([, a], [, b]) => b - a);

  if (weakCategories.length > 0) {
    summary += `**Priority Remediation Areas:**\n`;
    weakCategories.forEach(([name, score]) => {
      const displayName = name.replace(/([A-Z])/g, " $1").trim();
      summary += `- ${displayName}: ${score}/100 risk score\n`;
    });
    summary += "\n";
  }

  summary += `**Recommendation:** `;
  if (riskScore.overall >= 75) {
    summary += "Do not proceed with vendor onboarding until critical and high-risk findings are remediated. Schedule remediation review within 30 days.";
  } else if (riskScore.overall >= 50) {
    summary += "Proceed with caution. Require vendor remediation plan for high-risk findings. Schedule follow-up assessment within 90 days.";
  } else if (riskScore.overall >= 25) {
    summary += "Vendor is acceptable for engagement with standard contractual protections. Schedule annual reassessment.";
  } else {
    summary += "Vendor meets security requirements. Proceed with standard onboarding and annual review cycle.";
  }

  return summary;
}
