"use client";
import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({ value, max = 100, size = "md", showLabel = false, className = "" }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const color = pct >= 75 ? "bg-red-500" : pct >= 50 ? "bg-orange-500" : pct >= 25 ? "bg-amber-500" : "bg-emerald-500";
  const heights = { sm: "h-1.5", md: "h-2.5" };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-slate-700 rounded-full ${heights[size]} overflow-hidden`}>
        <div className={`${color} ${heights[size]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-slate-400 font-medium min-w-[32px] text-right">{pct}%</span>}
    </div>
  );
}
