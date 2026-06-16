"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Lock, Mail, Activity, ArrowRight, AlertTriangle, Key } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  
  const [role, setRole] = useState<"PATIENT" | "DOCTOR" | "ADMIN">("PATIENT");
  const [email, setEmail] = useState("sarah@smileos.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    const success = await login(email, role);
    setSubmitting(false);
    
    if (!success) {
      setError("Authentication failed. Please verify credentials and role alignment.");
    }
  };

  // Demo helper to autofill and login instantly
  const handleQuickLogin = async (demoEmail: string, demoRole: "PATIENT" | "DOCTOR" | "ADMIN") => {
    setError("");
    setSubmitting(true);
    setEmail(demoEmail);
    setRole(demoRole);
    
    const success = await login(demoEmail, demoRole);
    setSubmitting(false);
    
    if (!success) {
      setError("Demo authentication failed. Seed the database first.");
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Activity className="h-5 w-5" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">Access SmileOS</h1>
            <p className="mt-2 text-sm text-slate-500">Log in to your patient portal, clinician sheet, or clinic console.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Role Tab Selector */}
            <div className="flex border-b border-slate-100 pb-2">
              <button
                onClick={() => {
                  setRole("PATIENT");
                  setEmail("sarah@smileos.com");
                }}
                className={`flex-1 text-center pb-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${role === "PATIENT" ? "border-b-2 border-blue-500 text-blue-600" : "text-slate-400 hover:text-slate-700"}`}
              >
                Patient
              </button>
              <button
                onClick={() => {
                  setRole("DOCTOR");
                  setEmail("ahmed@smileos.com");
                }}
                className={`flex-1 text-center pb-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${role === "DOCTOR" ? "border-b-2 border-blue-500 text-blue-600" : "text-slate-400 hover:text-slate-700"}`}
              >
                Dentist
              </button>
              <button
                onClick={() => {
                  setRole("ADMIN");
                  setEmail("admin@smileos.com");
                }}
                className={`flex-1 text-center pb-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${role === "ADMIN" ? "border-b-2 border-blue-500 text-blue-600" : "text-slate-400 hover:text-slate-700"}`}
              >
                Admin
              </button>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-200 flex items-center space-x-1.5 animate-shake">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition"
                    placeholder="sarah@smileos.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-blue-600 text-white font-bold py-3 text-sm hover:bg-blue-700 transition cursor-pointer"
              >
                {submitting ? <span>Authenticating...</span> : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Options */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-blue-600" />
                <span>Quick Demo Access</span>
              </span>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => handleQuickLogin("sarah@smileos.com", "PATIENT")}
                  className="rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 p-2.5 text-left transition cursor-pointer"
                >
                  <span className="block text-slate-800">Sarah Connor</span>
                  <span className="text-[10px] text-slate-500 font-medium font-mono">Patient Demo</span>
                </button>
                <button
                  onClick={() => handleQuickLogin("ahmed@smileos.com", "DOCTOR")}
                  className="rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 p-2.5 text-left transition cursor-pointer"
                >
                  <span className="block text-slate-800">Dr. Ahmed</span>
                  <span className="text-[10px] text-slate-500 font-medium font-mono">Dentist Demo</span>
                </button>
                <button
                  onClick={() => handleQuickLogin("smith@smileos.com", "DOCTOR")}
                  className="rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 p-2.5 text-left transition cursor-pointer"
                >
                  <span className="block text-slate-800">Dr. Smith</span>
                  <span className="text-[10px] text-slate-500 font-medium font-mono">Orthodontist</span>
                </button>
                <button
                  onClick={() => handleQuickLogin("admin@smileos.com", "ADMIN")}
                  className="rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 p-2.5 text-left transition cursor-pointer"
                >
                  <span className="block text-slate-800">Clinic Admin</span>
                  <span className="text-[10px] text-slate-500 font-medium font-mono">Admin Demo</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
      
      <Footer />
    </>
  );
}
