"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CreditCard, HeartHandshake, CheckCircle2, ChevronRight } from "lucide-react";

export default function FinancingPage() {
  const plans = [
    {
      title: "Interest-Free Installments",
      desc: "Split your co-pay balance into 3, 6, or 12 monthly payments with 0% APR. Managed securely via our payment gateway.",
      example: "Implant Co-pay ($450) split into $75/mo over 6 months."
    },
    {
      title: "CareCredit & Dental Lending",
      desc: "We accept CareCredit medical cards, allowing flexible 24-month cycles for major orthopedics or reconstruction surgeries.",
      example: "Apply in 2 minutes inside the clinic or online."
    },
    {
      title: "SmileOS Membership Club",
      desc: "No insurance? Join our membership. For $29/month, get 2 free cleanings, annual X-rays, and 20% off all dental surgeries.",
      example: "Best for self-employed individuals and families."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Financing & Payment Plans</h1>
            <p className="mt-4 text-slate-600 text-lg">
              Premium healthcare should be accessible. SmileOS offers flexible, transparent payment installments and in-house memberships.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 mb-6 text-blue-600">
                    {index === 0 ? <CreditCard className="h-6 w-6" /> : index === 1 ? <HeartHandshake className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">{plan.title}</h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">{plan.desc}</p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500 font-semibold bg-slate-50 p-3 rounded-lg">
                  <span className="text-slate-400 block uppercase font-bold text-[10px] tracking-wide mb-1">Example Breakdown</span>
                  <span className="text-slate-700">{plan.example}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="mt-16 text-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition"
            >
              <span>Consult with a Financing Advisor</span>
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
