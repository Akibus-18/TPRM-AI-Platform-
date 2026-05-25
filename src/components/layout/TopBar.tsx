"use client";
import React from "react";
import { Search, Bell, User } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search vendors, assessments..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">GRC Analyst</p>
            <p className="text-[11px] text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
