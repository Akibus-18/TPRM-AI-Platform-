"use client";

import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Vendor } from "@/types";
import { getVendors, saveVendor, deleteVendor } from "@/lib/store";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  Plus,
  Search,
  Building2,
  Mail,
  Globe,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

const CATEGORIES = [
  "Cloud Provider",
  "SaaS",
  "Consulting",
  "FinTech",
  "Healthcare IT",
  "Security Vendor",
  "AI/ML Vendor",
  "DevOps",
  "Other",
] as const;

const TIERS = ["critical", "high", "medium", "low"] as const;

const STATUSES = ["active", "inactive", "under_review", "onboarding"] as const;

type SortField = "name" | "riskScore" | null;
type SortDirection = "asc" | "desc";

const emptyForm: Omit<Vendor, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  category: "Cloud Provider",
  contactEmail: "",
  contactName: "",
  status: "onboarding",
  riskLevel: "none",
  riskScore: 0,
  tier: "medium",
  nextAssessmentDue: "",
  tags: [],
  industry: "",
  website: "",
  dataAccess: "",
  serviceDescription: "",
};

function getRiskScoreColor(score: number): string {
  if (score >= 75) return "text-red-400";
  if (score >= 50) return "text-orange-400";
  if (score >= 25) return "text-amber-400";
  return "text-green-400";
}

function getStatusBadgeVariant(status: Vendor["status"]): "success" | "none" | "warning" | "info" {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "none";
    case "under_review":
      return "warning";
    case "onboarding":
      return "info";
  }
}

function getStatusLabel(status: Vendor["status"]): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "under_review":
      return "Under Review";
    case "onboarding":
      return "Onboarding";
  }
}

function getRiskLevelBadgeVariant(level: Vendor["riskLevel"]): "critical" | "high" | "medium" | "low" | "none" {
  switch (level) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    case "none":
      return "none";
  }
}

function getRiskLevelFromScore(score: number): Vendor["riskLevel"] {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  if (score > 0) return "low";
  return "none";
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(getVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<Omit<Vendor, "id" | "createdAt" | "updatedAt">>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Filtered and sorted vendors
  const displayedVendors = useMemo(() => {
    let result = [...vendors];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.contactName.toLowerCase().includes(q) ||
          v.contactEmail.toLowerCase().includes(q) ||
          v.industry.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Risk level filter
    if (riskFilter !== "all") {
      result = result.filter((v) => v.riskLevel === riskFilter);
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === "riskScore") {
          cmp = a.riskScore - b.riskScore;
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [vendors, searchQuery, riskFilter, sortField, sortDirection]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function openAddModal() {
    setIsEditing(false);
    setSelectedVendor(null);
    setFormData(emptyForm);
    setTagsInput("");
    setIsFormModalOpen(true);
  }

  function openEditModal(vendor: Vendor) {
    setIsEditing(true);
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      category: vendor.category,
      contactEmail: vendor.contactEmail,
      contactName: vendor.contactName,
      status: vendor.status,
      riskLevel: vendor.riskLevel,
      riskScore: vendor.riskScore,
      tier: vendor.tier,
      nextAssessmentDue: vendor.nextAssessmentDue,
      tags: vendor.tags,
      industry: vendor.industry,
      website: vendor.website,
      dataAccess: vendor.dataAccess,
      serviceDescription: vendor.serviceDescription,
    });
    setTagsInput(vendor.tags.join(", "));
    setIsFormModalOpen(true);
    setActionMenuOpen(null);
  }

  function openDetailModal(vendor: Vendor) {
    setSelectedVendor(vendor);
    setIsDetailModalOpen(true);
    setActionMenuOpen(null);
  }

  function openDeleteConfirm(vendor: Vendor) {
    setSelectedVendor(vendor);
    setIsDeleteConfirmOpen(true);
    setActionMenuOpen(null);
  }

  function handleSave() {
    const now = new Date().toISOString();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const riskLevel = getRiskLevelFromScore(formData.riskScore);

    if (isEditing && selectedVendor) {
      const updated: Vendor = {
        ...selectedVendor,
        ...formData,
        tags,
        riskLevel,
        updatedAt: now,
      };
      saveVendor(updated);
      setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    } else {
      const newVendor: Vendor = {
        ...formData,
        id: uuidv4(),
        tags,
        riskLevel,
        createdAt: now,
        updatedAt: now,
      };
      saveVendor(newVendor);
      setVendors((prev) => [...prev, newVendor]);
    }

    setIsFormModalOpen(false);
  }

  function handleDelete() {
    if (selectedVendor) {
      deleteVendor(selectedVendor.id);
      setVendors((prev) => prev.filter((v) => v.id !== selectedVendor.id));
      setIsDeleteConfirmOpen(false);
      setSelectedVendor(null);
    }
  }

  function handleFormChange(
    field: keyof typeof formData,
    value: string | number | string[]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " \u2191" : " \u2193";
  };

  return (
    <PageContainer
      title="Vendors"
      subtitle="Manage your third-party vendor relationships and risk assessments"
      actions={
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      }
    >
      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendors by name, category, contact, industry, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Vendor Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th
                  onClick={() => handleSort("name")}
                  className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none"
                >
                  Name{sortIndicator("name")}
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Category
                </th>
                <th
                  onClick={() => handleSort("riskScore")}
                  className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none"
                >
                  Risk Score{sortIndicator("riskScore")}
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Tier
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {displayedVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-lg font-medium">No vendors found</p>
                    <p className="text-slate-500 text-sm mt-1">
                      {searchQuery || riskFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : 'Click "Add Vendor" to get started'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-slate-700 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{vendor.name}</p>
                          <p className="text-slate-400 text-sm">{vendor.contactName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 text-sm">{vendor.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <ProgressBar
                          value={vendor.riskScore}
                          max={100}
                          className="flex-1"
                        />
                        <span
                          className={`text-sm font-semibold tabular-nums ${getRiskScoreColor(vendor.riskScore)}`}
                        >
                          {vendor.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getRiskLevelBadgeVariant(vendor.riskLevel)}>
                        {vendor.riskLevel === "none"
                          ? "N/A"
                          : vendor.riskLevel.charAt(0).toUpperCase() +
                            vendor.riskLevel.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(vendor.status)}>
                        {getStatusLabel(vendor.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 text-sm capitalize">
                        {vendor.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === vendor.id ? null : vendor.id
                            )
                          }
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {actionMenuOpen === vendor.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActionMenuOpen(null)}
                            />
                            <div className="absolute right-0 mt-1 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1">
                              <button
                                onClick={() => openDetailModal(vendor)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => openEditModal(vendor)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Vendor
                              </button>
                              <hr className="border-slate-700 my-1" />
                              <button
                                onClick={() => openDeleteConfirm(vendor)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Vendor
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with count */}
        {displayedVendors.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-700 text-sm text-slate-400">
            Showing {displayedVendors.length} of {vendors.length} vendor
            {vendors.length !== 1 ? "s" : ""}
          </div>
        )}
      </Card>

      {/* Add / Edit Vendor Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditing ? "Edit Vendor" : "Add New Vendor"}
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Vendor Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleFormChange("industry", e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleFormChange("website", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleFormChange("contactName", e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleFormChange("contactEmail", e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Risk & Classification */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Risk &amp; Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Tier <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) =>
                    handleFormChange("tier", e.target.value as Vendor["tier"])
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Risk Score (0–100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.riskScore}
                  onChange={(e) =>
                    handleFormChange("riskScore", Math.min(100, Math.max(0, Number(e.target.value))))
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    handleFormChange("status", e.target.value as Vendor["status"])
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s === "under_review"
                        ? "Under Review"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Service Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Service Description
                </label>
                <textarea
                  value={formData.serviceDescription}
                  onChange={(e) =>
                    handleFormChange("serviceDescription", e.target.value)
                  }
                  placeholder="Describe the services provided by this vendor..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Data Access Level
                </label>
                <input
                  type="text"
                  value={formData.dataAccess}
                  onChange={(e) => handleFormChange("dataAccess", e.target.value)}
                  placeholder="e.g. PII, Financial, Internal, Public"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Next Assessment Due
                </label>
                <input
                  type="date"
                  value={formData.nextAssessmentDue}
                  onChange={(e) =>
                    handleFormChange("nextAssessmentDue", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Tags
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. cloud, critical-data, annual-review"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {tagsInput.trim() && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="secondary"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim()}
            >
              {isEditing ? "Save Changes" : "Add Vendor"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Vendor Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Vendor Details"
        size="lg"
      >
        {selectedVendor && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-slate-700 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">
                  {selectedVendor.name}
                </h2>
                <p className="text-slate-400 text-sm">
                  {selectedVendor.category} &middot; {selectedVendor.industry || "No industry specified"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusBadgeVariant(selectedVendor.status)}>
                    {getStatusLabel(selectedVendor.status)}
                  </Badge>
                  <Badge variant={getRiskLevelBadgeVariant(selectedVendor.riskLevel)}>
                    {selectedVendor.riskLevel === "none"
                      ? "No Risk"
                      : `${selectedVendor.riskLevel.charAt(0).toUpperCase() + selectedVendor.riskLevel.slice(1)} Risk`}
                  </Badge>
                  <span className="text-slate-500 text-sm capitalize">
                    Tier: {selectedVendor.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Score Visualization */}
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Risk Score
                </h3>
                <span
                  className={`text-3xl font-bold tabular-nums ${getRiskScoreColor(selectedVendor.riskScore)}`}
                >
                  {selectedVendor.riskScore}
                  <span className="text-sm font-normal text-slate-500">/100</span>
                </span>
              </div>
              <ProgressBar
                value={selectedVendor.riskScore}
                max={100}
                className="h-3"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Low Risk</span>
                <span>Medium</span>
                <span>High</span>
                <span>Critical</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm text-white">
                        {selectedVendor.contactEmail || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Contact Name</p>
                      <p className="text-sm text-white">
                        {selectedVendor.contactName || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Website</p>
                      {selectedVendor.website ? (
                        <a
                          href={selectedVendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:underline"
                        >
                          {selectedVendor.website}
                        </a>
                      ) : (
                        <p className="text-sm text-white">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Service Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Service Description</p>
                    <p className="text-sm text-white">
                      {selectedVendor.serviceDescription || "No description provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Data Access Level</p>
                    <p className="text-sm text-white">
                      {selectedVendor.dataAccess || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Next Assessment Due</p>
                    <p className="text-sm text-white">
                      {selectedVendor.nextAssessmentDue
                        ? new Date(selectedVendor.nextAssessmentDue).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "Not scheduled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Tags
              </h3>
              {selectedVendor.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No tags assigned</p>
              )}
            </div>

            {/* Metadata */}
            <div className="border-t border-slate-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                <div>
                  <span className="block text-slate-400 font-medium mb-0.5">Created</span>
                  {new Date(selectedVendor.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div>
                  <span className="block text-slate-400 font-medium mb-0.5">Last Updated</span>
                  {new Date(selectedVendor.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            {/* Detail Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  openEditModal(selectedVendor);
                }}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Vendor"
        size="sm"
      >
        {selectedVendor && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium">
                  Are you sure you want to delete this vendor?
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  <strong className="text-white">{selectedVendor.name}</strong> will be
                  permanently removed. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Vendor
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
