"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Activity, DollarSign, Clock } from "lucide-react";

export default function TreatmentsPage() {
  const treatments = [
    {
      name: "Dental Implant Journey",
      stages: ["Consultation & Planning", "Diagnostic X-Rays/Scans", "Implant Placement Surgery", "Crown Fabrication & Fitting"],
      costRange: "$1,800 - $3,500",
      insuranceCoverage: "Up to 80% covered",
      bestFor: "Replacing missing teeth, securing bridges, and structural jaw health."
    },
    {
      name: "Orthodontic Realignment",
      stages: ["Digital Alignment Scans", "Custom Bracket/Tray Fabrications", "Bimonthly Adjustments", "Retainer Modeling & Fitting"],
      costRange: "$3,000 - $5,500",
      insuranceCoverage: "Up to 50% covered",
      bestFor: "Correcting severe crowding, spacing, deep bites, and facial symmetry."
    },
    {
      name: "Deep Cleaning & Care",
      stages: ["Calculus Examination", "Ultrasonic Scaling & Plaque Scraping", "Root Planing", "Fluoride Polish Treatment"],
      costRange: "$150 - $350",
      insuranceCoverage: "100% Covered by preventive plans",
      bestFor: "Preventing gum regression, tooth decay, and bad breath."
    },
    {
      name: "Cosmetic Veneers Styling",
      stages: ["Smile Mapping & Enamel prep", "Temporary Veneers wear", "Porcelain bonding & polishing"],
      costRange: "$800 - $1,500 per unit",
      insuranceCoverage: "Generally cosmetic co-pay",
      bestFor: "Correcting chipped enamel, minor gaps, and persistent yellowing."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Interactive Treatment Catalog</h1>
            <p className="mt-4 text-slate-600 text-lg">
              Track your treatment milestones transparently. Unlike regular clinics, SmileOS outlines every medical step and co-pay cost structure upfront.
            </p>
          </div>

          {/* List */}
          <div className="space-y-12">
            {treatments.map((treatment, tIndex) => (
              <div 
                key={tIndex}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-blue-500 transition grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left Side: General */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-950">{treatment.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{treatment.bestFor}</p>
                  
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 pt-2 text-xs sm:text-sm font-medium">
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <DollarSign className="h-4.5 w-4.5 text-blue-600" />
                      <span>Avg Cost: <strong className="text-slate-900">{treatment.costRange}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Clock className="h-4.5 w-4.5 text-blue-600" />
                      <span>{treatment.insuranceCoverage}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Stages list */}
                <div className="lg:col-span-7 bg-slate-50/50 rounded-xl p-6 border border-slate-100 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600">Standard Milestones</h4>
                  
                  <div className="flex flex-col space-y-3">
                    {treatment.stages.map((stage, sIndex) => (
                      <div key={sIndex} className="flex items-start space-x-3 text-sm">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 shrink-0 font-bold text-xs">
                          {sIndex + 1}
                        </div>
                        <span className="text-slate-700 font-medium">{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="text-center mt-16 pt-8 border-t border-slate-200/60">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow hover:bg-blue-700 transition"
            >
              <span>Schedule Booking Now</span>
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
