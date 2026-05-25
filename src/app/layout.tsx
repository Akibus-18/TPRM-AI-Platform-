"use client";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useEffect } from "react";
import { initializeData } from "@/lib/store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>TPRM AI - Third-Party Risk Management</title>
        <meta name="description" content="AI-Powered Third-Party Risk Management Platform" />
      </head>
      <body className="bg-slate-950 text-slate-200 antialiased">
        <Sidebar />
        <div className="ml-64 min-h-screen flex flex-col">
          <TopBar />
          <main className="flex-1 bg-slate-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
