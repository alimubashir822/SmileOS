import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { logAction } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("smileos-session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    const sessionStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const sessionUser = JSON.parse(sessionStr);
    
    if (!sessionUser.patientId && sessionUser.role !== "DOCTOR" && sessionUser.role !== "RECEPTIONIST" && sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }

    const { appointmentId, visitStatus } = await request.json();
    
    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 });
    }

    const targetStatus = visitStatus || "CHECKED_IN";

    // Update appointment record
    const updatedAppt = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        visitStatus: targetStatus
      }
    });

    // Write to HIPAA Compliance Audit Logs
    const actorDesc = sessionUser.patientId
      ? `Patient ${sessionUser.name} (ID: ${sessionUser.patientId})`
      : `${sessionUser.role} ${sessionUser.name}`;

    await logAction(
      sessionUser.id,
      "CHECK_IN",
      `${actorDesc} updated visit status to "${targetStatus}" for appointment: ${updatedAppt.treatmentName} on ${updatedAppt.date}`
    );

    return NextResponse.json({ success: true, appointment: updatedAppt });
  } catch (err) {
    console.error("Check-in API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
