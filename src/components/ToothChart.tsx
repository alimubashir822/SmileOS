"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle, AlertTriangle, Activity, Save, RefreshCw } from "lucide-react";

interface ToothRecord {
  number: number;
  name: string;
  status: "HEALTHY" | "DECAY" | "IN_PROGRESS" | "RESTORED";
  notes: string;
}

interface ToothChartProps {
  patientId: string;
  patientName: string;
}

// Default tooth name map based on Universal Numbering System
const TOOTH_NAMES: Record<number, string> = {
  1: "Upper Right Third Molar (Wisdom)",
  2: "Upper Right Second Molar",
  3: "Upper Right First Molar",
  4: "Upper Right Second Premolar (Bicuspid)",
  5: "Upper Right First Premolar (Bicuspid)",
  6: "Upper Right Canine (Cuspid)",
  7: "Upper Right Lateral Incisor",
  8: "Upper Right Central Incisor",
  9: "Upper Left Central Incisor",
  10: "Upper Left Lateral Incisor",
  11: "Upper Left Canine (Cuspid)",
  12: "Upper Left First Premolar (Bicuspid)",
  13: "Upper Left Second Premolar (Bicuspid)",
  14: "Upper Left First Molar",
  15: "Upper Left Second Molar",
  16: "Upper Left Third Molar (Wisdom)",
  17: "Lower Left Third Molar (Wisdom)",
  18: "Lower Left Second Molar",
  19: "Lower Left First Molar",
  20: "Lower Left Second Premolar (Bicuspid)",
  21: "Lower Left First Premolar (Bicuspid)",
  22: "Lower Left Canine (Cuspid)",
  23: "Lower Left Lateral Incisor",
  24: "Lower Left Central Incisor",
  25: "Lower Right Central Incisor",
  26: "Lower Right Lateral Incisor",
  27: "Lower Right Canine (Cuspid)",
  28: "Lower Right First Premolar (Bicuspid)",
  29: "Lower Right Second Premolar (Bicuspid)",
  30: "Lower Right First Molar",
  31: "Lower Right Second Molar",
  32: "Lower Right Third Molar (Wisdom)"
};

export default function ToothChart({ patientId, patientName }: ToothChartProps) {
  // Store clinical tooth notes per patient in a dictionary state
  const [patientToothRecords, setPatientToothRecords] = useState<Record<string, Record<number, ToothRecord>>>({});
  const [selectedTooth, setSelectedTooth] = useState<number>(3); // Default to tooth 3
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState<"HEALTHY" | "DECAY" | "IN_PROGRESS" | "RESTORED">("HEALTHY");

  // Get current patient's records
  const currentRecords = patientToothRecords[patientId] || {};

  // Setup default records for a patient if none exist
  useEffect(() => {
    if (!patientId) return;

    if (!patientToothRecords[patientId]) {
      const defaults: Record<number, ToothRecord> = {};
      
      // Initialize teeth 1 to 32 as healthy/empty
      for (let i = 1; i <= 32; i++) {
        defaults[i] = {
          number: i,
          name: TOOTH_NAMES[i],
          status: "HEALTHY",
          notes: "Healthy structure. No active interventions required."
        };
      }

      // Add patient-specific mock profiles to feel extremely premium
      if (patientName.includes("Sarah")) {
        defaults[3] = {
          number: 3,
          name: TOOTH_NAMES[3],
          status: "IN_PROGRESS",
          notes: "Phase 3: Zirconium dental implant placement surgery in progress. Implant fixture integrated, gum healing monitored."
        };
        defaults[14] = {
          number: 14,
          name: TOOTH_NAMES[14],
          status: "RESTORED",
          notes: "Mesio-occlusal composite restoration completed in September 2025. Margins intact, no secondary decay."
        };
        defaults[19] = {
          number: 19,
          name: TOOTH_NAMES[19],
          status: "DECAY",
          notes: "Incipient occlusal decay detected. Recommend conservative restoration or sealant check."
        };
      } else if (patientName.includes("Leo")) {
        defaults[8] = {
          number: 8,
          name: TOOTH_NAMES[8],
          status: "RESTORED",
          notes: "Deciduous incisor exfoliated naturally. Permanent central incisor erupting, sealant proposed."
        };
        defaults[18] = {
          number: 18,
          name: TOOTH_NAMES[18],
          status: "DECAY",
          notes: "Deep developmental pits on occlusal surface. High risk for caries. Sealant application scheduled."
        };
      }

      setPatientToothRecords(prev => ({
        ...prev,
        [patientId]: defaults
      }));
    }
  }, [patientId, patientName, patientToothRecords]);

  // Sync edit form when selected tooth or patient changes
  useEffect(() => {
    if (patientId && patientToothRecords[patientId] && patientToothRecords[patientId][selectedTooth]) {
      const record = patientToothRecords[patientId][selectedTooth];
      setEditingNotes(record.notes);
      setEditingStatus(record.status);
    }
  }, [selectedTooth, patientId, patientToothRecords]);

  const handleSaveTooth = () => {
    if (!patientId) return;
    
    setPatientToothRecords(prev => {
      const patientData = prev[patientId] || {};
      const updatedTooth = {
        ...patientData[selectedTooth],
        status: editingStatus,
        notes: editingNotes
      };
      
      return {
        ...prev,
        [patientId]: {
          ...patientData,
          [selectedTooth]: updatedTooth
        }
      };
    });

    alert(`Tooth ${selectedTooth} clinical record updated successfully!`);
  };

  const getStatusColor = (status: "HEALTHY" | "DECAY" | "IN_PROGRESS" | "RESTORED") => {
    switch (status) {
      case "HEALTHY":
        return "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700";
      case "DECAY":
        return "bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-800";
      case "IN_PROGRESS":
        return "bg-blue-100 hover:bg-blue-200 border-blue-500 text-blue-800 animate-pulse";
      case "RESTORED":
        return "bg-green-100 hover:bg-green-200 border-green-400 text-green-800";
    }
  };

  const getStatusDotColor = (status: "HEALTHY" | "DECAY" | "IN_PROGRESS" | "RESTORED") => {
    switch (status) {
      case "HEALTHY": return "bg-slate-400";
      case "DECAY": return "bg-amber-500";
      case "IN_PROGRESS": return "bg-blue-500";
      case "RESTORED": return "bg-green-500";
    }
  };

  // Helper to split teeth into rows for visual representation
  const upperArch = Array.from({ length: 16 }, (_, i) => i + 1); // 1-16
  const lowerArch = Array.from({ length: 16 }, (_, i) => 32 - i); // 32-17 (drawn right-to-left for mouth symmetry)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Interactive Digital Tooth Chart</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Select a tooth to review diagnostic notes, update clinical status, or save findings.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Healthy</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Caries / Decay</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Active Tx</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Restored</span>
        </div>
      </div>

      {/* Visual Tooth Diagram */}
      <div className="space-y-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        
        {/* Upper Arch */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Upper Maxillary Arch</div>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {upperArch.map((num) => {
              const record = currentRecords[num];
              const status = record?.status || "HEALTHY";
              const isSelected = selectedTooth === num;
              return (
                <button
                  key={num}
                  onClick={() => setSelectedTooth(num)}
                  className={`h-9 w-9 rounded-lg border-2 text-xs font-bold transition flex flex-col items-center justify-center relative cursor-pointer ${getStatusColor(status)} ${isSelected ? "ring-2 ring-blue-600 ring-offset-1 border-blue-600" : ""}`}
                  title={`${num}: ${TOOTH_NAMES[num]}`}
                >
                  <span>{num}</span>
                  <span className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${getStatusDotColor(status)}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Lower Arch */}
        <div className="space-y-2 pt-2 border-t border-slate-200/50">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Lower Mandibular Arch</div>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {lowerArch.map((num) => {
              const record = currentRecords[num];
              const status = record?.status || "HEALTHY";
              const isSelected = selectedTooth === num;
              return (
                <button
                  key={num}
                  onClick={() => setSelectedTooth(num)}
                  className={`h-9 w-9 rounded-lg border-2 text-xs font-bold transition flex flex-col items-center justify-center relative cursor-pointer ${getStatusColor(status)} ${isSelected ? "ring-2 ring-blue-600 ring-offset-1 border-blue-600" : ""}`}
                  title={`${num}: ${TOOTH_NAMES[num]}`}
                >
                  <span>{num}</span>
                  <span className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${getStatusDotColor(status)}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Tooth Detail Panel */}
      {currentRecords[selectedTooth] && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          
          {/* Details & Status Selector */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Clinical Region</div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">Tooth #{selectedTooth}</h4>
              <p className="text-xs text-slate-600 mt-1 font-semibold">{TOOTH_NAMES[selectedTooth]}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Status</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "HEALTHY", label: "Healthy / Sound", color: "border-slate-200" },
                  { key: "DECAY", label: "Caries / Decay", color: "border-amber-200" },
                  { key: "IN_PROGRESS", label: "Active Treatment", color: "border-blue-200" },
                  { key: "RESTORED", label: "Restored", color: "border-green-200" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setEditingStatus(item.key as any)}
                    className={`text-left p-2 border rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-between ${editingStatus === item.key ? "border-blue-600 bg-blue-50 text-blue-700" : "bg-white hover:bg-slate-50 text-slate-700"}`}
                  >
                    <span>{item.label}</span>
                    <span className={`h-2 w-2 rounded-full ${getStatusDotColor(item.key as any)}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Treatment Notes & Actions */}
          <div className="md:col-span-7 space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Diagnosis & History</label>
            <textarea
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50 focus:bg-white transition resize-none font-medium text-slate-700"
              placeholder="Enter clinical findings, decay notes, or restoration logs..."
            />
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveTooth}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow hover:shadow-md transition cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Dental Record</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
