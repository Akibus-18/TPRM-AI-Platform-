"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Assessment, Vendor, Finding } from "@/types";
import {
  getAssessments,
  getVendors,
  saveAssessment,
  deleteAssessment,
  getVendor,
} from "@/lib/store";
import { calculateRiskScore } from "@/lib/risk-engine";
import { generateAISummary } from "@/lib/ai-summary";
import PageContainer from "@/components/layout/PageContainer";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Plus, ClipboardCheck, Search, Eye, Trash2, FileCheck, AlertCircle, Play } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const CONTROL_AREAS = [
  "Access Control",
  "Data Protection",
  "Incident Response",
  "Business Continuity",
  "Compliance",
  "Vendor Management",
];

const ASSESSMENT_TYPES: { value: Assessment["type"]; label: string }[] = [
  { value: "soc2", label: "SOC 2" },
  { value: "iso27001", label: "ISO 27001" },
  { value: "hipaa", label: "HIPAA" },
  { value: "nist", label: "NIST CSF" },
  { value: "custom", label: "Custom" },
];

const FINDING_STATUSES: { value: Finding["status"]; label: string }[] = [
  { value: "compliant", label: "Compliant" },
  { value: "partial", label: "Partial" },
  { value: "non_compliant", label: "Non-Compliant" },
  { value: "missing", label: "Missing" },
  { value: "not_applicable", label: "Not Applicable" },
];

const RISK_LEVELS: { value: Finding["riskLevel"]; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "none", label: "None" },
];

function statusBadgeVariant(
  status: Assessment["status"]
): "success" | "warning" | "default" | "critical" {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "warning";
    case "draft":
      return "default";
    case "expired":
      return "critical";
    default:
      return "default";
  }
}

function statusLabel(status: Assessment["status"]): string {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "draft":
      return "Draft";
    case "expired":
      return "Expired";
    default:
      return status;
  }
}

function typeLabel(type: Assessment["type"]): string {
  return ASSESSMENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-red-400";
  if (score >= 50) return "text-orange-400";
  if (score >= 25) return "text-amber-400";
  if (score > 0) return "text-emerald-400";
  return "text-slate-400";
}

function scoreBgColor(score: number): string {
  if (score >= 75) return "bg-red-500/10 border-red-500/30";
  if (score >= 50) return "bg-orange-500/10 border-orange-500/30";
  if (score >= 25) return "bg-amber-500/10 border-amber-500/30";
  if (score > 0) return "bg-emerald-500/10 border-emerald-500/30";
  return "bg-slate-500/10 border-slate-500/30";
}

function renderAISummary(summary: string): React.ReactNode[] {
  if (!summary) return [];
  return summary.split("\n").map((line, lineIdx) => {
    if (!line.trim()) return <br key={lineIdx} />;
    const parts = line.split("**");
    return (
      <p key={lineIdx} className="mb-1">
        {parts.map((part, partIdx) =>
          partIdx % 2 === 1 ? (
            <strong key={partIdx} className="text-white font-semibold">
              {part}
            </strong>
          ) : (
            <span key={partIdx}>{part}</span>
          )
        )}
      </p>
    );
  });
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // New Assessment Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newVendorId, setNewVendorId] = useState("");
  const [newType, setNewType] = useState<Assessment["type"]>("soc2");
  const [newDueDate, setNewDueDate] = useState("");

  // Detail Modal
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadData = useCallback(() => {
    setAssessments(getAssessments());
    setVendors(getVendors());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAssessments = assessments.filter(
    (a) =>
      a.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      typeLabel(a.type).toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create Assessment
  function handleCreateAssessment() {
    const vendor = vendors.find((v) => v.id === newVendorId);
    if (!vendor || !newDueDate) return;

    const assessment: Assessment = {
      id: uuidv4(),
      vendorId: vendor.id,
      vendorName: vendor.name,
      type: newType,
      status: "draft",
      score: 0,
      findings: [],
      aiSummary: "",
      createdAt: new Date().toISOString(),
      dueDate: newDueDate,
      assignedTo: "Current User",
    };

    saveAssessment(assessment);
    setShowNewModal(false);
    setNewVendorId("");
    setNewType("soc2");
    setNewDueDate("");
    loadData();
  }

  // Start Assessment (draft -> in_progress)
  function handleStartAssessment(assessment: Assessment) {
    const updated = { ...assessment, status: "in_progress" as const };
    saveAssessment(updated);
    if (selectedAssessment?.id === assessment.id) {
      setSelectedAssessment(updated);
    }
    loadData();
  }

  // Complete Assessment
  function handleCompleteAssessment(assessment: Assessment) {
    const vendor = getVendor(assessment.vendorId);
    const riskScore = calculateRiskScore(assessment.findings);
    const aiSummary = vendor
      ? generateAISummary(vendor, riskScore, assessment.findings)
      : assessment.aiSummary;

    const updated: Assessment = {
      ...assessment,
      status: "completed",
      completedAt: new Date().toISOString(),
      score: riskScore.overall,
      aiSummary,
    };
    saveAssessment(updated);
    setSelectedAssessment(updated);
    loadData();
  }

  // Delete Assessment
  function handleDeleteAssessment(id: string) {
    deleteAssessment(id);
    if (selectedAssessment?.id === id) {
      setSelectedAssessment(null);
      setShowDetailModal(false);
    }
    loadData();
  }

  // Calculate Score & Generate Summary (in detail view)
  function handleCalculateScore(assessment: Assessment) {
    const vendor = getVendor(assessment.vendorId);
    const riskScore = calculateRiskScore(assessment.findings);
    const aiSummary = vendor
      ? generateAISummary(vendor, riskScore, assessment.findings)
      : "";

    const updated: Assessment = {
      ...assessment,
      score: riskScore.overall,
      aiSummary,
    };
    saveAssessment(updated);
    setSelectedAssessment(updated);
    loadData();
  }

  // Add Finding
  function handleAddFinding() {
    if (!selectedAssessment) return;
    const newFinding: Finding = {
      id: uuidv4(),
      controlArea: CONTROL_AREAS[0],
      status: "missing",
      riskLevel: "medium",
      description: "",
      aiRecommendation: "",
      evidenceIds: [],
    };
    const updated: Assessment = {
      ...selectedAssessment,
      findings: [...selectedAssessment.findings, newFinding],
    };
    saveAssessment(updated);
    setSelectedAssessment(updated);
    loadData();
  }

  // Update Finding
  function handleUpdateFinding(
    findingId: string,
    field: keyof Finding,
    value: string
  ) {
    if (!selectedAssessment) return;
    const updatedFindings = selectedAssessment.findings.map((f) =>
      f.id === findingId ? { ...f, [field]: value } : f
    );
    const updated: Assessment = {
      ...selectedAssessment,
      findings: updatedFindings,
    };
    saveAssessment(updated);
    setSelectedAssessment(updated);
    loadData();
  }

  // Remove Finding
  function handleRemoveFinding(findingId: string) {
    if (!selectedAssessment) return;
    const updated: Assessment = {
      ...selectedAssessment,
      findings: selectedAssessment.findings.filter((f) => f.id !== findingId),
    };
    saveAssessment(updated);
    setSelectedAssessment(updated);
    loadData();
  }

  function openDetail(assessment: Assessment) {
    setSelectedAssessment(assessment);
    setShowDetailModal(true);
  }

  return (
    <PageContainer
      title="Assessments"
      subtitle="Manage vendor security assessments and risk evaluations"
      actions={
        <Button onClick={() => setShowNewModal(true)}>
          <Plus size={16} />
          New Assessment
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Assessment Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <ClipboardCheck
                      size={40}
                      className="mx-auto mb-3 text-slate-500"
                    />
                    <p className="text-sm">No assessments found.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Create a new assessment to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((assessment) => (
                  <tr
                    key={assessment.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">
                        {assessment.vendorName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{typeLabel(assessment.type)}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusBadgeVariant(assessment.status)}>
                        {statusLabel(assessment.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {assessment.score > 0 ? (
                        <span
                          className={`text-sm font-semibold ${scoreColor(assessment.score)}`}
                        >
                          {assessment.score}/100
                        </span>
                      ) : (
                        <span className="text-sm text-slate-500">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {new Date(assessment.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {assessment.assignedTo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetail(assessment)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </Button>
                        {assessment.status === "draft" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartAssessment(assessment)}
                            title="Start Assessment"
                          >
                            <Play size={14} />
                          </Button>
                        )}
                        {assessment.status === "in_progress" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCompleteAssessment(assessment)
                            }
                            title="Complete Assessment"
                          >
                            <FileCheck size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteAssessment(assessment.id)
                          }
                          title="Delete Assessment"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Assessment Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="New Assessment"
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Vendor
            </label>
            <select
              value={newVendorId}
              onChange={(e) => setNewVendorId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
            >
              <option value="">Select a vendor...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Assessment Type
            </label>
            <select
              value={newType}
              onChange={(e) =>
                setNewType(e.target.value as Assessment["type"])
              }
              className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
            >
              {ASSESSMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/50">
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateAssessment}
              disabled={!newVendorId || !newDueDate}
            >
              <Plus size={14} />
              Create Assessment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assessment Detail Modal */}
      <Modal
        isOpen={showDetailModal && !!selectedAssessment}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAssessment(null);
        }}
        title={`Assessment: ${selectedAssessment?.vendorName ?? ""}`}
        size="xl"
      >
        {selectedAssessment && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="info">{typeLabel(selectedAssessment.type)}</Badge>
              <Badge variant={statusBadgeVariant(selectedAssessment.status)}>
                {statusLabel(selectedAssessment.status)}
              </Badge>
              <span className="text-sm text-slate-400">
                Due:{" "}
                {new Date(selectedAssessment.dueDate).toLocaleDateString()}
              </span>
              {selectedAssessment.completedAt && (
                <span className="text-sm text-slate-400">
                  Completed:{" "}
                  {new Date(
                    selectedAssessment.completedAt
                  ).toLocaleDateString()}
                </span>
              )}
              <span className="text-sm text-slate-400">
                Assigned: {selectedAssessment.assignedTo}
              </span>
            </div>

            {/* Risk Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`border ${scoreBgColor(selectedAssessment.score)}`}>
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Risk Score
                  </p>
                  <p
                    className={`text-4xl font-bold ${scoreColor(selectedAssessment.score)}`}
                  >
                    {selectedAssessment.score > 0
                      ? selectedAssessment.score
                      : "--"}
                  </p>
                  {selectedAssessment.score > 0 && (
                    <p className="text-xs text-slate-500 mt-1">out of 100</p>
                  )}
                </div>
              </Card>
              <Card className="md:col-span-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Findings Summary
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      "compliant",
                      "partial",
                      "non_compliant",
                      "missing",
                    ] as const
                  ).map((s) => {
                    const count = selectedAssessment.findings.filter(
                      (f) => f.status === s
                    ).length;
                    const labels: Record<string, string> = {
                      compliant: "Compliant",
                      partial: "Partial",
                      non_compliant: "Non-Compliant",
                      missing: "Missing",
                    };
                    const colors: Record<string, string> = {
                      compliant: "text-emerald-400",
                      partial: "text-amber-400",
                      non_compliant: "text-orange-400",
                      missing: "text-red-400",
                    };
                    return (
                      <div key={s} className="text-center">
                        <p className={`text-xl font-bold ${colors[s]}`}>
                          {count}
                        </p>
                        <p className="text-xs text-slate-500">{labels[s]}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* AI Summary */}
            {selectedAssessment.aiSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Summary</CardTitle>
                </CardHeader>
                <div className="text-sm text-slate-300 leading-relaxed">
                  {renderAISummary(selectedAssessment.aiSummary)}
                </div>
              </Card>
            )}

            {/* Findings Table */}
            <Card padding={false}>
              <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Findings</h3>
                <Button size="sm" variant="secondary" onClick={handleAddFinding}>
                  <Plus size={14} />
                  Add Finding
                </Button>
              </div>

              {selectedAssessment.findings.length === 0 ? (
                <div className="px-6 pb-6 text-center text-slate-400 py-8">
                  <AlertCircle
                    size={32}
                    className="mx-auto mb-2 text-slate-500"
                  />
                  <p className="text-sm">
                    No findings yet. Add findings to track compliance controls.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Control Area
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Risk Level
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          AI Recommendation
                        </th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {selectedAssessment.findings.map((finding) => (
                        <tr
                          key={finding.id}
                          className="hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <select
                              value={finding.controlArea}
                              onChange={(e) =>
                                handleUpdateFinding(
                                  finding.id,
                                  "controlArea",
                                  e.target.value
                                )
                              }
                              className="bg-transparent border border-slate-700/50 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500/50"
                            >
                              {CONTROL_AREAS.map((area) => (
                                <option key={area} value={area}>
                                  {area}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="text"
                              value={finding.description}
                              onChange={(e) =>
                                handleUpdateFinding(
                                  finding.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe the finding..."
                              className="bg-transparent border border-slate-700/50 rounded px-2 py-1 text-xs text-white w-full min-w-[180px] focus:outline-none focus:border-blue-500/50 placeholder-slate-500"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <select
                              value={finding.status}
                              onChange={(e) =>
                                handleUpdateFinding(
                                  finding.id,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="bg-transparent border border-slate-700/50 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500/50"
                            >
                              {FINDING_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-3">
                            <select
                              value={finding.riskLevel}
                              onChange={(e) =>
                                handleUpdateFinding(
                                  finding.id,
                                  "riskLevel",
                                  e.target.value
                                )
                              }
                              className="bg-transparent border border-slate-700/50 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500/50"
                            >
                              {RISK_LEVELS.map((r) => (
                                <option key={r.value} value={r.value}>
                                  {r.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-xs text-slate-400 max-w-[200px] block truncate">
                              {finding.aiRecommendation || "--"}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFinding(finding.id)}
                              title="Remove Finding"
                            >
                              <Trash2 size={12} className="text-red-400" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-700/50">
              {selectedAssessment.status !== "completed" && (
                <Button
                  variant="secondary"
                  onClick={() => handleCalculateScore(selectedAssessment)}
                  disabled={selectedAssessment.findings.length === 0}
                >
                  <ClipboardCheck size={14} />
                  Calculate Score &amp; Generate Summary
                </Button>
              )}
              {selectedAssessment.status === "draft" && (
                <Button
                  variant="secondary"
                  onClick={() => handleStartAssessment(selectedAssessment)}
                >
                  <Play size={14} />
                  Start Assessment
                </Button>
              )}
              {selectedAssessment.status === "in_progress" && (
                <Button
                  onClick={() =>
                    handleCompleteAssessment(selectedAssessment)
                  }
                >
                  <FileCheck size={14} />
                  Complete Assessment
                </Button>
              )}
              {selectedAssessment.status === "completed" && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <FileCheck size={16} />
                  Assessment Completed
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
