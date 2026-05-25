"use client";
import React from "react";

type BadgeVariant = "critical" | "high" | "medium" | "low" | "none" | "default" | "success" | "warning" | "info" | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  none: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  default: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
