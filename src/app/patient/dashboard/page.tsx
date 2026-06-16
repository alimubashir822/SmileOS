"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Calendar, 
  ActivitySquare, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Send, 
  X, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Users,
  Compass,
  BellRing
} from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  treatmentName: string;
  status: string;
  notes: string | null;
  doctor: {
    user: {
      name: string;
    }
  }
}

interface PatientDocument {
  id: string;
  name: string;
  fileUrl: string;
  type: string;
  tag?: string | null;
  uploadedAt: string;
}

interface Treatment {
  id: string;
  name: string;
  progressPercent: number;
  currentStage: string;
  cost: number;
  paid: number;
  remaining: number;
}

interface ChatMessage {
  id?: string;
  sender: "PATIENT" | "AI";
  text: string;
}

interface Dependent {
  id: string;
  user: {
    name: string;
    email: string;
  }
}

interface Alert {
  id: string;
  type: string;
  message: string;
}

export default function PatientDashboard() {
  const { user } = useAuth();
  
  // Dashboard states
  const [loading, setLoading] = useState(true);
  const [nextAppt, setNextAppt] = useState<Appointment | null>(null);
  const [balance, setBalance] = useState(0);
  const [activeTreatment, setActiveTreatment] = useState<Treatment | null>(null);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // Active viewing profile state (Sarah or Leo)
  const [activeProfileName, setActiveProfileName] = useState("");

  // AI Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulation states
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/patient/dashboard");
      if (res.ok) {
        const data = await res.json();
        setNextAppt(data.nextAppointment);
        setBalance(data.outstandingBalance);
        setActiveTreatment(data.activeTreatment);
        setDocuments(data.recentDocuments);
        setMessages(data.chatMessages || []);
        setDependents(data.familyMembers || []);
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (user) {
      setActiveProfileName(user.name);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCancelAppointment = async (apptId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(apptId);
    try {
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: apptId })
      });
      if (res.ok) {
        alert("Appointment successfully cancelled.");
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Cancellation error:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayBalance = async () => {
    setPaying(true);
    try {
      const paymentRes = await fetch("/api/patient/payments");
      if (paymentRes.ok) {
        const pData = await paymentRes.json();
        const pendingPayment = pData.payments.find((p: any) => p.status === "PENDING");
        
        if (pendingPayment) {
          const res = await fetch("/api/payments/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: pendingPayment.id })
          });
          if (res.ok) {
            setPaymentSuccess(true);
            setTimeout(() => {
              setPaymentSuccess(false);
              fetchDashboardData();
            }, 2000);
          }
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setPaying(false);
    }
  };

  const handleSendChat = async (textToSend: string) => {
    if (!textToSend.trim() || isAiResponding) return;
    
    const newPatientMsg: ChatMessage = { sender: "PATIENT", text: textToSend };
    setMessages(prev => [...prev, newPatientMsg]);
    setChatInput("");
    setIsAiResponding(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.aiMsg]);
      } else {
        setMessages(prev => [...prev, {
          sender: "AI",
          text: "I experienced a minor latency connection issue. Please verify your internet or try asking again!"
        }]);
      }
    } catch (err) {
      console.error("Chat send error:", err);
    } finally {
      setIsAiResponding(false);
    }
  };

  const quickQuestions = [
    "Implant care after surgery?",
    "Laser whitening sensitivity?",
    "Braces adjustment pain?",
    "Insurance coverage details?"
  ];

  // Dental Journey steps
  const journeySteps = [
    { name: "Consultation", status: "COMPLETED" },
    { name: "X-Ray Scans", status: "COMPLETED" },
    { name: "Treatment", status: "IN_PROGRESS" },
    { name: "Recovery", status: "UPCOMING" },
    { name: "Maintenance", status: "UPCOMING" }
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading your SmileOS portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SmileOS Patient Console</h1>
          <p className="text-sm text-slate-500 mt-1">
            Viewing records of: <strong className="text-blue-600">{activeProfileName}</strong>
          </p>
        </div>
        
        {/* Family Account switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Family Profiles:</span>
          </span>
          <button
            onClick={() => setActiveProfileName(user?.name || "")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${activeProfileName === user?.name ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-100 text-slate-700 bg-white"}`}
          >
            Sarah (Self)
          </button>
          {dependents.map((dep) => (
            <button
              key={dep.id}
              onClick={() => setActiveProfileName(dep.user.name)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${activeProfileName === dep.user.name ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-100 text-slate-700 bg-white"}`}
            >
              {dep.user.name.split(" ")[0]} (Child)
            </button>
          ))}
        </div>
      </div>

      {/* Health History Intelligence Alerts */}
      {activeProfileName === user?.name && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`rounded-xl border p-4 flex items-start space-x-3 text-xs sm:text-sm shadow-sm ${alert.type === "CRITICAL" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}
            >
              <BellRing className={`h-5 w-5 shrink-0 mt-0.5 ${alert.type === "CRITICAL" ? "text-red-600" : "text-amber-600"}`} />
              <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="font-semibold">{alert.message}</span>
                {alert.id === "cleaning_alert" && (
                  <Link
                    href="/book"
                    className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shrink-0"
                  >
                    Schedule Cleaning
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dental Journey Map */}
      {activeProfileName === user?.name && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <Compass className="h-4.5 w-4.5 text-blue-600" />
            <span>Your Active Smile Journey Map</span>
          </h3>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-2">
            {journeySteps.map((step, idx) => {
              const isCompleted = step.status === "COMPLETED";
              const isInProgress = step.status === "IN_PROGRESS";
              
              return (
                <div key={idx} className="flex-1 w-full flex flex-col items-center relative text-center">
                  {/* Connector Line */}
                  {idx < journeySteps.length - 1 && (
                    <div className="hidden sm:block absolute top-4 left-[60%] right-0 h-0.5 bg-slate-100 -z-10" />
                  )}
                  
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isCompleted ? "border-green-500 bg-green-50 text-green-700 font-bold" : isInProgress ? "border-blue-600 bg-blue-50 text-blue-700 font-extrabold animate-pulse" : "border-slate-200 bg-white text-slate-400"}`}>
                    {isCompleted ? "✓" : idx + 1}
                  </span>
                  
                  <span className={`block text-xs mt-2 font-bold ${isCompleted ? "text-slate-800" : isInProgress ? "text-blue-700 font-extrabold" : "text-slate-400"}`}>
                    {step.name}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Roster & Details panel splits */}
      {activeProfileName === user?.name ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Medical Indicators */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Next Appointment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Next Scheduled Session</span>
              </h3>
              
              {nextAppt ? (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-100 rounded-xl p-4 gap-4">
                  <div>
                    <strong className="block text-slate-950 text-base">🦷 {nextAppt.treatmentName}</strong>
                    <span className="block text-xs text-slate-500 mt-1">
                      Doctor: <strong className="text-slate-700">{nextAppt.doctor.user.name}</strong>
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 font-semibold">
                      Date & Time: {nextAppt.date} • {nextAppt.timeSlot}
                    </span>
                    {nextAppt.notes && (
                      <p className="text-slate-600 text-xs mt-2 italic">Notes: {nextAppt.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center shrink-0">
                    <button 
                      disabled={cancellingId === nextAppt.id}
                      onClick={() => handleCancelAppointment(nextAppt.id)}
                      className="rounded-lg border border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 text-slate-500 font-semibold px-3 py-2 text-xs transition cursor-pointer"
                    >
                      {cancellingId === nextAppt.id ? "Cancelling..." : "Cancel Appointment"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                  No upcoming appointments scheduled.
                  <Link href="/book" className="text-blue-600 font-bold ml-1 hover:underline">Schedule consultation</Link>
                </div>
              )}
            </div>

            {/* Split row: Treatment and Billing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Treatment progress summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                    <ActivitySquare className="h-4 w-4 text-blue-600" />
                    <span>Active Treatment Stages</span>
                  </h3>
                  
                  {activeTreatment ? (
                    <div className="mt-4 space-y-3">
                      <div>
                        <strong className="block text-slate-900 text-sm">{activeTreatment.name}</strong>
                        <span className="text-xs text-slate-500 font-semibold">Active Phase: {activeTreatment.currentStage}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                          <span>Surgical Completion</span>
                          <span>{activeTreatment.progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${activeTreatment.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-slate-500 text-xs font-semibold">No active treatments registered.</p>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    href="/patient/treatments" 
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>Inspect Phases & Checklists</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Balance Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span>Billed Co-Pay Balance</span>
                  </h3>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-3xl font-extrabold text-slate-900">${balance.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 font-semibold">Primary insurance claim split completed.</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {balance > 0 ? (
                    paymentSuccess ? (
                      <div className="text-center rounded-lg bg-green-500 text-white font-bold py-2 text-xs">
                        Paid!
                      </div>
                    ) : (
                      <button 
                        onClick={handlePayBalance}
                        disabled={paying}
                        className="w-full text-center rounded-lg bg-slate-900 text-white font-semibold py-2 text-xs hover:bg-slate-800 transition cursor-pointer"
                      >
                        {paying ? "Paying..." : "Pay Balance ($450.00)"}
                      </button>
                    )
                  ) : (
                    <div className="flex items-center space-x-1 text-green-600 text-xs font-semibold">
                      <CheckCircle className="h-4 w-4" />
                      <span>Ledger fully paid.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Document lockers summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Recent Scan Uploads</span>
              </h3>
              
              <div className="mt-4 space-y-3">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                        <div>
                          <strong className="block text-slate-950 text-xs">{doc.name}</strong>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">{doc.type} • Tag: {doc.tag || "general"}</span>
                        </div>
                      </div>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert(`Downloading file: ${doc.name}`); }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        Download
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs py-2 font-semibold">No records uploaded.</p>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 text-right">
                <Link href="/patient/documents" className="text-xs font-bold text-blue-600 hover:underline">
                  Inspect File Vault &rarr;
                </Link>
              </div>
            </div>

          </div>

          {/* Right Side: AI Assistant */}
          <div className="lg:col-span-5 flex flex-col h-[70vh] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SmileOS Assistant</h3>
                  <span className="block text-[10px] text-blue-400 font-semibold">SaaS Dental Care Assistant</span>
                </div>
              </div>
              <MessageSquare className="h-4.5 w-4.5 text-slate-400" />
            </div>

            {/* Chat message listings */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === "PATIENT" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === "PATIENT" ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm shadow-slate-100"}`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isAiResponding && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-2.5 text-slate-400 text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-slate-100">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                    <span>Analyzing clinical guides...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Help Question Chips */}
            <div className="p-3 border-t border-slate-100 bg-white shrink-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical Guides & Recovery</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendChat(q)}
                    disabled={isAiResponding}
                    className="rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-2.5 py-1 text-[10px] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat entry box */}
            <div className="p-3 border-t border-slate-200 bg-white shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChat(chatInput);
                  }}
                  disabled={isAiResponding}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                  placeholder="Ask about implants care, cleaning schedules, aligners..."
                />
                <button
                  onClick={() => handleSendChat(chatInput)}
                  disabled={!chatInput.trim() || isAiResponding}
                  className="rounded-lg bg-blue-600 text-white p-2 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Dependent Child Profile mock view (e.g. Leo Connor) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Dependent Clinical Record: {activeProfileName}</h2>
            
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500">Patient Type</span>
                <span className="text-slate-950 font-bold">Child (Dependent Account)</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500">Linked Parent Account</span>
                <span className="text-slate-950 font-bold">Sarah Connor</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500">Next Scheduled Session</span>
                <span className="text-slate-500 italic">None Scheduled</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-sm text-slate-900">Active Care Guidelines</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Leo is currently scheduled for routine adolescent pediatric checkups. Keep track of sugar intake and ensure brushing at least twice daily. Overdue cleanings can be booked directly below.
              </p>
            </div>
            
            <div className="pt-4">
              <Link
                href="/book"
                className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 text-white font-bold px-5 py-3 hover:bg-blue-700 transition"
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>Book Appointment for {activeProfileName.split(" ")[0]}</span>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Health History Intelligence</h3>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 font-semibold space-y-2">
              <p>⚠️ Leo's standard annual pediatric dental cleaning checkup is overdue by 35 days.</p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
