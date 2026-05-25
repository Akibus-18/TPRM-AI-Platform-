"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Building2, AlertTriangle, ClipboardCheck, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PageContainer from "@/components/layout/PageContainer";
import { getVendors, getAssessments, getActivity } from "@/lib/store";
import { Vendor, Assessment, ActivityLog } from "@/types";

const RISK_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#22c55e",
};

const CHART_BLUE = "#3b82f6";

const MOCK_MONTHLY_SCORES = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 71 },
  { month: "May", score: 79 },
  { month: "Jun", score: 82 },
];

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 animate-pulse">
      <div className="h-4 w-24 bg-slate-700 rounded mb-4" />
      <div className="h-8 w-16 bg-slate-700 rounded" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 animate-pulse">
      <div className="h-5 w-40 bg-slate-700 rounded mb-6" />
      <div className="h-64 bg-slate-700 rounded" />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 animate-pulse">
      <div className="h-5 w-36 bg-slate-700 rounded mb-6" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 mb-4">
          <div className="h-4 w-4 bg-slate-700 rounded" />
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-slate-700 rounded mb-2" />
            <div className="h-3 w-1/2 bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadData() {
      try {
        const v = getVendors();
        const a = getAssessments();
        const act = getActivity();
        setVendors(v);
        setAssessments(a);
        setActivity(act);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Derived KPI values ---
  const totalVendors = vendors.length;
  const avgRiskScore =
    vendors.length > 0
      ? Math.round(
          (vendors.reduce((sum, v) => sum + v.riskScore, 0) / vendors.length) *
            10
        ) / 10
      : 0;
  const pendingAssessments = assessments.filter(
    (a) => a.status === "in_progress" || a.status === "draft"
  ).length;
  const overdueReviews = vendors.filter((v) => {
    const reviewDate = new Date(v.nextAssessmentDue);
    return !isNaN(reviewDate.getTime()) && reviewDate < new Date();
  }).length;

  // --- Risk distribution for pie chart ---
  const riskCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  vendors.forEach((v) => {
    if (v.riskLevel in riskCounts) {
      riskCounts[v.riskLevel]++;
    }
  });
  const riskDistribution = Object.entries(riskCounts)
    .filter(([, count]) => count > 0)
    .map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: RISK_COLORS[level],
    }));

  // --- KPI border color logic ---
  const getScoreBorderColor = (score: number) => {
    if (score >= 80) return "border-l-green-500";
    if (score >= 60) return "border-l-amber-500";
    return "border-l-red-500";
  };

  if (loading) {
    return (
      <PageContainer
        title="Dashboard"
        subtitle="Third-Party Risk Management Overview"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <SkeletonList />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Third-Party Risk Management Overview"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Vendors */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Total Vendors
            </span>
            <Building2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-white">{totalVendors}</div>
          <p className="text-xs text-slate-500 mt-1">Active third parties</p>
        </div>

        {/* Average Risk Score */}
        <div
          className={`rounded-xl border border-slate-700 bg-slate-800 p-6 border-l-4 ${getScoreBorderColor(avgRiskScore)}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Avg Risk Score
            </span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-white">{avgRiskScore}</div>
          <p className="text-xs text-slate-500 mt-1">Out of 100</p>
        </div>

        {/* Pending Assessments */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Pending Assessments
            </span>
            <ClipboardCheck className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-white">
            {pendingAssessments}
          </div>
          <p className="text-xs text-slate-500 mt-1">In progress or queued</p>
        </div>

        {/* Overdue Reviews */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Overdue Reviews
            </span>
            <Clock className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-white">{overdueReviews}</div>
          <p className="text-xs text-slate-500 mt-1">Require immediate action</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Distribution Pie */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Risk Distribution
          </h3>
          {riskDistribution.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">
              No vendor data available
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 shrink-0">
                {riskDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-slate-300">
                      {entry.name}
                    </span>
                    <Badge variant="default" className="ml-auto">
                      {entry.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assessment Trend Line */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Assessment Score Trend
          </h3>
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={MOCK_MONTHLY_SCORES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                domain={[50, 100]}
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "#334155" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={CHART_BLUE}
                strokeWidth={2}
                dot={{ fill: CHART_BLUE, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Recent Activity
        </h3>
        {activity.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No recent activity
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {activity.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">
                    <span className="font-medium text-white">
                      {item.user}
                    </span>{" "}
                    {item.action}{" "}
                    <span className="font-medium text-blue-400">
                      {item.entity}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <Badge variant="default" className="text-xs capitalize">
                      {item.entityType}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
