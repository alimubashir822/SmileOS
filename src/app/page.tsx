"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadChatbot from "@/components/LeadChatbot";
import Link from "next/link";
import { useState } from "react";
import { 
  Activity, 
  Calendar, 
  Sparkles, 
  Heart, 
  ChevronRight, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  MessageSquare
} from "lucide-react";

export default function Home() {
  const [activeGallery, setActiveGallery] = useState<"implant" | "whitening" | "veneers">("implant");

  const galleries = {
    implant: {
      title: "Full Arch Dental Implant Journey",
      desc: "Sarah's dental implant reconstruction - returning complete smile functionality and natural aesthetics.",
      before: "Missing premolar & bone regression",
      after: "Custom titanium implant & ceramic crown",
      progress: "100% Complete",
      duration: "3 months"
    },
    whitening: {
      title: "Laser Teeth Whitening",
      desc: "Deep stain extraction and whitening session. Over 6 shades brighter under 60 minutes.",
      before: "Enamel stains and coffee discoloration",
      after: "Natural brilliant white enamel restoration",
      progress: "Completed",
      duration: "1 hour"
    },
    veneers: {
      title: "Porcelain Veneers Styling",
      desc: "Placement of premium custom porcelain veneers to correct spacing and minor chips.",
      before: "Diastema (gap) & minor corner fractures",
      after: "8 porcelain veneers - perfectly symmetric smile",
      progress: "Completed",
      duration: "2 visits"
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-28">
        {/* Abstract background gradient */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full max-w-7xl translate-x-1/4 rounded-full bg-blue-50/70 blur-3xl" />
        <div className="absolute top-1/2 left-0 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-sky-50/80 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
            
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center space-x-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
                <Sparkles className="h-4 w-4" />
                <span>Next-Gen Dental OS Platform</span>
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Modern Dental Care <br />
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  Powered by AI & Tech
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Experience a complete digital journey. SmileOS connects patients and dental clinics seamlessly with interactive treatment plans, 3D/digital X-ray vaults, automatic post-op AI guides, and instant bookings.
              </p>
              
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                <Link
                  href="/book"
                  className="flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 transition hover:shadow-lg"
                >
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="mt-3 sm:mt-0 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                >
                  Access Portal
                </Link>
              </div>
            </div>

            {/* Visual Dashboard Card Mockup */}
            <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-slate-200 bg-slate-900/5 p-4 ring-1 ring-inset ring-slate-900/10 shadow-2xl backdrop-blur">
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                  {/* Dashboard header mockup */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Patient Dashboard</p>
                      <h3 className="text-xl font-bold text-slate-900">Welcome back, Sarah 👋</h3>
                    </div>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active Journey
                    </span>
                  </div>

                  {/* Appt Card mockup */}
                  <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-medium text-slate-500">Next Scheduled Visit</p>
                    <div className="mt-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">🦷 Implant Placement Surgery</h4>
                        <p className="text-xs text-slate-600 mt-1">Dr. Ahmed • Clinic SF</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Tomorrow</p>
                        <p className="text-xs text-slate-600 mt-1">3:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress mockup */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-500">Treatment Plan: Implant Journey</span>
                      <span className="text-slate-900 font-bold">60% Complete</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[60%] bg-blue-600 rounded-full transition-all duration-500" />
                    </div>
                  </div>

                  {/* Outstanding & AI Prompt */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                    <div>
                      <p className="text-xs text-slate-500">Pending Co-Pay Balance</p>
                      <p className="text-lg font-bold text-slate-900">$450.00</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="inline-flex items-center space-x-1 text-xs text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition cursor-pointer">
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-20 sm:py-28 border-t border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Elevating Clinical Workflows & Patient Recovery
            </h2>
            <p className="mt-4 text-slate-600">
              SmileOS is a dental operating system designed to automate clinic administration and increase patient retention.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Feature 1: Intelligent Calendar */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Intelligent Scheduling</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Book in seconds. Filter by procedure and choose your doctor. View real-time slots, configure rescheduling, and track no-show analytics.
              </p>
            </div>

            {/* Feature 2: Visual Journey */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Structured Treatment Phases</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Define care stages with transparent billing splits. Track clinical checklists, pre-op, and post-op completion metrics.
              </p>
            </div>

            {/* Feature 3: Records portal */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Secure Records Vault</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Upload and inspect panoramic X-rays, clinical reports, prescriptions, and lab reports. Secure, HIPAA-compliant document storage with tags.
              </p>
            </div>

            {/* Feature 4: AI Dental Assistant */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">AI Care Assistant</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Ask questions about your treatment or recovery. Get instant clinical explanations on procedures, terms, and billing questions without diagnosing.
              </p>
            </div>

            {/* Feature 5: Automation */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Follow-Up Automation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Receive proactive post-op recovery check-ins automatically on Day 1 (post-surgical check), Day 7 (recovery assessment), and Day 30.
              </p>
            </div>

            {/* Feature 6: Finance & Insurance */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Payment Installments</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Split out-of-pocket co-pay fees into interest-free monthly installment plans (0% APR) securely integrated with invoice ledgers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Before and After Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="font-bold text-blue-600 tracking-wider text-xs uppercase">Proof in Results</span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Before & After Gallery</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Inspect real patient transformations. Select a procedure to review pre-operative issues compared against post-operative results and durations.
              </p>

              {/* Slider Toggles */}
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => setActiveGallery("implant")}
                  className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${activeGallery === "implant" ? "border-blue-500 bg-blue-50/50 text-slate-900 font-semibold" : "border-slate-100 hover:bg-slate-50 text-slate-600"}`}
                >
                  🦷 Dental Implant Restoration
                </button>
                <button 
                  onClick={() => setActiveGallery("whitening")}
                  className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${activeGallery === "whitening" ? "border-blue-500 bg-blue-50/50 text-slate-900 font-semibold" : "border-slate-100 hover:bg-slate-50 text-slate-600"}`}
                >
                  ✨ Laser Teeth Whitening
                </button>
                <button 
                  onClick={() => setActiveGallery("veneers")}
                  className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${activeGallery === "veneers" ? "border-blue-500 bg-blue-50/50 text-slate-900 font-semibold" : "border-slate-100 hover:bg-slate-50 text-slate-600"}`}
                >
                  💎 Porcelain Veneers Styling
                </button>
              </div>
            </div>

            {/* Display Slide */}
            <div className="mt-12 lg:mt-0 lg:col-span-7 bg-slate-900/5 rounded-2xl p-6 border border-slate-200/80">
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{galleries[activeGallery].title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{galleries[activeGallery].desc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Mock Image Card */}
                  <div className="rounded-lg bg-amber-50/80 border border-amber-200/40 p-4 text-center">
                    <p className="text-xs font-semibold uppercase text-amber-700 tracking-wider">Before Treatment</p>
                    <div className="h-32 mt-3 flex items-center justify-center bg-white border border-dashed border-amber-300 rounded text-xs text-amber-800 font-medium px-4">
                      {galleries[activeGallery].before}
                    </div>
                  </div>
                  {/* After Mock Image Card */}
                  <div className="rounded-lg bg-blue-50/80 border border-blue-200/40 p-4 text-center">
                    <p className="text-xs font-semibold uppercase text-blue-700 tracking-wider">After Treatment</p>
                    <div className="h-32 mt-3 flex items-center justify-center bg-white border border-dashed border-blue-300 rounded text-xs text-blue-800 font-bold px-4">
                      {galleries[activeGallery].after}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-4 text-slate-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>Status: <strong className="text-slate-900">{galleries[activeGallery].progress}</strong></span>
                  </div>
                  <div>
                    <span>Treatment Time: <strong className="text-slate-900">{galleries[activeGallery].duration}</strong></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Roster & Doctor CTA */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Streamline Your Care Journey?</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Consultations are fully covered under Delta Dental or major insurance networks. Book a 15-minute diagnostic scan with our doctors.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/book"
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-slate-950 hover:bg-blue-400 transition"
            >
              Book Now
            </Link>
            <Link
              href="/doctors"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition"
            >
              Meet our Specialists
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <LeadChatbot />
    </>
  );
}
