"use client";
import React, { useState, useEffect } from "react";
import { Evidence, Vendor } from "@/types";
import { getEvidence, getVendors, saveEvidence, deleteEvidence } from "@/lib/store";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Upload, Search, FileText, Award, File, HelpCircle, Trash2, FolderOpen } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  policy: <FileText size={18} className="text-blue-400" />,
  certificate: <Award size={18} className="text-emerald-400" />,
  report: <File size={18} className="text-amber-400" />,
  questionnaire: <FileText size={18} className="text-purple-400" />,
  other: <HelpCircle size={18} className="text-slate-400" />,
};

const TYPE_BADGES: Record<string, "info" | "success" | "warning" | "default"> = {
  policy: "info",
  certificate: "success",
  report: "warning",
  questionnaire: "default",
  other: "default",
};

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    vendorId: "",
    filename: "",
    type: "policy" as Evidence["type"],
    notes: "",
    size: "",
  });

  useEffect(() => {
    setEvidence(getEvidence());
    setVendors(getVendors());
    setLoading(false);
  }, []);

  const filtered = evidence.filter((e) => {
    const matchSearch = e.filename.toLowerCase().includes(search.toLowerCase()) ||
      e.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      e.notes.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleUpload = () => {
    const vendor = vendors.find((v) => v.id === form.vendorId);
    if (!vendor || !form.filename) return;

    const newEvidence: Evidence = {
      id: uuidv4(),
      vendorId: form.vendorId,
      vendorName: vendor.name,
      filename: form.filename,
      type: form.type,
      uploadedAt: new Date().toISOString(),
      notes: form.notes,
      size: form.size || "Unknown",
    };

    saveEvidence(newEvidence);
    setEvidence(getEvidence());
    setShowUpload(false);
    setForm({ vendorId: "", filename: "", type: "policy", notes: "", size: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this evidence?")) {
      deleteEvidence(id);
      setEvidence(getEvidence());
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <PageContainer title="Evidence Repository" subtitle="Manage and organize vendor compliance evidence">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-800 rounded-lg w-96" />
          <div className="h-64 bg-slate-800 rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Evidence Repository"
      subtitle="Manage and organize vendor compliance evidence"
      actions={
        <Button onClick={() => setShowUpload(true)}>
          <Upload size={16} /> Upload Evidence
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
        >
          <option value="all">All Types</option>
          <option value="policy">Policy</option>
          <option value="certificate">Certificate</option>
          <option value="report">Report</option>
          <option value="questionnaire">Questionnaire</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {["all", "policy", "certificate", "report", "questionnaire"].map((type) => {
          const count = type === "all" ? evidence.length : evidence.filter((e) => e.type === type).length;
          return (
            <Card key={type} className="cursor-pointer hover:border-slate-600 transition-colors" onClick={() => setTypeFilter(type)}>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-slate-400 capitalize">{type === "all" ? "Total" : type}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Evidence List */}
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-700/50">
              <th className="px-6 py-3">File</th>
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Uploaded</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Notes</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <FolderOpen size={40} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-400">No evidence found</p>
                  <p className="text-xs text-slate-500 mt-1">Upload evidence documents to get started</p>
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {TYPE_ICONS[e.type]}
                      <span className="text-white font-medium">{e.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-300">{e.vendorName}</td>
                  <td className="px-6 py-3">
                    <Badge variant={TYPE_BADGES[e.type] || "default"}>{e.type}</Badge>
                  </td>
                  <td className="px-6 py-3 text-slate-400">{formatDate(e.uploadedAt)}</td>
                  <td className="px-6 py-3 text-slate-400">{e.size}</td>
                  <td className="px-6 py-3 text-slate-400 max-w-[200px] truncate">{e.notes}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Upload Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Evidence">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Vendor *</label>
            <select
              value={form.vendorId}
              onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select vendor...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Filename *</label>
            <input
              type="text"
              value={form.filename}
              onChange={(e) => setForm({ ...form, filename: e.target.value })}
              placeholder="e.g., SOC2_Report_2026.pdf"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Evidence["type"] })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="policy">Policy</option>
              <option value="certificate">Certificate</option>
              <option value="report">Report</option>
              <option value="questionnaire">Questionnaire</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">File Size</label>
            <input
              type="text"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              placeholder="e.g., 2.4 MB"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Brief description of the evidence..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowUpload(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!form.vendorId || !form.filename}>
              <Upload size={16} /> Upload
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
