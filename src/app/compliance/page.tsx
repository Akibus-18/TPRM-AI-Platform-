"use client";
import React, { useState, useEffect } from "react";
import { FRAMEWORKS, getControlsByDomain } from "@/lib/compliance-mapper";
import { getVendors, getAssessments } from "@/lib/store";
import { Vendor, Assessment } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Shield, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight } from "lucide-react";

export default function CompliancePage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>("nist-csf");
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setVendors(getVendors());
    setAssessments(getAssessments());
    const fw = FRAMEWORKS.find((f) => f.id === "nist-csf");
    if (fw) {
      const domains = [...new Set(fw.controls.map((c) => c.domain))];
      setExpandedDomains(new Set(domains));
    }
    setLoading(false);
  }, []);

  const framework = FRAMEWORKS.find((f) => f.id === selectedFramework);
  const controlsByDomain = framework ? getControlsByDomain(selectedFramework) : {};

  const toggleDomain = (domain: string) => {
    const next = new Set(expandedDomains);
    if (next.has(domain)) next.delete(domain);
    else next.add(domain);
    setExpandedDomains(next);
  };

  const getComplianceStatus = (controlId: string) => {
    let compliant = 0;
    let total = 0;
    assessments.filter((a) => a.status === "completed").forEach((a) => {
      a.findings.forEach((f) => {
        if (f.controlArea.toLowerCase().includes(controlId.split(".")[0].toLowerCase()) ||
            f.controlArea.toLowerCase().includes("compliance")) {
          total++;
          if (f.status === "compliant") compliant++;
        }
      });
    });
    if (total === 0) return { status: "unknown", color: "text-slate-500" };
    const rate = compliant / total;
    if (rate >= 0.8) return { status: "strong", color: "text-emerald-400" };
    if (rate >= 0.5) return { status: "moderate", color: "text-amber-400" };
    return { status: "weak", color: "text-red-400" };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "strong": return <CheckCircle size={16} className="text-emerald-400" />;
      case "moderate": return <AlertTriangle size={16} className="text-amber-400" />;
      case "weak": return <XCircle size={16} className="text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full border border-slate-600" />;
    }
  };

  if (loading) {
    return (
      <PageContainer title="Compliance Mapping" subtitle="Map vendor controls against regulatory frameworks">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-800 rounded-lg w-96" />
          <div className="h-64 bg-slate-800 rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Compliance Mapping" subtitle="Map vendor controls against regulatory frameworks">
      {/* Framework Selector */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {FRAMEWORKS.map((fw) => (
          <button
            key={fw.id}
            onClick={() => {
              setSelectedFramework(fw.id);
              const domains = [...new Set(fw.controls.map((c) => c.domain))];
              setExpandedDomains(new Set(domains));
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFramework === fw.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50"
            }`}
          >
            {fw.shortName}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Shield size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{framework?.controls.length || 0}</p>
              <p className="text-xs text-slate-400">Total Controls</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{vendors.length}</p>
              <p className="text-xs text-slate-400">Vendors Assessed</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{assessments.filter((a) => a.status === "in_progress").length}</p>
              <p className="text-xs text-slate-400">In Progress</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{assessments.filter((a) => a.status === "completed").length}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls Grid */}
      <Card padding={false}>
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-white">{framework?.name}</h3>
          <p className="text-sm text-slate-400 mt-1">{framework?.controls.length} controls across {Object.keys(controlsByDomain).length} domains</p>
        </div>
        <div className="divide-y divide-slate-700/30">
          {Object.entries(controlsByDomain).map(([domain, controls]) => {
            const isExpanded = expandedDomains.has(domain);
            return (
              <div key={domain}>
                <button
                  onClick={() => toggleDomain(domain)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                    <span className="font-medium text-white">{domain}</span>
                    <Badge variant="info">{controls.length} controls</Badge>
                  </div>
                </button>
                {isExpanded && (
                  <div className="bg-slate-900/50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                          <th className="px-6 py-3">Control ID</th>
                          <th className="px-6 py-3">Description</th>
                          <th className="px-6 py-3">Requirement</th>
                          <th className="px-6 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {controls.map((control) => {
                          const status = getComplianceStatus(control.controlId);
                          return (
                            <tr key={control.id} className="hover:bg-slate-800/20 transition-colors">
                              <td className="px-6 py-3">
                                <code className="text-xs bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono">{control.controlId}</code>
                              </td>
                              <td className="px-6 py-3 text-slate-300">{control.description}</td>
                              <td className="px-6 py-3 text-slate-400">{control.requirement}</td>
                              <td className="px-6 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {getStatusIcon(status.status)}
                                  <span className={`text-xs font-medium ${status.color}`}>{status.status}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </PageContainer>
  );
}
