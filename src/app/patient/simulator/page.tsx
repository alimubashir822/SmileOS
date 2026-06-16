"use client";

import { useState } from "react";
import { Sparkles, Upload, Calendar, RefreshCw, Info, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function SmileSimulator() {
  const [activeTreatment, setActiveTreatment] = useState<"whitening" | "veneers" | "aligners">("whitening");
  const [sliderValue, setSliderValue] = useState(50);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const treatments = {
    whitening: {
      name: "Laser Teeth Whitening",
      desc: "Removes deep enamel discoloration caused by foods, coffee, and age. Brightens up to 6 shades.",
      beforeDesc: "Severe yellow stains and uneven enamel shades.",
      afterDesc: "Perfect, natural brilliant white enamel finish.",
      cost: "$350.00",
      time: "60 mins"
    },
    veneers: {
      name: "Zirconium Ceramic Veneers",
      desc: "Ultra-thin custom shells placed over teeth to correct fractures, gaps, and minor misalignments.",
      beforeDesc: "Minor chips, visible spacing, and asymmetrical edges.",
      afterDesc: "Perfect symmetry, smooth contours, and uniform brilliance.",
      cost: "$950.00 / unit",
      time: "2 sessions"
    },
    aligners: {
      name: "Invisalign Clear Aligners",
      desc: "Clear, removable orthodontic aligners that gradually shift teeth into perfect alignment over time.",
      beforeDesc: "Overlapping incisors, crowded lower arch, and spacing gaps.",
      afterDesc: "Perfect dental arch alignment, closed spacing, and ideal bite.",
      cost: "$3,800.00",
      time: "6-12 months"
    }
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setUploadedFile(URL.createObjectURL(e.target.files![0]));
        setIsUploading(false);
      }, 1200);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Smile Transformation Simulator</h1>
        <p className="text-sm text-slate-500 mt-1">Visualize cosmetic adjustments, aligners, and whitening in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Simulator Controls & Info (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Treatment Selectors */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-blue-600" />
              <span>Select Treatment Mode</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {Object.entries(treatments).map(([key, data]) => {
                const isActive = activeTreatment === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTreatment(key as any)}
                    className={`text-left rounded-xl p-3.5 border font-semibold transition cursor-pointer flex justify-between items-center ${isActive ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm" : "border-slate-200 hover:bg-slate-50 text-slate-600 bg-white"}`}
                  >
                    <div>
                      <span className="block text-sm font-bold">{data.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Est. cost: {data.cost}</span>
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-semibold leading-relaxed">
              <p className="text-slate-600">{treatments[activeTreatment].desc}</p>
            </div>
          </div>

          {/* Simulated Photo Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Upload className="h-4.5 w-4.5 text-blue-600" />
              <span>Simulate Your Own Photo</span>
            </h3>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="text-xs font-bold">Processing Smile Visuals...</span>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20">
                    Selfie Loaded
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold">Click or drag to replace photo.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Drag your portrait here</p>
                  <p className="text-[10px] text-slate-400 font-semibold">JPG, PNG up to 5MB. Face must be front-facing.</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <button
                onClick={() => setUploadedFile(null)}
                className="w-full text-center text-xs font-bold text-red-500 hover:text-red-600 transition cursor-pointer"
              >
                Reset to Default Smile model
              </button>
            )}
          </div>

        </div>

        {/* Right Side: Visual Simulator Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 flex flex-col items-center justify-center">
            
            {/* Compare Smile Box */}
            <div className="w-full max-w-[480px] h-[320px] rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden select-none">
              
              {/* BEFORE Smile Layer */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                {/* SVG Mouth Mock BEFORE */}
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 transition duration-500">
                  {/* Lip Outline */}
                  <svg viewBox="0 0 400 200" className="w-full max-w-[320px] h-auto fill-none stroke-red-400 stroke-[8] stroke-linecap-round">
                    <path d="M50 100 Q200 160 350 100" />
                    {/* Teeth Group Before */}
                    <g className="stroke-none">
                      {/* Whitening Before: Yellow-stained */}
                      {activeTreatment === "whitening" && (
                        <path d="M100 102 h200 v15 Q200 150 100 102 Z" fill="#fef08a" opacity="0.95" />
                      )}
                      
                      {/* Veneers Before: Chipped and uneven */}
                      {activeTreatment === "veneers" && (
                        <g fill="#f1f5f9" opacity="0.9">
                          <rect x="120" y="102" width="25" height="20" rx="2" fill="#e2e8f0" />
                          <rect x="147" y="102" width="30" height="24" rx="2" /> {/* central incisor */}
                          <rect x="180" y="102" width="22" height="20" rx="2" className="skew-y-2 fill-slate-300" /> {/* chipped lateral */}
                          <rect x="204" y="102" width="30" height="25" rx="2" className="rotate-2" />
                          <rect x="236" y="102" width="25" height="20" rx="2" />
                        </g>
                      )}

                      {/* Aligners Before: Crooked and spacing */}
                      {activeTreatment === "aligners" && (
                        <g fill="#fef08a" opacity="0.9">
                          <rect x="120" y="102" width="25" height="20" rx="2" className="-rotate-3 fill-amber-100" />
                          <rect x="148" y="102" width="28" height="24" rx="2" className="rotate-3 fill-amber-100" />
                          <rect x="182" y="102" width="24" height="20" rx="2" className="-skew-x-3 rotate-6 fill-amber-100" />
                          <rect x="212" y="102" width="28" height="24" rx="2" className="-rotate-6 fill-amber-200" />
                          <rect x="244" y="102" width="25" height="20" rx="2" className="rotate-6 fill-amber-100" />
                        </g>
                      )}
                    </g>
                  </svg>
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase bg-slate-950/40 px-2 py-0.5 rounded">
                    Before: {treatments[activeTreatment].beforeDesc}
                  </span>
                </div>
              </div>

              {/* AFTER Smile Layer (Clipped based on slider value) */}
              <div 
                className="absolute inset-0 flex items-center justify-center p-8 bg-slate-900 pointer-events-none"
                style={{
                  clipPath: `polygon(${sliderValue}% 0, 100% 0, 100% 100%, ${sliderValue}% 100%)`
                }}
              >
                {/* SVG Mouth Mock AFTER */}
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <svg viewBox="0 0 400 200" className="w-full max-w-[320px] h-auto fill-none stroke-red-500 stroke-[8] stroke-linecap-round">
                    <path d="M50 100 Q200 160 350 100" />
                    {/* Teeth Group After */}
                    <g className="stroke-none">
                      {/* Whitening After: Bright White */}
                      {activeTreatment === "whitening" && (
                        <path d="M100 102 h200 v18 Q200 155 100 102 Z" fill="#ffffff" />
                      )}
                      
                      {/* Veneers After: Perfectly aligned zirconium */}
                      {activeTreatment === "veneers" && (
                        <g fill="#f8fafc">
                          <rect x="120" y="102" width="26" height="22" rx="2" />
                          <rect x="148" y="102" width="30" height="26" rx="2" />
                          <rect x="180" y="102" width="30" height="26" rx="2" />
                          <rect x="212" y="102" width="30" height="26" rx="2" />
                          <rect x="244" y="102" width="26" height="22" rx="2" />
                        </g>
                      )}

                      {/* Aligners After: Perfectly aligned, straight */}
                      {activeTreatment === "aligners" && (
                        <g fill="#ffffff">
                          <rect x="120" y="102" width="26" height="21" rx="2" />
                          <rect x="148" y="102" width="30" height="25" rx="2" />
                          <rect x="180" y="102" width="30" height="25" rx="2" />
                          <rect x="212" y="102" width="30" height="25" rx="2" />
                          <rect x="244" y="102" width="26" height="21" rx="2" />
                        </g>
                      )}
                    </g>
                  </svg>
                  <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
                    After: {treatments[activeTreatment].afterDesc}
                  </span>
                </div>
              </div>

              {/* Slider Overlay bar */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] pointer-events-none"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-blue-600 border-2 border-white shadow flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  ⇄
                </div>
              </div>

            </div>

            {/* Slider Control */}
            <div className="w-full max-w-[480px] space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Before ({100 - sliderValue}%)</span>
                <span>After ({sliderValue}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
              />
            </div>

            {/* Simulated selfie overlay message */}
            {uploadedFile && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/20 p-4 w-full text-center">
                <p className="text-xs text-blue-800 font-semibold leading-relaxed">
                  📸 Overlaying dynamic smile vectors onto your uploaded selfie image... Adjust the slider to test changes.
                </p>
              </div>
            )}

            {/* Legal Notice */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-4 flex items-start gap-2.5 w-full">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10.5px] text-amber-800 leading-relaxed font-semibold">
                <strong>Disclaimer:</strong> This projection is powered by digital SmileOS simulation filters for visual preview and illustrative purposes only. Actual treatment results may vary based on clinical diagnostics, tooth structures, and expert adjustments by our orthodontists.
              </p>
            </div>

            {/* Action buttons */}
            <div className="w-full pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Starting from</span>
                <strong className="text-xl font-black text-slate-900">{treatments[activeTreatment].cost}</strong>
              </div>
              
              <Link
                href="/book"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>Book {treatments[activeTreatment].name}</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
