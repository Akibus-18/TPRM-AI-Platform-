"use client";
import React, { useState, useEffect } from "react";
import { AppSettings } from "@/types";
import { getSettings, saveSettings, exportData, importData, resetData } from "@/lib/store";
import PageContainer from "@/components/layout/PageContainer";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Save, Download, Upload, RotateCcw, Key, Building2, Shield, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    openaiApiKey: "",
    companyName: "Acme Corporation",
    riskTolerance: "medium",
    assessmentFrequency: 365,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSettings(getSettings());
    setLoading(false);
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tprm-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = importData(ev.target?.result as string);
        if (result) {
          alert("Data imported successfully! Refreshing...");
          window.location.reload();
        } else {
          alert("Failed to import data. Please check the file format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm("This will reset all data to sample defaults. Are you sure?")) {
      resetData();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <PageContainer title="Settings" subtitle="Configure your TPRM platform">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-slate-800 rounded-xl" />
          <div className="h-48 bg-slate-800 rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Settings" subtitle="Configure your TPRM platform">
      <div className="max-w-2xl space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 size={20} className="text-blue-400" />
              General Settings
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Risk Tolerance</label>
              <select
                value={settings.riskTolerance}
                onChange={(e) => setSettings({ ...settings, riskTolerance: e.target.value as AppSettings["riskTolerance"] })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low - Strict risk thresholds</option>
                <option value="medium">Medium - Balanced approach</option>
                <option value="high">High - Accept higher risk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Assessment Frequency (days)
              </label>
              <input
                type="number"
                value={settings.assessmentFrequency}
                onChange={(e) => setSettings({ ...settings, assessmentFrequency: parseInt(e.target.value) || 365 })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">How often vendors should be reassessed</p>
            </div>
          </div>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key size={20} className="text-purple-400" />
              AI Configuration (Optional)
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">OpenAI API Key</label>
              <input
                type="password"
                value={settings.openaiApiKey}
                onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Enhance AI analysis with OpenAI. The platform works without this using built-in rule-based scoring.</p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button onClick={handleSave}>
            <Save size={16} /> {saved ? "Saved!" : "Save Settings"}
          </Button>
          {saved && <span className="text-sm text-emerald-400">Settings saved successfully</span>}
        </div>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} className="text-amber-400" />
              Data Management
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              All data is stored in your browser&apos;s localStorage. Export regularly to prevent data loss.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleExport}>
                <Download size={16} /> Export Data
              </Button>
              <Button variant="secondary" onClick={handleImport}>
                <Upload size={16} /> Import Data
              </Button>
              <Button variant="danger" onClick={handleReset}>
                <RotateCcw size={16} /> Reset to Sample Data
              </Button>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <div className="flex gap-3">
            <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">Data Storage Notice</p>
              <p className="text-xs text-slate-400 mt-1">
                This application stores all data locally in your browser. Clearing browser data will remove all vendors,
                assessments, and evidence. Use the Export feature to create backups.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
