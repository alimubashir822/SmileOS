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
    
    if (sessionUser.role !== "DOCTOR" || !sessionUser.doctorId) {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }
    
    const doctorId = sessionUser.doctorId;
    
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { date: "asc" }
    });
    
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { appointments: { some: { doctorId } } },
          { treatments: { some: { status: "IN_PROGRESS" } } }
        ]
      },
      include: {
        user: { select: { name: true, email: true } },
        treatments: true,
        documents: true,
        appointments: { where: { doctorId } }
      }
    });
    
    return NextResponse.json({ appointments, patients });
  } catch (err) {
    console.error("Doctor dashboard API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
