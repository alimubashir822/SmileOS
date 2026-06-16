"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertTriangle,
  UserCheck,
  User2,
  CalendarDays
} from "lucide-react";

interface Doctor {
  id: string;
  userId: string;
  specialty: string;
  availableSlots: string;
  user: {
    name: string;
    email: string;
  };
}

export default function BookPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Booking Form State
  const [treatment, setTreatment] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  // Inline auth state
  const [emailInput, setEmailInput] = useState("sarah@smileos.com");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Booking process state
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch("/api/doctors");
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoadingDocs(false);
      }
    }
    fetchDocs();
  }, []);

  const treatments = [
    { name: "Cleaning", description: "Preventive plaque scaling and enamel polishing." },
    { name: "Implant Placement", description: "Surgical replacement of tooth root and custom crown fitting." },
    { name: "Whitening", description: "Clinical laser teeth bleaching session." },
    { name: "Braces Adjustment", description: "Orthodontic brace alignment or Invisalign checkup." }
  ];

  const handleNextStep = () => {
    if (step === 1 && !treatment) return;
    if (step === 2 && (!selectedDocId || !date || !timeSlot)) return;
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const selectedDoctor = doctors.find(d => d.id === selectedDocId);
  const availableSlotsList = selectedDoctor ? selectedDoctor.availableSlots.split(";") : [];

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    const success = await login(emailInput, "PATIENT");
    setIsLoggingIn(false);
    if (!success) {
      setLoginError("Account not found. Please verify the pre-seeded patient email.");
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) return;
    setIsSubmittingBooking(true);
    setBookingError("");
    
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDocId,
          date,
          timeSlot,
          treatmentName: treatment,
          notes
        })
      });

      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          router.push("/patient/dashboard");
        }, 2500);
      } else {
        const data = await res.json();
        setBookingError(data.error || "Booking failed.");
      }
    } catch (err) {
      setBookingError("Server error. Try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Progress Bar */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className={step >= 1 ? "text-blue-600 font-extrabold" : ""}>1. Treatment</span>
              <span className={step >= 2 ? "text-blue-600 font-extrabold" : ""}>2. Doctor & Time</span>
              <span className={step >= 3 ? "text-blue-600 font-extrabold" : ""}>3. Confirm details</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div className={`h-full bg-blue-600 transition-all duration-300 ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* STEP 1: Select Treatment */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Treatment</h2>
                  <p className="text-slate-500 text-sm mt-1">Select the main dental procedure you require.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {treatments.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTreatment(t.name)}
                      className={`text-left p-5 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${treatment === t.name ? "border-blue-500 bg-blue-50/20 shadow-sm" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                    >
                      <span className="font-bold text-slate-950 text-base">{t.name}</span>
                      <span className="text-xs text-slate-500 mt-2 leading-relaxed">{t.description}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    disabled={!treatment}
                    onClick={handleNextStep}
                    className="inline-flex items-center space-x-1 rounded-xl bg-blue-600 text-white font-semibold px-5 py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <span>Choose Doctor</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Doctor & Timeslot */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Doctor & Timeslot</h2>
                  <p className="text-slate-500 text-sm mt-1">Pick a dental specialist, date, and time slot.</p>
                </div>

                {loadingDocs ? (
                  <div className="py-8 text-center text-slate-400 font-medium">Loading clinical schedules...</div>
                ) : (
                  <div className="space-y-6">
                    {/* Doctor selection */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Available Doctors</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {doctors.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => {
                              setSelectedDocId(doc.id);
                              setTimeSlot(""); // clear slot when doc changes
                            }}
                            className={`text-left p-4 rounded-xl border-2 transition cursor-pointer flex items-center space-x-3.5 ${selectedDocId === doc.id ? "border-blue-500 bg-blue-50/20" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0">
                              <User2 className="h-5 w-5" />
                            </div>
                            <div>
                              <strong className="block text-slate-950 text-sm">{doc.user.name}</strong>
                              <span className="text-xs text-slate-500">{doc.specialty}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date and Time selectors */}
                    {selectedDocId && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        
                        {/* Date */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                            <span>Select Date</span>
                          </label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>

                        {/* Slots */}
                        {date && (
                          <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>Select Timeslot</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {availableSlotsList.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => setTimeSlot(slot)}
                                  className={`rounded-lg border px-3 py-2 text-center text-xs font-bold transition cursor-pointer ${timeSlot === slot ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    disabled={!selectedDocId || !date || !timeSlot}
                    onClick={handleNextStep}
                    className="inline-flex items-center space-x-1 rounded-xl bg-blue-600 text-white font-semibold px-5 py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <span>Review Booking</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm Booking */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Review & Confirm</h2>
                  <p className="text-slate-500 text-sm mt-1">Review your details and finalize the booking.</p>
                </div>

                {/* Summary Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200/80">
                    <span className="text-sm text-slate-500 font-medium">Selected Treatment</span>
                    <span className="text-sm font-bold text-slate-950">🦷 {treatment}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200/80">
                    <span className="text-sm text-slate-500 font-medium">Practitioner Specialist</span>
                    <span className="text-sm font-bold text-slate-950">{selectedDoctor?.user.name} ({selectedDoctor?.specialty})</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200/80">
                    <span className="text-sm text-slate-500 font-medium">Appointment Date</span>
                    <span className="text-sm font-bold text-slate-950">{date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">Appointment Timeslot</span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{timeSlot}</span>
                  </div>
                </div>

                {/* Patient notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Symptoms / Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="E.g. experiencing mild sensitivity, post-surgical review..."
                  />
                </div>

                {/* User Authorization check */}
                {!user ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
                    <div className="flex items-start space-x-2.5">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-800 text-sm block">Authentication Required</strong>
                        <span className="text-amber-700 text-xs leading-relaxed">
                          To finalize this booking in our database, please log in. You can use the pre-configured patient credentials.
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleInlineLogin} className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        placeholder="Patient Email (e.g. sarah@smileos.com)"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="rounded-lg bg-slate-900 text-white text-xs font-bold px-4 py-2 hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer flex items-center justify-center space-x-1 shrink-0"
                      >
                        {isLoggingIn ? <span>Verifying...</span> : <span>Quick Login & Sync</span>}
                      </button>
                    </form>
                    {loginError && <p className="text-red-500 text-[11px] font-bold">{loginError}</p>}
                  </div>
                ) : (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/20 p-4 flex items-center space-x-2.5">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-blue-800 font-semibold">
                      Synced Profile: <strong className="text-slate-950">{user.name}</strong> ({user.email})
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                {bookingSuccess ? (
                  <div className="rounded-xl bg-green-500 text-white font-bold p-4 text-center text-sm shadow animate-pulse">
                    Appointment Saved! Redirecting to Patient Dashboard...
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {bookingError && (
                      <div className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-200 flex items-center space-x-1.5">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{bookingError}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <button
                        onClick={handlePrevStep}
                        className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                      </button>
                      <button
                        onClick={handleConfirmBooking}
                        disabled={!user || isSubmittingBooking}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold px-6 py-3.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow transition cursor-pointer"
                      >
                        {isSubmittingBooking ? <span>Booking...</span> : <span>Confirm Appointment</span>}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Guidelines info */}
          <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
            <p>Need to modify a slot? Reschedules and cancellations are permitted up to 24 hours prior.</p>
            <p>For emergencies or dental trauma, call our immediate medical line directly at (415) 555-0130.</p>
          </div>

        </div>
      </main>
      
      <Footer />
    </>
  );
}
