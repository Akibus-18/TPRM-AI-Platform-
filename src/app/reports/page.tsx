"use client";
import React, { useState, useEffect } from "react";
import { Vendor, Assessment } from "@/types";
import { getVendors, getAssessments } from "@/lib/store";
import { calculateRiskScore } from "@/lib/risk-engine";
import { downloadPDF } from "@/lib/report-generator";
import PageContainer from "@/components/layout/PageContainer";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { FileText, Download, Eye, Building2, Calendar, BarChart3, Shield } from "lucide-react";

export default function ReportsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setVendors(getVendors());
    setAssessments(getAssessments());
    setLoading(false);
  }, []);

  const completedAssessments = assessments.filter((a) => a.status === "completed");
  const vendorAssessments = selectedVendor
    ? completedAssessments.filter((a) => a.vendorId === selectedVendor)
    : completedAssessments;

  const currentAssessment = assessments.find((a) => a.id === selectedAssessment);
  const currentVendor = currentAssessment ? vendors.find((v) => v.id === currentAssessment.vendorId) : undefined;
  const riskScore = currentAssessment && currentAssessment.findings.length > 0
    ? calculateRiskScore(currentAssessment.findings)
    : null;

  const handleDownload = () => {
    if (!currentVendor || !currentAssessment || !riskScore) return;
    downloadPDF(currentVendor, currentAssessment, riskScore);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "border-red-500 bg-red-500/10";
      case "high": return "border-orange-500 bg-orange-500/10";
      case "medium": return "border-amber-500 bg-amber-500/10";
      case "low": return "border-emerald-500 bg-emerald-500/10";
      default: return "border-slate-500 bg-slate-500/10";
    }
  };

  if (loading) {
    return (
      <PageContainer title="Reports" subtitle="Generate executive risk assessment reports">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-slate-800 rounded-xl" />
          <div className="h-64 bg-slate-800 rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Reports" subtitle="Generate executive risk assessment reports">
      {/* Report Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Select Vendor</label>
              <select
                value={selectedVendor}
                onChange={(e) => {
                  setSelectedVendor(e.target.value);
                  setSelectedAssessment("");
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">All Vendors</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Select Assessment</label>
              <select
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose an assessment...</option>
                {vendorAssessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.vendorName} - {a.type.toUpperCase()} ({new Date(a.completedAt || a.createdAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <Button
                disabled={!selectedAssessment}
                onClick={() => setShowPreview(true)}
              >
                <Eye size={16} /> Preview Report
              </Button>
              <Button
                variant="secondary"
                disabled={!selectedAssessment}
                onClick={handleDownload}
              >
                <Download size={16} /> Print / Save PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Summary Card */}
        {riskScore && currentAssessment && currentVendor && (
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" />
                <span className="text-sm text-white">{currentVendor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-400" />
                <Badge variant={riskScore.level as "critical" | "high" | "medium" | "low"}>{riskScore.level.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-slate-400" />
                <span className="text-sm text-white">Score: {riskScore.overall}/100</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm text-slate-300">
                  {currentAssessment.completedAt
                    ? new Date(currentAssessment.completedAt).toLocaleDateString()
                    : "In Progress"}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Completed Assessments List */}
      <Card padding={false}>
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-white">Available Reports</h3>
          <p className="text-sm text-slate-400 mt-1">{completedAssessments.length} completed assessments ready for reporting</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Score</th>
              <th className="px-6 py-3">Level</th>
              <th className="px-6 py-3">Completed</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {completedAssessments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <FileText size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400">No completed assessments yet</p>
                  <p className="text-xs text-slate-500 mt-1">Complete assessments in the Assessments tab to generate reports</p>
                </td>
              </tr>
            ) : (
              completedAssessments.map((a) => {
                const aScore = a.findings.length > 0 ? calculateRiskScore(a.findings) : null;
                return (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3 text-white font-medium">{a.vendorName}</td>
                    <td className="px-6 py-3">
                      <Badge variant="info">{a.type.toUpperCase()}</Badge>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`font-bold ${
                        a.score >= 75 ? "text-red-400" : a.score >= 50 ? "text-orange-400" : a.score >= 25 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {a.score}/100
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={aScore?.level as "critical" | "high" | "medium" | "low" || "default"}>
                        {aScore?.level?.toUpperCase() || "N/A"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-slate-400">
                      {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedVendor(a.vendorId);
                            setSelectedAssessment(a.id);
                            setShowPreview(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVendor(a.vendorId);
                            setSelectedAssessment(a.id);
                            const v = vendors.find((v) => v.id === a.vendorId);
                            if (v && aScore) downloadPDF(v, a, aScore);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Report Preview" size="xl">
        {currentAssessment && currentVendor && riskScore && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white">Third-Party Risk Assessment Report</h2>
              <p className="text-sm text-slate-300 mt-1">
                {currentVendor.name} | {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
              <div className={`rounded-lg p-4 text-center border-l-4 ${getRiskColor(riskScore.level)}`}>
                <p className="text-3xl font-bold text-white">{riskScore.overall}</p>
                <p className="text-xs text-slate-400 uppercase">Risk Score</p>
              </div>
              <div className="rounded-lg p-4 text-center border-l-4 border-blue-500 bg-blue-500/10">
                <p className="text-3xl font-bold text-white">{currentAssessment.findings.length}</p>
                <p className="text-xs text-slate-400 uppercase">Controls</p>
              </div>
              <div className="rounded-lg p-4 text-center border-l-4 border-emerald-500 bg-emerald-500/10">
                <p className="text-3xl font-bold text-white">{currentAssessment.findings.filter((f) => f.status === "compliant").length}</p>
                <p className="text-xs text-slate-400 uppercase">Compliant</p>
              </div>
              <div className="rounded-lg p-4 text-center border-l-4 border-red-500 bg-red-500/10">
                <p className="text-3xl font-bold text-white">{currentAssessment.findings.filter((f) => f.status !== "compliant" && f.status !== "not_applicable").length}</p>
                <p className="text-xs text-slate-400 uppercase">Gaps</p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-slate-800/50 border-l-4 border-blue-500 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-2">AI Risk Summary</h3>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {currentAssessment.aiSummary.split("**").map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
                )}
              </div>
            </div>

            {/* Risk Categories */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Risk Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(riskScore.categories).map(([name, score]) => {
                  const displayName = name.replace(/([A-Z])/g, " $1").trim();
                  const level = score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";
                  return (
                    <div key={name} className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3">
                      <span className="text-sm text-slate-300">{displayName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{score}</span>
                        <Badge variant={level}>{level}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Findings Table */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Findings Detail</h3>
              <div className="bg-slate-800/30 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-slate-500 uppercase bg-slate-900/50">
                      <th className="px-4 py-2">Control Area</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {currentAssessment.findings.map((f) => (
                      <tr key={f.id}>
                        <td className="px-4 py-2 text-slate-300">{f.controlArea}</td>
                        <td className="px-4 py-2 text-slate-400">{f.description}</td>
                        <td className="px-4 py-2">
                          <Badge variant={f.status === "compliant" ? "success" : f.status === "partial" ? "warning" : "critical"}>
                            {f.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={f.riskLevel as "critical" | "high" | "medium" | "low"}>{f.riskLevel}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-700/50">
              <Button variant="secondary" onClick={() => setShowPreview(false)}>Close</Button>
              <Button onClick={handleDownload}>
                <Download size={16} /> Print / Save PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
