"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Trash2, CalendarPlus, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  treatmentName: string;
  status: string;
  notes: string | null;
  doctor: {
    specialty: string;
    user: {
      name: string;
    }
  }
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (apptId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(apptId);
    try {
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: apptId })
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error("Cancellation error:", err);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading appointments...</span>
      </div>
    );
  }

  const upcomingAppts = appointments.filter(a => a.status !== "CANCELLED");
  const cancelledAppts = appointments.filter(a => a.status === "CANCELLED");

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Manage scheduled sessions and clinical procedures.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/book"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Schedule New Slot</span>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Active Appointments */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Active & Upcoming Sessions</h2>
          
          {upcomingAppts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppts.map((appt) => (
                <div key={appt.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <strong className="block text-slate-900 text-base">🦷 {appt.treatmentName}</strong>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/10">
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Dentist: <strong className="text-slate-700">{appt.doctor.user.name}</strong> ({appt.doctor.specialty})
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold pt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>{appt.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span>{appt.timeSlot}</span>
                      </span>
                    </div>
                    {appt.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic mt-2">
                        Notes: {appt.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100 mt-2">
                    <button
                      disabled={cancellingId === appt.id}
                      onClick={() => handleCancel(appt.id)}
                      className="inline-flex items-center space-x-1 text-slate-500 hover:text-red-600 text-xs font-bold transition cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{cancellingId === appt.id ? "Cancelling..." : "Cancel Appointment"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm">
              No upcoming appointments found.
              <Link href="/book" className="text-blue-600 font-bold ml-1 hover:underline">Book a session now</Link>
            </div>
          )}
        </div>

        {/* Cancelled Sessions */}
        {cancelledAppts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-500">Cancelled Sessions History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cancelledAppts.map((appt) => (
                <div key={appt.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex justify-between items-center opacity-70">
                  <div>
                    <strong className="block text-slate-700 text-sm line-through">🦷 {appt.treatmentName}</strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{appt.doctor.user.name} • {appt.date} {appt.timeSlot}</span>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    <XCircle className="h-3 w-3 mr-1" />
                    <span>Cancelled</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
