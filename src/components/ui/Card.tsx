"use client";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", padding = true, onClick }: CardProps) {
  return (
    <div onClick={onClick} className={`bg-slate-800/50 border border-slate-700/50 rounded-xl ${padding ? "p-6" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>;
}
