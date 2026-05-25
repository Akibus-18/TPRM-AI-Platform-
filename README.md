# TPRM AI Platform: AI-Powered Third-Party Risk Management

## GRC-Style Vendor Risk Assessment, Compliance Mapping & Executive Reporting

## Executive Summary

**TPRM AI Platform** is a portfolio-grade Governance, Risk & Compliance (GRC) application demonstrating the practical implementation of **Third-Party Risk Management (TPRM)** workflows aligned with enterprise security standards. The platform provides a comprehensive, browser-based solution for onboarding vendors, conducting risk assessments, mapping compliance controls, and generating executive reports.

This project simulates a real-world enterprise GRC environment where organizations must continuously evaluate the security posture of their third-party vendors against industry frameworks, identify risk gaps, and maintain auditable compliance records.

| Attribute | Detail |
| :--- | :--- |
| **Focus Area** | Third-Party Risk Management (TPRM), Governance, Risk & Compliance (GRC) |
| **Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Key Technologies** | Tailwind CSS, Recharts, Lucide React, jsPDF, localStorage |
| **Core Principle** | AI-Driven Risk Scoring with Compliance Framework Mapping |
| **Deployment** | Static Export — Vercel / Netlify Ready (No Server Required) |

---

## Business Context (Why TPRM is Critical)

In today's interconnected business ecosystem, **third-party vendors are the weakest link in the security chain**. A single compromised vendor can lead to catastrophic data breaches, regulatory penalties, and reputational damage. This platform addresses the critical need to:

*   **Centralize Vendor Risk Visibility**: Maintain a single source of truth for all third-party vendor relationships, risk scores, and compliance statuses.
*   **Automate Risk Assessment**: Replace manual spreadsheet-based assessments with an AI-powered scoring engine that evaluates vendors across six security domains.
*   **Ensure Regulatory Compliance**: Map vendor controls against four major compliance frameworks (NIST CSF, ISO 27001, SOC 2, HIPAA) to demonstrate due diligence to auditors.
*   **Enable Executive Decision-Making**: Generate professional risk assessment reports that empower leadership to make informed vendor engagement decisions.

---

## Platform Architecture

### System Overview

```
+----------------------------------------------------------+
|                    TPRM AI Platform                       |
|                                                          |
|  +------------+  +---------------+  +-----------------+  |
|  |  Dashboard  |  |  Vendor Mgmt  |  |  Assessments   |  |
|  |  KPI Cards  |  |  CRUD Table   |  |  Questionnaire |  |
|  |  Charts     |  |  Risk Badges  |  |  AI Summary    |  |
|  +------------+  +---------------+  +-----------------+  |
|                                                          |
|  +------------+  +---------------+  +-----------------+  |
|  | Compliance  |  |   Reports     |  |   Evidence     |  |
|  | Frameworks  |  |   PDF Export  |  |   Repository   |  |
|  | Heatmap     |  |   Executive   |  |   Upload/Tag   |  |
|  +------------+  +---------------+  +-----------------+  |
|                                                          |
|  +----------------------------------------------------+  |
|  |           AI Risk Scoring Engine                    |  |
|  |  6 Domains | Weighted Scoring | Rule-Based Logic   |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +----------------------------------------------------+  |
|  |           Data Layer (localStorage)                 |  |
|  |  Vendors | Assessments | Evidence | Settings        |  |
|  +----------------------------------------------------+  |
+----------------------------------------------------------+
```

### Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | React framework with static export |
| **Styling** | Tailwind CSS | Utility-first dark corporate theme |
| **Charts** | Recharts | Risk distribution & trend visualizations |
| **Icons** | Lucide React | Professional icon system |
| **PDF Reports** | jsPDF + html2canvas | Client-side PDF generation |
| **State** | React Context + localStorage | Client-side persistence (no server) |
| **Language** | TypeScript | Type-safe development |

---

## Implementation #1: AI-Powered Risk Scoring Engine

### The Challenge

Manual vendor risk assessments are time-consuming, inconsistent, and prone to human bias. Different assessors may evaluate the same control differently, leading to unreliable risk scores that fail to accurately represent a vendor's security posture.

### Why This Is Dangerous

Inconsistent risk scoring can lead to:
*   **False Confidence**: A vendor rated "Low Risk" by one assessor may actually have critical security gaps.
*   **Delayed Remediation**: Without automated scoring, high-risk vendors may continue operating without corrective action.
*   **Compliance Failures**: Auditors require consistent, evidence-based risk assessments — manual approaches often fall short.

### The Solution: 6-Domain Weighted Risk Scoring Algorithm

The built-in rule-based risk engine evaluates vendor findings across **six control domains**, each with a defined weight reflecting its security importance:

| Domain | Weight | Controls Evaluated |
| :--- | :--- | :--- |
| **Access Control** | 20% | MFA, RBAC, Password Policies, Authentication |
| **Data Protection** | 20% | Encryption, DLP, Data Classification |
| **Incident Response** | 15% | IR Plan, Testing, Communication Protocols |
| **Business Continuity** | 15% | BCP, DR Testing, Backup Management |
| **Compliance** | 15% | Framework Adherence, Audit History |
| **Vendor Management** | 15% | Sub-vendor Oversight, Contractual Protections |

**Scoring Logic:**

Each finding is scored based on its compliance status:

| Status | Score | Meaning |
| :--- | :--- | :--- |
| `compliant` | 0 | Control fully meets requirements |
| `partial` | 50 | Control partially implemented |
| `non_compliant` | 75 | Control fails to meet requirements |
| `missing` | 100 | Control not implemented |

**Risk Level Classification:**

| Score Range | Risk Level | Color |
| :--- | :--- | :--- |
| 75 - 100 | Critical | Red |
| 50 - 74 | High | Orange |
| 25 - 49 | Medium | Amber |
| 1 - 24 | Low | Green |
| 0 | None | Gray |

The overall risk score is the weighted sum of all domain scores, producing a consistent, auditable 0-100 risk rating for every vendor.

---

## Implementation #2: Compliance Framework Mapping

### The Requirement

Organizations must demonstrate compliance with multiple regulatory frameworks simultaneously. A single vendor may need to satisfy controls from NIST CSF, ISO 27001, SOC 2, and HIPAA depending on the data they access and the industry they serve.

### Why Multi-Framework Mapping Was Prioritized

Managing compliance across frameworks using spreadsheets leads to:
*   **Control Duplication**: The same security control may be documented differently across frameworks.
*   **Mapping Gaps**: Without a unified view, teams may miss overlapping requirements.
*   **Audit Fatigue**: Auditors require clear evidence of control coverage across all applicable frameworks.

### The Solution: Unified Compliance Mapper

The platform includes pre-built control libraries for four major frameworks:

| Framework | Controls | Domains |
| :--- | :--- | :--- |
| **NIST Cybersecurity Framework** | 20 controls | Access Control, Data Protection, Incident Response, Business Continuity, Compliance, Vendor Management |
| **ISO 27001:2022** | 22 controls | Access Control, Data Protection, Incident Response, Business Continuity, Compliance, Vendor Management |
| **SOC 2 Type II** | 18 controls | Access Control, Data Protection, Incident Response, Business Continuity, Compliance, Vendor Management |
| **HIPAA Security Rule** | 17 controls | Access Control, Data Protection, Incident Response, Business Continuity, Compliance, Vendor Management |

Each control includes:
*   **Control ID** (e.g., `PR.AC-1`, `A.5.15`, `CC6.1`, `164.312(a)(1)`)
*   **Description** of the security requirement
*   **Specific Requirement** for implementation

The **Compliance Heatmap** visualizes vendor compliance percentages across all domains for the selected framework, enabling instant identification of risk concentrations.

---

## Implementation #3: AI-Generated Risk Summaries

### The Requirement

Risk analysts spend hours writing assessment summaries for each vendor. These summaries must be consistent, actionable, and tailored to the specific findings of each assessment.

### The Solution: Context-Aware AI Summary Generator

The platform generates structured risk summaries based on the assessment results:

**Summary Structure:**
1.  **Risk Level Assessment** — Context-appropriate statement based on overall score
2.  **Compliance Rate** — Percentage of controls that are fully compliant
3.  **Critical Findings** — Highlighted gaps requiring immediate attention
4.  **High-Risk Findings** — Secondary priority remediation items
5.  **Priority Remediation Areas** — Weakest control domains ranked by score
6.  **Recommendation** — Actionable next steps based on risk level

**Recommendation Logic:**

| Risk Score | Recommendation |
| :--- | :--- |
| >= 75 (Critical) | Do not proceed with vendor onboarding until critical findings are remediated. Schedule review within 30 days. |
| >= 50 (High) | Proceed with caution. Require vendor remediation plan. Schedule follow-up within 90 days. |
| >= 25 (Medium) | Vendor is acceptable with standard contractual protections. Schedule annual reassessment. |
| < 25 (Low) | Vendor meets security requirements. Proceed with standard onboarding and annual review cycle. |

---

## Platform Pages & Features

### 1. Dashboard
*   **KPI Cards**: Total Vendors, Average Risk Score, Pending Assessments, Overdue Reviews
*   **Risk Distribution Pie Chart**: Vendor count by risk level (Critical, High, Medium, Low)
*   **Assessment Trend Chart**: Monthly assessment score trends over 6 months
*   **Recent Activity Feed**: Real-time log of vendor onboarding, assessments, and evidence uploads

### 2. Vendor Management
*   Searchable and filterable vendor table with sortable columns
*   Add/Edit vendor modal with full profile fields (category, industry, tier, data access, tags)
*   Risk score progress bars and color-coded risk level badges
*   Vendor detail view with complete risk profile

### 3. Risk Assessments
*   Create assessments against any vendor for SOC 2, ISO 27001, HIPAA, NIST CSF, or Custom frameworks
*   Inline-editable findings table with control area, status, risk level, and AI recommendations
*   "Calculate Score & Generate Summary" button for instant risk analysis
*   Assessment completion workflow with date stamping

### 4. Compliance Mapping
*   Framework selector (NIST CSF, ISO 27001, SOC 2, HIPAA)
*   Compliance heatmap showing vendor domain scores across all controls
*   Expandable control grids with control ID, description, and requirement details

### 5. Executive Reports
*   Report generator with vendor and assessment selection
*   Full report preview with KPIs, AI summary, risk categories, and findings detail
*   Print/Save PDF functionality for stakeholder distribution

### 6. Evidence Repository
*   Upload and organize compliance documents (policies, certificates, reports, questionnaires)
*   Search and filter by type and vendor
*   Type-specific badges and metadata display

### 7. Settings
*   Company name, risk tolerance, assessment frequency configuration
*   Optional OpenAI API key for enhanced AI analysis
*   Data export (JSON backup), import, and reset to sample data

---

## Pre-Loaded Sample Data

The platform ships with **8 realistic vendor profiles** across diverse industries:

| Vendor | Category | Risk Level | Score | Tier |
| :--- | :--- | :--- | :--- | :--- |
| CloudSecure Inc. | Cloud Provider | Medium | 38 | Critical |
| DataVault Analytics | SaaS | High | 62 | High |
| SecureAuth Solutions | Security Vendor | Low | 18 | Medium |
| PayFlow Systems | FinTech | Critical | 81 | Critical |
| HealthBridge Corp | Healthcare IT | Medium | 42 | Critical |
| GlobalServ Consulting | Consulting | Low | 22 | Low |
| NexGen AI Labs | AI/ML Vendor | High | 55 | High |
| InfraWatch Monitoring | DevOps | Medium | 35 | Medium |

---

## Getting Started

### Prerequisites
*   Node.js 18+ installed
*   npm or yarn package manager

### Local Development

```bash
# Clone the repository
git clone https://github.com/Akibus-18/TPRM-AI-Platform-.git
cd TPRM-AI-Platform-

# Install dependencies
npm install

# Start development server
npm run dev
```


### Production Build

```bash
# Build static export
npm run build

# Output is in the 'out/' directory
# Deploy to Vercel, Netlify, or any static hosting
```

---

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Click **Deploy** — Vercel auto-detects Next.js

### Netlify
1. Run `npm run build`
2. Drag the `out/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

---

## Regulatory & Compliance Alignment

The platform's assessment methodology aligns with core GRC frameworks:

*   **NIST SP 800-53 (RA-3)**: Risk Assessment — Systematic evaluation of vendor risk through structured assessments.
*   **ISO 27001:2022 (A.5.19-5.22)**: Supplier Relationship Security — Direct mapping of vendor controls.
*   **SOC 2 (CC9.2)**: Vendor Risk Assessment — Structured evaluation of third-party service providers.
*   **HIPAA (164.308(b)(1))**: Business Associate Requirements — Vendor compliance verification and BAA management.
*   **GDPR (Article 28)**: Processor Assessment — Due diligence on data processors.

---

## Key Takeaways

*   **Vendor Risk is Business Risk**: Third-party breaches account for over 60% of data breaches. Continuous vendor risk monitoring is not optional.
*   **Standardized Assessment Methodology**: Consistent, rule-based scoring eliminates human bias and ensures auditable results.
*   **Multi-Framework Compliance**: A single vendor assessment can demonstrate compliance across NIST, ISO, SOC 2, and HIPAA simultaneously.
*   **Executive-Ready Reporting**: Professional PDF reports with risk scores, AI summaries, and findings tables enable informed decision-making at the leadership level.
*   **No Server Required**: Client-side architecture with localStorage persistence enables zero-infrastructure deployment.

---

## Project Structure

```
tprm-ai-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard
│   │   ├── vendors/page.tsx      # Vendor Management
│   │   ├── assessments/page.tsx  # Risk Assessments
│   │   ├── compliance/page.tsx   # Compliance Mapping
│   │   ├── reports/page.tsx      # Executive Reports
│   │   ├── evidence/page.tsx     # Evidence Repository
│   │   ├── settings/page.tsx     # Platform Settings
│   │   ├── layout.tsx            # Root Layout (Sidebar + TopBar)
│   │   └── globals.css           # Global Styles
│   ├── components/
│   │   ├── layout/               # Sidebar, TopBar, PageContainer
│   │   └── ui/                   # Button, Badge, Card, Modal, ProgressBar
│   ├── lib/
│   │   ├── risk-engine.ts        # 6-Domain Weighted Risk Scoring
│   │   ├── ai-summary.ts         # AI Summary Generation
│   │   ├── compliance-mapper.ts  # NIST/ISO/SOC2/HIPAA Frameworks
│   │   ├── report-generator.ts   # PDF Report Generation
│   │   ├── store.ts              # localStorage Data Layer
│   │   └── sample-data.ts        # Demo Vendor/Assessment Data
│   └── types/
│       └── index.ts              # TypeScript Interfaces
├── next.config.mjs               # Static Export Configuration
├── tailwind.config.ts            # Dark Theme Configuration
└── package.json
```

---

## Final Outcome

This project successfully demonstrates the design, implementation, and deployment of a production-ready, enterprise-grade Third-Party Risk Management platform. It showcases the ability to build complex GRC workflows — from vendor onboarding to executive reporting — using modern web technologies while maintaining alignment with industry-standard compliance frameworks.

The platform is live and accessible via static hosting (Vercel/Netlify) with zero server infrastructure, making it an ideal demonstration of how GRC tools can be built for scalability, accessibility, and cost-efficiency.

---

*Built with Next.js 14, Tailwind CSS, and TypeScript | Deployed on Vercel*
#Sofiu Akibu Olawale
