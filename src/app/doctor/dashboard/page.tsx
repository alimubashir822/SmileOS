"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  User, 
  FileText, 
  ActivitySquare, 
  Sparkles, 
  Clock, 
  UserCheck, 
  RefreshCw,
  AlertCircle,
  FileCheck,
  ClipboardCopy,
  BookOpen
} from "lucide-react";
import ToothChart from "@/components/ToothChart";

interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  treatmentName: string;
  status: string;
  notes: string | null;
  visitStatus: string;
  patient: {
    id: string;
    phone: string | null;
    insuranceProvider: string | null;
    user: {
      name: string;
      email: string;
    }
  }
}

interface Patient {
  id: string;
  phone: string | null;
  insuranceProvider: string | null;
  user: {
    name: string;
    email: string;
  };
  treatments: Array<{
    id: string;
    name: string;
    status: string;
    progressPercent: number;
    currentStage: string;
    phases: Array<{
      id: string;
      name: string;
      status: string;
      cost: number;
    }>
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection details
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // AI summary states
  const [aiBrief, setAiBrief] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  // AI Patient Explanation states
  const [aiExplain, setAiExplain] = useState<string>("");
  const [loadingExplain, setLoadingExplain] = useState(false);

  const fetchDoctorData = async () => {
    try {
      const res = await fetch("/api/doctor/dashboard");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        setPatients(data.patients || []);
        
        if (data.patients && data.patients.length > 0) {
          // Keep current selection if valid, otherwise select the first one
          if (selectedPatientId) {
            const exists = data.patients.some((p: Patient) => p.id === selectedPatientId);
            if (!exists) {
              setSelectedPatientId(data.patients[0].id);
              setSelectedPatient(data.patients[0]);
            }
          } else {
            setSelectedPatientId(data.patients[0].id);
            setSelectedPatient(data.patients[0]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load doctor dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      const pat = patients.find(p => p.id === selectedPatientId);
      setSelectedPatient(pat || null);
      setAiBrief("");
      setAiExplain("");
    }
  }, [selectedPatientId, patients]);

  const handleGenerateBrief = async (patientId: string) => {
    setLoadingAi(true);
    setAiBrief("");
    try {
      const res = await fetch("/api/doctor/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId })
      });
      if (res.ok) {
        const data = await res.json();
        setAiBrief(data.brief);
      }
    } catch (err) {
      console.error("AI briefing generation error:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGenerateExplanation = async (patientId: string) => {
    setLoadingExplain(true);
    setAiExplain("");
    try {
      const res = await fetch("/api/doctor/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId })
      });
      if (res.ok) {
        const data = await res.json();
        setAiExplain(data.explanation);
      }
    } catch (err) {
      console.error("AI explanation generation error:", err);
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleUpdateVisitStatus = async (apptId: string, status: string) => {
    try {
      const res = await fetch("/api/patient/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: apptId, visitStatus: status })
      });
      if (res.ok) {
        // Refresh dashboard data
        await fetchDoctorData();
      }
    } catch (err) {
      console.error("Failed to update visit status:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard! Ready to copy to email/patient portal.");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading clinical records...</span>
      </div>
    );
  }

  const activeTreatment = selectedPatient?.treatments.find(t => t.status === "IN_PROGRESS");
  const currentAppt = appointments.find(a => a.patient.id === selectedPatient?.id && a.status !== "CANCELLED");

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Console</h1>
        <p className="text-sm text-slate-500 mt-1">Review scheduled appointments, diagnostic files, and AI practice assistance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Schedule */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-[80vh] flex flex-col">
          <h2 className="text-lg font-bold text-slate-950 flex items-center space-x-1.5 shrink-0">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Clinic Day Agenda</span>
          </h2>

          {/* Roster & Waiting Room Statistics Panel */}
          <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-4 shrink-0 text-center">
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Scheduled</span>
              <strong className="text-sm font-extrabold text-slate-900">{appointments.length}</strong>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl">
              <span className="block text-[9px] font-bold text-blue-500 uppercase tracking-wider">Waiting</span>
              <strong className="text-sm font-extrabold text-blue-700">
                {appointments.filter(a => a.visitStatus === "CHECKED_IN").length}
              </strong>
            </div>
            <div className="bg-purple-50 border border-purple-100 p-2 rounded-xl animate-pulse">
              <span className="block text-[9px] font-bold text-purple-500 uppercase tracking-wider">In Chair</span>
              <strong className="text-sm font-extrabold text-purple-700">
                {appointments.filter(a => a.visitStatus === "WITH_DENTIST").length}
              </strong>
            </div>
            <div className="bg-green-50 border border-green-100 p-2 rounded-xl">
              <span className="block text-[9px] font-bold text-green-500 uppercase tracking-wider">Done</span>
              <strong className="text-sm font-extrabold text-green-700">
                {appointments.filter(a => a.visitStatus === "COMPLETED").length}
              </strong>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {appointments.length > 0 ? (
              appointments.map((appt) => {
                const isSelected = selectedPatientId === appt.patient.id;
                return (
                  <button
                    key={appt.id}
                    onClick={() => setSelectedPatientId(appt.patient.id)}
                    className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex justify-between items-center ${isSelected ? "border-blue-500 bg-blue-50/20" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                        <strong className="block text-slate-900 text-sm">{appt.patient.user.name}</strong>
                        {appt.status === "CANCELLED" && (
                          <span className="bg-red-50 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Cancelled</span>
                        )}
                        {appt.status !== "CANCELLED" && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            appt.visitStatus === "SCHEDULED" ? "bg-slate-50 text-slate-600 border-slate-200" :
                            appt.visitStatus === "CHECKED_IN" ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse" :
                            appt.visitStatus === "WITH_DENTIST" ? "bg-purple-50 text-purple-700 border-purple-200 animate-pulse" :
                            "bg-green-50 text-green-700 border-green-200"
                          }`}>
                            {appt.visitStatus === "SCHEDULED" ? "Scheduled" :
                             appt.visitStatus === "CHECKED_IN" ? "Waiting Room" :
                             appt.visitStatus === "WITH_DENTIST" ? "In Chair" : "Completed"}
                          </span>
                        )}
                      </div>
                      <span className="block text-xs text-slate-500 mt-1">Journey Stage: {appt.treatmentName}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                        {appt.timeSlot}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-slate-400 text-xs py-8 text-center font-semibold">No sessions scheduled.</p>
            )}
          </div>
        </div>

        {/* Right Side: Details & Clinical Tools */}
        <div className="lg:col-span-7 space-y-6">
          
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">{selectedPatient.user.name}</h3>
                      <span className="text-xs text-slate-500 font-semibold">{selectedPatient.user.email} • {selectedPatient.phone}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Active File</span>
                </div>

                {/* Treatment details */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                  <div>
                    <span>Active Treatment</span>
                    <strong className="block text-slate-800 mt-1 text-sm">
                      {activeTreatment ? `🦷 ${activeTreatment.name}` : "None"}
                    </strong>
                  </div>
                  <div>
                    <span>Milestone Phase</span>
                    <strong className="block text-slate-800 mt-1 text-sm">
                      {activeTreatment ? activeTreatment.currentStage : "N/A"} ({activeTreatment ? activeTreatment.progressPercent : 0}%)
                    </strong>
                  </div>
                </div>

                {/* Scans */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span>Uploaded Documents ({selectedPatient.documents.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    {selectedPatient.documents.map((doc) => (
                      <div key={doc.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-700 truncate">{doc.name}</span>
                        <span className="text-[9px] font-bold text-blue-600 uppercase shrink-0">{doc.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Visit Status Manager */}
                {currentAppt && (
                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Live Visit Status Manager</span>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold mt-1 border ${
                        currentAppt.visitStatus === "SCHEDULED" ? "bg-slate-50 text-slate-700 border-slate-200" :
                        currentAppt.visitStatus === "CHECKED_IN" ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse" :
                        currentAppt.visitStatus === "WITH_DENTIST" ? "bg-purple-50 text-purple-700 border-purple-200 animate-pulse" :
                        "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        {currentAppt.visitStatus === "SCHEDULED" ? "Scheduled" :
                         currentAppt.visitStatus === "CHECKED_IN" ? "Checked In / Waiting" :
                         currentAppt.visitStatus === "WITH_DENTIST" ? "With Dentist / In Chair" : "Completed"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {currentAppt.visitStatus === "SCHEDULED" && (
                        <button
                          onClick={() => handleUpdateVisitStatus(currentAppt.id, "CHECKED_IN")}
                          className="rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1.5 text-xs transition cursor-pointer"
                        >
                          Check In Patient
                        </button>
                      )}
                      {currentAppt.visitStatus === "CHECKED_IN" && (
                        <button
                          onClick={() => handleUpdateVisitStatus(currentAppt.id, "WITH_DENTIST")}
                          className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold px-3 py-1.5 text-xs transition cursor-pointer shadow"
                        >
                          Call to Dental Chair
                        </button>
                      )}
                      {currentAppt.visitStatus === "WITH_DENTIST" && (
                        <button
                          onClick={() => handleUpdateVisitStatus(currentAppt.id, "COMPLETED")}
                          className="rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold px-3 py-1.5 text-xs transition cursor-pointer shadow"
                        >
                          Complete Visit
                        </button>
                      )}
                      {currentAppt.visitStatus !== "SCHEDULED" && currentAppt.visitStatus !== "COMPLETED" && (
                        <button
                          onClick={() => handleUpdateVisitStatus(currentAppt.id, "SCHEDULED")}
                          className="rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold px-2 py-1.5 text-xs transition cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Digital Tooth Chart */}
              <ToothChart patientId={selectedPatient.id} patientName={selectedPatient.user.name} />

              {/* Dentist AI Briefing & Explanations Widget */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/20 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-blue-100 pb-4">
                  <h3 className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span>AI Clinical Practice Assistant</span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleGenerateBrief(selectedPatient.id)}
                      disabled={loadingAi || loadingExplain}
                      className="rounded-lg bg-blue-600 text-white font-bold px-3 py-1.5 text-xs hover:bg-blue-700 cursor-pointer transition flex items-center space-x-1 disabled:opacity-50 shrink-0"
                    >
                      {loadingAi ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      <span>Dentist Brief</span>
                    </button>
                    <button
                      onClick={() => handleGenerateExplanation(selectedPatient.id)}
                      disabled={loadingAi || loadingExplain}
                      className="rounded-lg bg-white border border-blue-200 text-blue-700 font-bold px-3 py-1.5 text-xs hover:bg-blue-50 cursor-pointer transition flex items-center space-x-1 disabled:opacity-50 shrink-0"
                    >
                      {loadingExplain ? <RefreshCw className="h-3 w-3 animate-spin" /> : <BookOpen className="h-3 w-3" />}
                      <span>Patient Explanation</span>
                    </button>
                  </div>
                </div>

                {/* Loading state */}
                {(loadingAi || loadingExplain) && (
                  <div className="py-6 text-center text-slate-500 text-xs font-semibold animate-pulse">
                    Retrieving clinical records. Running diagnostic summaries...
                  </div>
                )}

                {/* AI Dentist Brief Display */}
                {aiBrief && (
                  <div className="bg-white border border-blue-200/50 rounded-xl p-5 shadow-sm space-y-4 animate-fadeIn">
                    <div className="prose prose-sm prose-blue max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {aiBrief}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <button 
                        onClick={() => copyToClipboard(aiBrief)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        <ClipboardCopy className="h-3 w-3" />
                        <span>Copy Brief</span>
                      </button>
                      <button 
                        onClick={() => setAiBrief("")}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Patient Explanation Display */}
                {aiExplain && (
                  <div className="bg-white border border-blue-200/50 rounded-xl p-5 shadow-sm space-y-4 animate-fadeIn">
                    <div className="prose prose-sm prose-blue max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {aiExplain}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <button 
                        onClick={() => copyToClipboard(aiExplain)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        <ClipboardCopy className="h-3 w-3" />
                        <span>Copy Care Guide</span>
                      </button>
                      <button 
                        onClick={() => setAiExplain("")}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm">Please select a patient scheduled today to review clinical records.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
