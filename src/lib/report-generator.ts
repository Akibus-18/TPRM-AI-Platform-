import { Vendor, Assessment, RiskScore } from "@/types";

export function generateReportHTML(
  vendor: Vendor,
  assessment: Assessment,
  riskScore: RiskScore
): string {
  const compliantCount = assessment.findings.filter((f) => f.status === "compliant").length;
  const totalCount = assessment.findings.length;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; color: #1a1a2e; background: #fff; }
    .header { background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0; opacity: 0.8; font-size: 14px; }
    .section { margin-bottom: 24px; }
    .section h2 { color: #0f172a; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center; border-left: 4px solid #3b82f6; }
    .kpi-card.critical { border-left-color: #ef4444; }
    .kpi-card.high { border-left-color: #f97316; }
    .kpi-card.medium { border-left-color: #f59e0b; }
    .kpi-card.low { border-left-color: #22c55e; }
    .kpi-value { font-size: 28px; font-weight: bold; color: #0f172a; }
    .kpi-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f1f5f9; padding: 10px; text-align: left; font-weight: 600; color: #334155; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .badge-critical { background: #fef2f2; color: #dc2626; }
    .badge-high { background: #fff7ed; color: #ea580c; }
    .badge-medium { background: #fffbeb; color: #d97706; }
    .badge-low { background: #f0fdf4; color: #16a34a; }
    .badge-compliant { background: #f0fdf4; color: #16a34a; }
    .badge-partial { background: #fffbeb; color: #d97706; }
    .badge-non_compliant { background: #fef2f2; color: #dc2626; }
    .badge-missing { background: #fef2f2; color: #dc2626; }
    .summary-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Third-Party Risk Assessment Report</h1>
    <p>${vendor.name} | ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card ${riskScore.level}">
      <div class="kpi-value">${riskScore.overall}</div>
      <div class="kpi-label">Risk Score</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">${totalCount}</div>
      <div class="kpi-label">Controls Assessed</div>
    </div>
    <div class="kpi-card low">
      <div class="kpi-value">${compliantCount}</div>
      <div class="kpi-label">Compliant</div>
    </div>
    <div class="kpi-card critical">
      <div class="kpi-value">${totalCount - compliantCount}</div>
      <div class="kpi-label">Gaps Identified</div>
    </div>
  </div>

  <div class="section">
    <h2>Vendor Information</h2>
    <table>
      <tr><td><strong>Vendor Name</strong></td><td>${vendor.name}</td><td><strong>Category</strong></td><td>${vendor.category}</td></tr>
      <tr><td><strong>Contact</strong></td><td>${vendor.contactName}</td><td><strong>Email</strong></td><td>${vendor.contactEmail}</td></tr>
      <tr><td><strong>Industry</strong></td><td>${vendor.industry}</td><td><strong>Tier</strong></td><td>${vendor.tier.toUpperCase()}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>AI Risk Summary</h2>
    <div class="summary-box">${assessment.aiSummary}</div>
  </div>

  <div class="section">
    <h2>Risk Categories</h2>
    <table>
      <tr><th>Category</th><th>Score</th><th>Level</th></tr>
      ${Object.entries(riskScore.categories).map(([name, score]) => {
        const displayName = name.replace(/([A-Z])/g, " $1").trim();
        const level = score >= 75 ? "Critical" : score >= 50 ? "High" : score >= 25 ? "Medium" : "Low";
        return `<tr><td>${displayName}</td><td>${score}/100</td><td><span class="badge badge-${level.toLowerCase()}">${level}</span></td></tr>`;
      }).join("")}
    </table>
  </div>

  <div class="section">
    <h2>Findings Detail</h2>
    <table>
      <tr><th>Control Area</th><th>Description</th><th>Status</th><th>Risk</th><th>Recommendation</th></tr>
      ${assessment.findings.map((f) => `
        <tr>
          <td>${f.controlArea}</td>
          <td>${f.description}</td>
          <td><span class="badge badge-${f.status}">${f.status.replace(/_/g, " ")}</span></td>
          <td><span class="badge badge-${f.riskLevel}">${f.riskLevel}</span></td>
          <td>${f.aiRecommendation}</td>
        </tr>
      `).join("")}
    </table>
  </div>

  <div class="footer">
    <p>Generated by TPRM AI Platform | ${new Date().toISOString()} | Confidential</p>
  </div>
</body>
</html>`;
}

export async function downloadPDF(
  vendor: Vendor,
  assessment: Assessment,
  riskScore: RiskScore
): Promise<void> {
  const html = generateReportHTML(vendor, assessment, riskScore);

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
