"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Contact Our Clinic</h1>
            <p className="mt-4 text-slate-600 text-lg">
              Have a question, emergency, or need support? Drop us a message, call, or visit our San Francisco clinic directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            
            {/* Left side: details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-slate-50/50 space-y-6">
                <h3 className="text-xl font-bold text-slate-950">SmileOS Clinic SF</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-sm text-slate-600">
                    <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>100 Health Science Blvd, Suite A, San Francisco, CA 94107</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <Phone className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>(415) 555-0130</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <Mail className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>care@smileos.com</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-slate-50/50 space-y-4">
                <h3 className="text-lg font-bold text-slate-950 flex items-center space-x-1.5">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Clinic Hours</span>
                </h3>
                <div className="space-y-2 text-sm text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-slate-900 font-semibold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-slate-900 font-semibold">9:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Sunday</span>
                    <span>Closed (Emergency Only)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Contact Form */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-950">Send an Inquiry</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition"
                      placeholder="Sarah Connor"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition"
                      placeholder="sarah@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition"
                    placeholder="General Inquiry or Treatment Question"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Message</label>
                  <textarea 
                    rows={4} 
                    required 
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Describe your symptoms, questions, or help requests..."
                  />
                </div>

                <div>
                  {submitted ? (
                    <div className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-green-500 text-white font-bold py-3 text-sm transition">
                      <Check className="h-5 w-5" />
                      <span>Message Submitted Successfully!</span>
                    </div>
                  ) : (
                    <button 
                      type="submit" 
                      className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-blue-600 text-white font-bold py-3 text-sm hover:bg-blue-700 transition cursor-pointer"
                    >
                      <Send className="h-4.5 w-4.5" />
                      <span>Send Message</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
