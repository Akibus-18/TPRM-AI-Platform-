import { ComplianceFramework, Control } from "@/types";

export const FRAMEWORKS: ComplianceFramework[] = [
  {
    id: "nist-csf",
    name: "NIST Cybersecurity Framework",
    shortName: "NIST CSF",
    controls: [
      { id: "n1", domain: "Access Control", controlId: "PR.AC-1", description: "Identities and credentials are issued, managed, verified, revoked, and audited", requirement: "Identity management system with provisioning/deprovisioning" },
      { id: "n2", domain: "Access Control", controlId: "PR.AC-3", description: "Remote access is managed", requirement: "VPN, MFA for remote access" },
      { id: "n3", domain: "Access Control", controlId: "PR.AC-4", description: "Access permissions and authorizations are managed", requirement: "RBAC with least privilege" },
      { id: "n4", domain: "Access Control", controlId: "PR.AC-5", description: "Network integrity is protected", requirement: "Network segmentation and monitoring" },
      { id: "n5", domain: "Access Control", controlId: "PR.AC-7", description: "Users, devices, and other assets are authenticated", requirement: "MFA implementation" },
      { id: "n6", domain: "Data Protection", controlId: "PR.DS-1", description: "Data-at-rest is protected", requirement: "Encryption for stored data" },
      { id: "n7", domain: "Data Protection", controlId: "PR.DS-2", description: "Data-in-transit is protected", requirement: "TLS 1.2+ for all communications" },
      { id: "n8", domain: "Data Protection", controlId: "PR.DS-5", description: "Protections against data leaks are implemented", requirement: "DLP controls and monitoring" },
      { id: "n9", domain: "Data Protection", controlId: "PR.DS-6", description: "Integrity checking mechanisms are used", requirement: "Hash verification and monitoring" },
      { id: "n10", domain: "Incident Response", controlId: "RS.RP-1", description: "Response plan is executed during or after an incident", requirement: "Documented IR plan with defined roles" },
      { id: "n11", domain: "Incident Response", controlId: "RS.CO-2", description: "Incidents are reported consistent with established criteria", requirement: "Incident reporting procedures and thresholds" },
      { id: "n12", domain: "Incident Response", controlId: "RS.AN-1", description: "Notifications from detection systems are investigated", requirement: "SIEM monitoring and alert triage" },
      { id: "n13", domain: "Business Continuity", controlId: "PR.IP-4", description: "Backups of information are conducted, maintained, and tested", requirement: "Regular backup with testing" },
      { id: "n14", domain: "Business Continuity", controlId: "PR.IP-9", description: "Plans are in place for response and recovery", requirement: "BCP/DR documentation" },
      { id: "n15", domain: "Business Continuity", controlId: "RC.RP-1", description: "Recovery plan is executed during or after a cybersecurity incident", requirement: "DR testing and execution procedures" },
      { id: "n16", domain: "Compliance", controlId: "ID.GV-1", description: "Organizational cybersecurity policy is established", requirement: "Written security policies" },
      { id: "n17", domain: "Compliance", controlId: "ID.GV-3", description: "Legal and regulatory requirements are understood and managed", requirement: "Regulatory compliance program" },
      { id: "n18", domain: "Compliance", controlId: "DE.CM-1", description: "The network is monitored to detect potential cybersecurity events", requirement: "Network monitoring and IDS/IPS" },
      { id: "n19", domain: "Vendor Management", controlId: "ID.SC-1", description: "Cyber supply chain risk management processes are identified", requirement: "Third-party risk management program" },
      { id: "n20", domain: "Vendor Management", controlId: "ID.SC-4", description: "Suppliers and third-party partners are routinely assessed", requirement: "Vendor assessment schedule" },
    ],
  },
  {
    id: "iso27001",
    name: "ISO 27001:2022",
    shortName: "ISO 27001",
    controls: [
      { id: "i1", domain: "Access Control", controlId: "A.5.15", description: "Access control", requirement: "Access control policy and procedures" },
      { id: "i2", domain: "Access Control", controlId: "A.5.16", description: "Identity management", requirement: "Unique identification of users" },
      { id: "i3", domain: "Access Control", controlId: "A.5.17", description: "Authentication information", requirement: "Password policy and MFA" },
      { id: "i4", domain: "Access Control", controlId: "A.5.18", description: "Access rights", requirement: "Provisioning and review of access rights" },
      { id: "i5", domain: "Access Control", controlId: "A.8.5", description: "Secure authentication", requirement: "Multi-factor authentication systems" },
      { id: "i6", domain: "Data Protection", controlId: "A.8.24", description: "Use of cryptography", requirement: "Encryption policy and key management" },
      { id: "i7", domain: "Data Protection", controlId: "A.8.11", description: "Data masking", requirement: "Data masking and anonymization" },
      { id: "i8", domain: "Data Protection", controlId: "A.8.12", description: "Data leakage prevention", requirement: "DLP controls" },
      { id: "i9", domain: "Data Protection", controlId: "A.8.10", description: "Information deletion", requirement: "Data retention and disposal procedures" },
      { id: "i10", domain: "Incident Response", controlId: "A.5.24", description: "Information security incident management planning", requirement: "IR plan and procedures" },
      { id: "i11", domain: "Incident Response", controlId: "A.5.25", description: "Assessment and decision on information security events", requirement: "Event classification and triage" },
      { id: "i12", domain: "Incident Response", controlId: "A.5.26", description: "Response to information security incidents", requirement: "Incident response and escalation" },
      { id: "i13", domain: "Business Continuity", controlId: "A.5.30", description: "ICT readiness for business continuity", requirement: "BCP and DR testing" },
      { id: "i14", domain: "Business Continuity", controlId: "A.8.13", description: "Information backup", requirement: "Backup procedures and testing" },
      { id: "i15", domain: "Business Continuity", controlId: "A.8.14", description: "Redundancy of information processing facilities", requirement: "Redundancy and failover" },
      { id: "i16", domain: "Compliance", controlId: "A.5.31", description: "Legal, statutory, regulatory and contractual requirements", requirement: "Compliance program" },
      { id: "i17", domain: "Compliance", controlId: "A.5.36", description: "Compliance with policies, rules and standards", requirement: "Policy compliance monitoring" },
      { id: "i18", domain: "Compliance", controlId: "A.5.33", description: "Protection of records", requirement: "Records management" },
      { id: "i19", domain: "Vendor Management", controlId: "A.5.19", description: "Information security in supplier relationships", requirement: "Supplier security requirements" },
      { id: "i20", domain: "Vendor Management", controlId: "A.5.20", description: "Addressing information security within supplier agreements", requirement: "Contractual security clauses" },
      { id: "i21", domain: "Vendor Management", controlId: "A.5.21", description: "Managing information security in the ICT supply chain", requirement: "Supply chain risk management" },
      { id: "i22", domain: "Vendor Management", controlId: "A.5.22", description: "Monitoring, review and change management of supplier services", requirement: "Vendor performance monitoring" },
    ],
  },
  {
    id: "soc2",
    name: "SOC 2 Type II",
    shortName: "SOC 2",
    controls: [
      { id: "s1", domain: "Access Control", controlId: "CC6.1", description: "Logical access security software, infrastructure, and architectures", requirement: "Logical access controls" },
      { id: "s2", domain: "Access Control", controlId: "CC6.2", description: "User registration and authorization", requirement: "User provisioning process" },
      { id: "s3", domain: "Access Control", controlId: "CC6.3", description: "User credentials and access rights removal", requirement: "Deprovisioning procedures" },
      { id: "s4", domain: "Access Control", controlId: "CC6.6", description: "Restricts access to system configurations", requirement: "Configuration access controls" },
      { id: "s5", domain: "Access Control", controlId: "CC6.7", description: "Restricts transmission, movement, and removal of information", requirement: "Data transfer controls" },
      { id: "s6", domain: "Data Protection", controlId: "CC6.5", description: "Disposal of data and equipment", requirement: "Data disposal procedures" },
      { id: "s7", domain: "Data Protection", controlId: "CC6.8", description: "Prevents and detects unauthorized software", requirement: "Application whitelisting" },
      { id: "s8", domain: "Data Protection", controlId: "CC7.2", description: "Monitors system components for anomalies", requirement: "Security monitoring" },
      { id: "s9", domain: "Incident Response", controlId: "CC7.3", description: "Evaluates security events", requirement: "Event evaluation process" },
      { id: "s10", domain: "Incident Response", controlId: "CC7.4", description: "Responds to identified security incidents", requirement: "Incident response procedures" },
      { id: "s11", domain: "Incident Response", controlId: "CC7.5", description: "Identifies and addresses security incidents", requirement: "Incident identification and remediation" },
      { id: "s12", domain: "Business Continuity", controlId: "CC9.1", description: "Authorizes, designs, develops, acquires, implements", requirement: "Change management" },
      { id: "s13", domain: "Business Continuity", controlId: "A1.2", description: "Authorizes, designs, develops, acquires, implements", requirement: "Infrastructure change management" },
      { id: "s14", domain: "Business Continuity", controlId: "A1.3", description: "Uses detection and monitoring procedures", requirement: "Environmental protections" },
      { id: "s15", domain: "Compliance", controlId: "CC1.1", description: "Demonstrates commitment to integrity and ethical values", requirement: "Code of conduct" },
      { id: "s16", domain: "Compliance", controlId: "CC2.1", description: "Considers the potential for fraud", requirement: "Fraud risk assessment" },
      { id: "s17", domain: "Compliance", controlId: "CC3.1", description: "Specifies objectives with sufficient clarity", requirement: "Security objectives" },
      { id: "s18", domain: "Vendor Management", controlId: "CC9.2", description: "Authorizes, designs, develops, acquires, implements", requirement: "Vendor risk assessment" },
    ],
  },
  {
    id: "hipaa",
    name: "HIPAA Security Rule",
    shortName: "HIPAA",
    controls: [
      { id: "h1", domain: "Access Control", controlId: "§164.312(a)(1)", description: "Access control - Technical safeguards", requirement: "Unique user identification and emergency access" },
      { id: "h2", domain: "Access Control", controlId: "§164.312(d)", description: "Person or entity authentication", requirement: "Verify identity of persons seeking access" },
      { id: "h3", domain: "Access Control", controlId: "§164.312(a)(2)(iii)", description: "Automatic logoff", requirement: "Session timeout controls" },
      { id: "h4", domain: "Access Control", controlId: "§164.312(a)(2)(iv)", description: "Encryption and decryption", requirement: "Encryption of ePHI" },
      { id: "h5", domain: "Data Protection", controlId: "§164.312(a)(2)(iv)", description: "Encryption and decryption", requirement: "AES-256 encryption for ePHI at rest" },
      { id: "h6", domain: "Data Protection", controlId: "§164.312(e)(1)", description: "Transmission security", requirement: "TLS 1.2+ for ePHI in transit" },
      { id: "h7", domain: "Data Protection", controlId: "§164.312(c)(1)", description: "Integrity controls", requirement: "Mechanisms to authenticate ePHI" },
      { id: "h8", domain: "Data Protection", controlId: "§164.310(d)(1)", description: "Device and media controls", requirement: "Hardware and electronic media tracking" },
      { id: "h9", domain: "Incident Response", controlId: "§164.308(a)(6)", description: "Security incident procedures", requirement: "IR plan for security incidents" },
      { id: "h10", domain: "Incident Response", controlId: "§164.308(a)(5)", description: "Security awareness and training", requirement: "Security training program" },
      { id: "h11", domain: "Business Continuity", controlId: "§164.308(a)(7)", description: "Contingency plan", requirement: "Data backup and disaster recovery" },
      { id: "h12", domain: "Business Continuity", controlId: "§164.310(a)(1)", description: "Facility access controls", requirement: "Physical security controls" },
      { id: "h13", domain: "Compliance", controlId: "§164.308(a)(1)", description: "Security management process", requirement: "Risk analysis and management" },
      { id: "h14", domain: "Compliance", controlId: "§164.308(a)(8)", description: "Evaluation", requirement: "Periodic security evaluations" },
      { id: "h15", domain: "Compliance", controlId: "§164.312(b)", description: "Audit controls", requirement: "Audit logging and monitoring" },
      { id: "h16", domain: "Vendor Management", controlId: "§164.308(b)(1)", description: "Business associate contracts", requirement: "BAA with all vendors handling ePHI" },
      { id: "h17", domain: "Vendor Management", controlId: "§164.314(a)", description: "Business associate requirements", requirement: "Vendor compliance verification" },
    ],
  },
];

export function getFramework(id: string): ComplianceFramework | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}

export function getControlsByDomain(frameworkId: string): Record<string, Control[]> {
  const framework = getFramework(frameworkId);
  if (!framework) return {};

  const grouped: Record<string, Control[]> = {};
  framework.controls.forEach((control) => {
    if (!grouped[control.domain]) grouped[control.domain] = [];
    grouped[control.domain].push(control);
  });
  return grouped;
}
