"use client";

import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "DOCTOR")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-400 font-medium">
        Loading dentist portal session...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 flex-col md:flex-row">
      <DashboardNav />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
