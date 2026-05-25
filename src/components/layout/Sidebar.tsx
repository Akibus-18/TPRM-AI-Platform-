"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  Shield,
  FileText,
  FolderOpen,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendors", label: "Vendors", icon: Building2 },
  { href: "/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/compliance", label: "Compliance", icon: Shield },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/evidence", label: "Evidence", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-70/50 flex flex-col z-40">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">TPRM AI</h1>
            <p className="text-[11px] text-slate-400 font-medium">Risk Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">GRC Platform</p>
          <p className="text-xs text-slate-400 mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
