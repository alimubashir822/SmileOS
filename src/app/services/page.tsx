"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Sparkles, Activity, ShieldCheck, Heart, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      title: "Hygiene & Deep Cleaning",
      desc: "Comprehensive cleaning to eliminate tartar, plaque, and surface staining. Includes periodontal checking and professional flossing advice.",
      duration: "45 mins",
      insurance: "100% Covered"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      title: "Dental Implant Reconstruction",
      desc: "Full root-and-crown replacements. We perform secure surgical implant placement using custom-fitted zirconium crowns for premium realism.",
      duration: "2-3 visits",
      insurance: "50% - 80% Covered"
    },
    {
      icon: <Heart className="h-6 w-6 text-blue-600" />,
      title: "Braces & Orthodontic Alignment",
      desc: "Invisalign alignment and classic brackets. Improve chewing functionality, jaw alignments, and smile profiles for children and adults.",
      duration: "12-24 months",
      insurance: "Partial Cover"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      title: "Laser Teeth Whitening",
      desc: "High-intensity clinical laser bleaching that removes internal organic discoloration. Quick, non-invasive, and provides instant results.",
      duration: "60 mins",
      insurance: "Cosmetic (Financing Available)"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Our Clinical Services</h1>
            <p className="mt-4 text-slate-600 text-lg">
              SmileOS delivers next-generation treatments combining biological safety with cutting-edge medical technologies.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="rounded-2xl border border-slate-200 bg-slate-50/30 p-8 shadow-sm hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">{service.desc}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium">
                  <span>Estimated Time: <strong className="text-slate-800">{service.duration}</strong></span>
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{service.insurance}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 rounded-3xl bg-slate-900 p-8 sm:p-12 text-center text-white space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold sm:text-3xl">Not sure which service fits your condition?</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Speak with our interactive AI Dental Assistant. It can explain terms, help analyze symptoms, and identify general treatments.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-slate-950 hover:bg-blue-400 transition"
              >
                <span>Chat with AI Assistant</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
