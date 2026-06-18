"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, X, Activity, User, LogOut, ChevronRight } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "PATIENT") return "/patient/dashboard";
    if (["DENTIST", "ASSISTANT", "RECEPTIONIST"].includes(user.role)) return "/doctor/dashboard";
    return "/admin/dashboard";
  };

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Treatments", href: "/treatments" },
    { name: "Doctors", href: "/doctors" },
    { name: "Insurance", href: "/insurance" },
    { name: "Financing", href: "/financing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Smile<span className="text-blue-600">OS</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                <User className="h-4 w-4" />
                <span>Portal ({user.name.split(" ")[0]})</span>
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center space-x-1 text-sm font-medium text-slate-500 hover:text-red-500 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link
                href="/book"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow transition"
              >
                Book Appointment
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-200 pt-3 flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-base font-semibold text-slate-900"
                >
                  <span className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>My Dashboard Portal</span>
                  </span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-base font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center rounded-lg border border-slate-200 px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/book"
                  onClick={() => setIsOpen(false)}
                  className="block text-center rounded-lg bg-blue-600 px-3 py-2 text-base font-semibold text-white hover:bg-blue-700"
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
