import Link from "next/link";
import { Activity, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Smile<span className="text-blue-400">OS</span>
              </span>
            </Link>
            <p className="text-sm">
              From appointment to recovery — an AI-powered dental care journey platform for modern clinics.
            </p>
          </div>

          {/* Site Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Patient Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Services Info</Link>
              </li>
              <li>
                <Link href="/treatments" className="hover:text-white transition-colors">Treatments</Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">Our Doctors</Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors">Book Appointment</Link>
              </li>
            </ul>
          </div>

          {/* Pricing & Support */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Financing & Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/insurance" className="hover:text-white transition-colors">Insurance Providers</Link>
              </li>
              <li>
                <Link href="/financing" className="hover:text-white transition-colors">Financing Plans</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Help & Contact</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <h3 className="text-white font-semibold text-sm mb-4">Our Clinic</h3>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <span>100 Health Science Blvd, Suite A, San Francisco, CA 94107</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-blue-400 shrink-0" />
              <span>(415) 555-0130</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-400 shrink-0" />
              <span>care@smileos.com</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-center flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>&copy; {currentYear} SmileOS Inc. All rights reserved. Registered Dental Group.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">HIPAA Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
