"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Plus, CheckCircle, RefreshCw, Upload, FileHeart } from "lucide-react";

interface Patient {
  id: string;
  insuranceProvider: string | null;
  insuranceMemberId: string | null;
  insuranceCoverage: string | null;
  insuranceCardUrl: string | null;
}

export default function PatientInsurance() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showEdit, setShowEdit] = useState(false);
  const [provider, setProvider] = useState("");
  const [memberId, setMemberId] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchInsurance = async () => {
    try {
      const res = await fetch("/api/patient/insurance");
      if (res.ok) {
        const data = await res.json();
        setPatient(data.patient);
        if (data.patient) {
          setProvider(data.patient.insuranceProvider || "");
          setMemberId(data.patient.insuranceMemberId || "");
        }
      }
    } catch (err) {
      console.error("Failed to load insurance details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurance();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !memberId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/patient/insurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, memberId })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setShowEdit(false);
          fetchInsurance();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to update insurance:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading insurance settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Insurance Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage approved providers and dental coverages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Policy Status (Left) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="h-5.5 w-5.5 text-blue-600" />
              <span>Coverage Ledger</span>
            </h2>

            {patient && patient.insuranceProvider ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Insurer Provider</span>
                    <span className="block font-bold text-slate-800 mt-1">{patient.insuranceProvider}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Coverage Status</span>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20 mt-1">
                      {patient.insuranceCoverage}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="block text-xs font-bold text-slate-400 uppercase">Member ID</span>
                    <span className="block font-bold text-slate-800 mt-1 font-mono">{patient.insuranceMemberId}</span>
                  </div>
                  <div className="pt-2">
                    <span className="block text-xs font-bold text-slate-400 uppercase">Direct Billing</span>
                    <span className="block text-slate-800 font-semibold mt-1">Active (HIPAA Synced)</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowEdit(!showEdit)}
                    className="rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-3 py-2 text-xs cursor-pointer"
                  >
                    Update Card Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl space-y-4">
                <p className="text-slate-500 text-xs font-semibold">No active insurance card synced to profile.</p>
                <button
                  onClick={() => setShowEdit(true)}
                  className="inline-flex items-center space-x-1 rounded-lg bg-blue-600 text-white font-semibold px-4 py-2 text-xs hover:bg-blue-700 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sync Insurance Card</span>
                </button>
              </div>
            )}
          </div>

          {/* Sync form */}
          {showEdit && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Upload & Sync Insurance Card</span>
              </h3>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      required
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none transition"
                      placeholder="Delta Dental, Cigna, MetLife"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Member ID</label>
                    <input
                      type="text"
                      required
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none transition font-mono"
                      placeholder="DD-88492-X"
                    />
                  </div>
                </div>

                {success ? (
                  <div className="flex items-center justify-center space-x-1.5 rounded-lg bg-green-500 text-white font-bold py-2 text-xs">
                    <CheckCircle className="h-4 w-4" />
                    <span>Insurance Card Synced!</span>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEdit(false)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-blue-600 text-white font-semibold px-4 py-2 text-xs hover:bg-blue-700 transition cursor-pointer"
                    >
                      {saving ? "Syncing..." : "Sync Card"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Claim estimations (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <FileHeart className="h-4.5 w-4.5 text-blue-600" />
              <span>Standard Claims Estimates</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600 font-medium pt-2">
              <div className="flex justify-between pb-2.5 border-b border-slate-100">
                <span>Preventive Scans & Cleanings</span>
                <span className="text-blue-600 font-bold">100% covered</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-slate-100">
                <span>Fillings & Basic Extractions</span>
                <span className="text-blue-600 font-bold">80% covered</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-slate-100">
                <span>Dental Implants Surgery</span>
                <span className="text-blue-600 font-bold">50% - 80% covered</span>
              </div>
              <div className="flex justify-between">
                <span>Brackets & Orthodontics</span>
                <span className="text-slate-500">Partial Co-pay</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
