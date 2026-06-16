"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { User2, Calendar, Star, Award } from "lucide-react";

export default function DoctorsPage() {
  const doctors = [
    {
      name: "Dr. Ahmed",
      specialty: "Implantologist & Aesthetic Surgeon",
      bio: "Specialist in dental implants, oral reconstruction, and aesthetic veneers with over 12 years of experience. Graduate of Boston University Dental Medicine.",
      rating: "4.9 (240+ reviews)",
      availability: ["10:00 AM", "1:30 PM", "3:00 PM", "4:30 PM"],
      experience: "12 Years"
    },
    {
      name: "Dr. Smith",
      specialty: "Orthodontist & Orthopedics Specialist",
      bio: "Expert in brackets, Invisalign alignment, and children's dentistry. Focused on modern, pain-free adjustments. Certified Invisalign Diamond Provider.",
      rating: "4.8 (190+ reviews)",
      availability: ["09:00 AM", "11:00 AM", "1:30 PM", "4:00 PM"],
      experience: "8 Years"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Meet Our Specialists</h1>
            <p className="mt-4 text-slate-600 text-lg">
              Our clinical experts are board-certified practitioners specializing in modern, minimally invasive dental medicine.
            </p>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {doctors.map((doctor, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/20 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-blue-500 transition"
              >
                <div>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <User2 className="h-9 w-9" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-950">{doctor.name}</h3>
                      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mt-0.5">{doctor.specialty}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">{doctor.bio}</p>

                  <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-slate-800">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="text-slate-800">{doctor.experience} Exp</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/60 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Next Available Slots:</span>
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {doctor.availability.map((slot, sIdx) => (
                      <span 
                        key={sIdx}
                        className="bg-white border border-slate-200 text-slate-800 font-semibold px-2.5 py-1 rounded-lg text-xs"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/book"
                      className="block text-center rounded-xl bg-blue-600 text-white font-semibold py-2.5 text-sm hover:bg-blue-700 transition"
                    >
                      Book Session with {doctor.name.split(" ")[1]}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
