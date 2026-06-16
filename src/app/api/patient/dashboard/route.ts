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

    if (sessionUser.role !== "PATIENT" || !sessionUser.patientId) {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }

    const patientId = sessionUser.patientId;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Next Appointment
    const nextAppointment = await prisma.appointment.findFirst({
      where: {
        patientId,
        status: { in: ["PENDING", "CONFIRMED"] },
        date: { gte: todayStr }
      },
      include: {
        doctor: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { date: "asc" }
    });

    // 2. Outstanding Balance from Invoices
    const pendingInvoices = await prisma.invoice.findMany({
      where: { patientId, status: { in: ["PENDING", "OVERDUE"] } }
    });
    const outstandingBalance = pendingInvoices.reduce((sum, inv) => sum + inv.patientSplit, 0);

    // 3. Active treatment with phases
    const activeTreatment = await prisma.treatment.findFirst({
      where: { patientId, status: "IN_PROGRESS" },
      include: {
        phases: {
          orderBy: { order: "asc" }
        }
      }
    });

    // 4. Recent documents
    const recentDocuments = await prisma.document.findMany({
      where: { patientId },
      take: 3,
      orderBy: { uploadedAt: "desc" }
    });

    // 5. Chat messages
    const chatMessages = await prisma.message.findMany({
      where: { patientId },
      orderBy: { timestamp: "asc" }
    });

    // 6. Family dependents (Family Accounts)
    const familyMembers = await prisma.patient.findMany({
      where: { parentId: patientId },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    // 7. Health History Intelligence alerts
    const alerts = [];
    
    // Check if cleaning appointment is scheduled
    const cleaningAppt = await prisma.appointment.findFirst({
      where: {
        patientId,
        treatmentName: { contains: "Cleaning" },
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    });
    
    if (!cleaningAppt) {
      alerts.push({
        id: "cleaning_alert",
        type: "WARNING",
        message: "Your biannual clinical teeth cleaning & hygiene assessment is overdue. Click to schedule."
      });
    }

    // Check if there are outstanding invoices overdue
    const hasOverdueInvoices = pendingInvoices.some(inv => inv.status === "OVERDUE");
    if (hasOverdueInvoices) {
      alerts.push({
        id: "billing_alert",
        type: "CRITICAL",
        message: "You have overdue co-pay balances. Please process them inside the Payment Portal."
      });
    }

    return NextResponse.json({
      nextAppointment,
      outstandingBalance,
      activeTreatment,
      recentDocuments,
      chatMessages,
      familyMembers,
      alerts
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
