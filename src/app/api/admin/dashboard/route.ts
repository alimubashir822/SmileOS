import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("smileos-session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    const sessionStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const sessionUser = JSON.parse(sessionStr);
    
    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }
    
    // 1. Analytics & Revenue
    const totalPayments = await prisma.invoice.findMany({ where: { status: "PAID" } });
    const totalRevenue = totalPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const allInvoices = await prisma.invoice.findMany({});
    const totalGrossBilled = allInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalGrossPaid = allInvoices.filter(inv => inv.status === "PAID").reduce((sum, inv) => sum + inv.amount, 0);
    
    // 2. Appointment Success Rates
    const totalAppointments = await prisma.appointment.count();
    const cancelledCount = await prisma.appointment.count({ where: { status: "CANCELLED" } });
    const successfulCount = totalAppointments - cancelledCount;
    
    const appointmentSuccessRate = totalAppointments > 0 
      ? Math.round((successfulCount / totalAppointments) * 100) 
      : 100;
    
    const noShowRate = totalAppointments > 0 
      ? Math.round((cancelledCount / totalAppointments) * 100) 
      : 0;

    const activeTreatmentsCount = await prisma.treatment.count({ where: { status: "IN_PROGRESS" } });
    
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    
    // 3. Database sheets
    const patientList = await prisma.patient.findMany({
      include: { 
        user: { select: { name: true, email: true } }, 
        treatments: true 
      }
    });
    
    const doctorList = await prisma.doctor.findMany({
      include: { 
        user: { select: { name: true, email: true } },
        clinic: { select: { name: true } }
      }
    });
    
    // 4. Audit compliance logs
    const auditLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        user: { select: { name: true, role: true } }
      }
    });
    
    return NextResponse.json({
      revenue: totalRevenue,
      grossBilled: totalGrossBilled,
      grossPaid: totalGrossPaid,
      appointmentsCount: totalAppointments,
      successRate: appointmentSuccessRate,
      noShowRate,
      activeTreatments: activeTreatmentsCount,
      patientsCount: patientCount,
      doctorsCount: doctorCount,
      patients: patientList,
      doctors: doctorList,
      auditLogs
    });
  } catch (err) {
    console.error("Admin dashboard API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
