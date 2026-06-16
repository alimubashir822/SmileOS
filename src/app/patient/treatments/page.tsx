"use client";

import { useState, useEffect } from "react";
import { ActivitySquare, CheckCircle, Clock, DollarSign, HelpCircle, AlertCircle, RefreshCw, FileSignature } from "lucide-react";

interface Treatment {
  id: string;
  name: string;
  status: string;
  cost: number;
  paid: number;
  remaining: number;
  progressPercent: number;
  currentStage: string;
  consentSigned: boolean;
  consentSignedAt: string | null;
  phases: Array<{
    id: string;
    name: string;
    status: string;
    cost: number;
    order: number;
  }>;
}

export default function PatientTreatments() {
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Consent Form signature states
  const [signatureName, setSignatureName] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [signingError, setSigningError] = useState<string | null>(null);

  const fetchTreatment = async () => {
    try {
      const res = await fetch("/api/patient/dashboard");
      if (res.ok) {
        const data = await res.json();
        setTreatment(data.activeTreatment);
      }
    } catch (err) {
      console.error("Failed to load treatments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatment();
  }, []);

  const handleSignConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName.trim() || !treatment) return;
    setIsSigning(true);
    setSigningError(null);

    try {
      const res = await fetch("/api/patient/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatmentId: treatment.id,
          signatureName: signatureName.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTreatment(prev => prev ? {
          ...prev,
          consentSigned: true,
          consentSignedAt: data.treatment.consentSignedAt
        } : null);
      } else {
        const errorData = await res.json();
        setSigningError(errorData.error || "Failed to submit digital signature.");
      }
    } catch (err) {
      console.error("E-signature submission failed:", err);
      setSigningError("Network or server connection issue. Please retry.");
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading treatment phases...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Treatment Journey</h1>
        <p className="text-sm text-slate-500 mt-1">Structured medical stages, cost per phase, and clinical consents.</p>
      </div>

      {treatment ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Milestone Phases Timeline (Left) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <ActivitySquare className="h-5 w-5 text-blue-600" />
                <span>Structured Care Plan Phases</span>
              </h2>
              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold uppercase">
                {treatment.status.replace("_", " ")}
              </span>
            </div>

            <div className="space-y-4">
              {treatment.phases && treatment.phases.map((phase, pIdx) => {
                const isCompleted = phase.status === "COMPLETED";
                const isInProgress = phase.status === "IN_PROGRESS";
                
                return (
                  <div 
                    key={phase.id} 
                    className={`rounded-xl border p-5 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isCompleted ? "border-slate-100 bg-slate-50/50" : isInProgress ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white"}`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5 ${isCompleted ? "bg-green-500 text-white" : isInProgress ? "bg-blue-600 text-white animate-pulse" : "bg-slate-200 text-slate-400"}`}>
                        {isCompleted ? "✓" : pIdx + 1}
                      </span>
                      <div>
                        <strong className={`block text-sm sm:text-base ${isCompleted ? "text-slate-900 font-semibold" : isInProgress ? "text-blue-700 font-extrabold" : "text-slate-400 font-medium"}`}>
                          {phase.name}
                        </strong>
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase mt-1 inline-block ${isCompleted ? "bg-green-100 text-green-800" : isInProgress ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"}`}>
                          {phase.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                      <span className="text-xs text-slate-500 font-semibold">Phase Cost:</span>
                      <strong className={`text-sm ${isCompleted ? "text-slate-700" : "text-slate-950 font-bold"}`}>
                        ${phase.cost.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Ledgers & Consent signatures (Right) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Cost Summary Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                <DollarSign className="h-4.5 w-4.5 text-blue-600" />
                <span>Financial Ledger Ledger</span>
              </h3>

              <div className="space-y-3 pt-2 text-sm font-semibold">
                <div className="flex justify-between pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Gross Billed Cost</span>
                  <span className="text-slate-900">${treatment.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-slate-100 text-green-600">
                  <span>Processed Paid Co-Pays</span>
                  <span>-${treatment.paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold">
                  <span className="text-slate-700">Remaining Balance</span>
                  <span className="text-blue-600">${treatment.remaining.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Care Plan Progress</span>
                  <span>{treatment.progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${treatment.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Careplan Consent signature */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                <FileSignature className="h-4.5 w-4.5 text-blue-600" />
                <span>Clinical Consent Sign-Off</span>
              </h3>

              {treatment.consentSigned ? (
                <div className="rounded-xl border border-green-200 bg-green-50/20 p-4 space-y-2 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-xs font-bold text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Consent Signed & Active</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Digitally signed & locked under HIPAA security protocols.
                  </p>
                  <div className="pt-1.5 border-t border-slate-200/50 text-[10px] font-mono text-slate-600 font-semibold space-y-0.5">
                    <div>Signed: {signatureName || "Sarah Connor"}</div>
                    <div>Date: {treatment.consentSignedAt ? new Date(treatment.consentSignedAt).toLocaleString() : new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignConsent} className="space-y-3 animate-fadeIn">
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Please review the treatment stages, costs, and timeline. Type your full name to provide digital consent before clinical procedures begin.
                  </p>
                  
                  <div>
                    <input
                      type="text"
                      required
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      disabled={isSigning}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none transition"
                      placeholder="Type Sarah Connor to sign"
                    />
                  </div>

                  {signingError && (
                    <p className="text-[10px] text-red-600 font-semibold">{signingError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSigning || !signatureName.trim()}
                    className="w-full text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isSigning ? "Signing..." : "Digitally Sign & Approve"}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
          <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm">No active treatments registered for this patient profile.</p>
        </div>
      )}

    </div>
  );
}
