"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Percent,
  Clock
} from "lucide-react";

interface PatientRecord {
  id: string;
  phone: string | null;
  insuranceProvider: string | null;
  user: {
    name: string;
    email: string;
  };
  treatments: Array<{
    name: string;
    status: string;
  }>;
}

interface DoctorRecord {
  id: string;
  specialty: string;
  user: {
    name: string;
    email: string;
  };
  clinic: {
    name: string;
  };
}

interface AuditRecord {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
  }
}

interface AdminData {
  revenue: number;
  grossBilled: number;
  grossPaid: number;
  appointmentsCount: number;
  successRate: number;
  noShowRate: number;
  activeTreatments: number;
  patientsCount: number;
  doctorsCount: number;
  patients: PatientRecord[];
  doctors: DoctorRecord[];
  auditLogs: AuditRecord[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (err) {
      console.error("Failed to fetch admin console data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-400 font-medium space-x-2">
        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
        <span>Loading clinic admin console...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
        <p className="text-sm text-slate-500 mt-1">Operational summaries, billing splits, success ratios, and HIPAA compliance logs.</p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Monthly Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <strong className="block text-2xl font-bold text-slate-900 mt-0.5">${data.revenue.toFixed(2)}</strong>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Total co-pay collections</span>
          </div>
        </div>

        {/* Metric 2: Billed vs Paid Split */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Billed vs Paid</span>
            <strong className="block text-2xl font-bold text-slate-900 mt-0.5">
              {data.grossBilled > 0 ? Math.round((data.grossPaid / data.grossBilled) * 100) : 100}%
            </strong>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
              Paid: ${data.grossPaid} / Billed: ${data.grossBilled}
            </span>
          </div>
        </div>

        {/* Metric 3: Appointment Success Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Success Ratio</span>
            <strong className="block text-2xl font-bold text-slate-900 mt-0.5">{data.successRate}%</strong>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">No-show/Cancel: {data.noShowRate}%</span>
          </div>
        </div>

        {/* Metric 4: Patients Enrolled */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">SaaS Active Users</span>
            <strong className="block text-2xl font-bold text-slate-900 mt-0.5">{data.patientsCount}</strong>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Clinician specialists: {data.doctorsCount}</span>
          </div>
        </div>

      </div>

      {/* Directory lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Synced Patients Directory */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-950 flex items-center space-x-1.5">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <span>Clinic Patients Directory</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-2">Patient Details</th>
                  <th className="pb-3 pr-2">Contact & Insurance</th>
                  <th className="pb-3">Active Treatment Care</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {data.patients.map((p) => {
                  const activeTreatment = p.treatments.find(t => t.status === "IN_PROGRESS");
                  return (
                    <tr key={p.id}>
                      <td className="py-3.5 pr-2">
                        <strong className="block text-slate-950 text-sm">{p.user.name}</strong>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{p.id}</span>
                      </td>
                      <td className="py-3.5 pr-2">
                        <span className="block text-slate-800 font-semibold">{p.phone}</span>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1 font-semibold">{p.insuranceProvider || "Self-Pay"}</span>
                      </td>
                      <td className="py-3.5 text-slate-800">
                        {activeTreatment ? (
                          <span className="font-semibold text-slate-900">🦷 {activeTreatment.name}</span>
                        ) : (
                          <span className="text-slate-400">No active journey</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Registered Clinicians Directory */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-950 flex items-center space-x-1.5">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span>Clinic Specialists Roster</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-2">Practitioner Specialty</th>
                  <th className="pb-3">Clinic Branch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {data.doctors.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3.5 pr-2">
                      <strong className="block text-slate-950 text-sm">{d.user.name}</strong>
                      <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mt-0.5">{d.specialty}</span>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-600">
                      {d.clinic?.name || "SmileOS SF Branch"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Compliance Audit Logs Section (Enterprise Audit Logs) */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center space-x-1.5">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <span>HIPAA Compliance Audit Ledger</span>
          </h2>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900 uppercase">
            Strict Encryption Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-2">Operator name</th>
                <th className="pb-3 pr-2">Action type</th>
                <th className="pb-3 pr-2">Activity Description details</th>
                <th className="pb-3">Timestamp logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
              {data.auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3 pr-2">
                    <strong className="block text-white text-xs">{log.user.name}</strong>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{log.user.role}</span>
                  </td>
                  <td className="py-3 pr-2">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-slate-400 font-semibold">{log.details}</td>
                  <td className="py-3 text-slate-500 font-semibold flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
