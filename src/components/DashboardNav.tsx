"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { 
  Activity, 
  LayoutDashboard, 
  Calendar, 
  ActivitySquare, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";

export default function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const patientLinks = [
    { name: "Overview", href: "/patient/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Appointments", href: "/patient/appointments", icon: <Calendar className="h-5 w-5" /> },
    { name: "Treatment Journey", href: "/patient/treatments", icon: <ActivitySquare className="h-5 w-5" /> },
    { name: "Dental Records", href: "/patient/documents", icon: <FileText className="h-5 w-5" /> },
    { name: "Smile Simulator", href: "/patient/simulator", icon: <Sparkles className="h-5 w-5" /> },
    { name: "Insurance Profile", href: "/patient/insurance", icon: <ShieldCheck className="h-5 w-5" /> },
    { name: "Payment Portal", href: "/patient/payments", icon: <CreditCard className="h-5 w-5" /> },
  ];

  const clinicalLinks = [
    { name: "Clinic Console", href: "/doctor/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  ];

  const adminLinks = [
    { name: "Admin Console", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  ];

  const links = user.role === "PATIENT" 
    ? patientLinks 
    : ["DENTIST", "ASSISTANT", "RECEPTIONIST"].includes(user.role)
      ? clinicalLinks 
      : adminLinks;

  return (
    <>
      {/* Mobile Top Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-lg">SmileOS</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 focus:outline-none">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-400 border-r border-slate-800 transition-transform md:translate-x-0 md:static md:h-screen shrink-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center space-x-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-lg tracking-tight">SmileOS</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar User info */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white font-bold text-sm shrink-0 border border-slate-700">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="overflow-hidden">
            <span className="block text-sm font-semibold text-white truncate">{user.name}</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{user.role}</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-sm" : "hover:bg-slate-800 hover:text-white"}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Logout Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-red-950/30 hover:text-red-400 transition cursor-pointer text-slate-400"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/40 z-40 md:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}
