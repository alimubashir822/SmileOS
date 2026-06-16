"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, FileHeart, RefreshCw } from "lucide-react";

export default function InsurancePage() {
  const networks = [
    { name: "Delta Dental", level: "Preferred In-Network Provider", coverage: "100% preventive, up to 80% basic, 50% major" },
    { name: "MetLife Dental", level: "In-Network Provider", coverage: "100% preventive, up to 75% basic, 50% major" },
    { name: "Cigna Dental PPO", level: "In-Network Provider", coverage: "90% preventive, up to 80% basic, 50% major" },
    { name: "Blue Cross Blue Shield", level: "Accepting Plans (PPO)", coverage: "Co-pays apply based on employer tiering" }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Insurance & Coverages</h1>
            <p className="mt-4 text-slate-600 text-lg">
              We work with top dental insurance providers to minimize out-of-pocket costs. Upload your card inside the patient portal for real-time validation.
            </p>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            
            {/* Left side: approved list */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-950 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
                <span>Approved Insurance Networks</span>
              </h3>
              
              <div className="space-y-4">
                {networks.map((network, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{network.name}</h4>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">In-Network</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">{network.level}</p>
                    <p className="text-sm text-slate-600 mt-2">{network.coverage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Portal process */}
            <div className="rounded-2xl border border-slate-200 bg-blue-50/20 p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <FileHeart className="h-5.5 w-5.5 text-blue-600" />
                <span>Our Digital Claim Process</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Gone are the days of manual claim forms and endless support calls. SmileOS automates patient-clinic insurance syncing.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Step 1: Upload Card</strong>
                    <span className="text-slate-600 text-xs">Snap a photo of your insurance card and upload it in the Patient Portal.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Step 2: Instant Estimation</strong>
                    <span className="text-slate-600 text-xs">Our platform queries the network directory to calculate exact co-pay percentages.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Step 3: Direct Clinic Billing</strong>
                    <span className="text-slate-600 text-xs">We bill the insurer directly. You only pay your specific out-of-pocket balance.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/login"
                  className="block text-center rounded-xl bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition"
                >
                  Go to Insurance Dashboard
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
