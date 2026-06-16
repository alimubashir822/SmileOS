import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("smileos-session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ appointments: [] }, { status: 401 });
    }
    
    const sessionStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const sessionUser = JSON.parse(sessionStr);
    
    if (sessionUser.role === "PATIENT" && sessionUser.patientId) {
      const appointments = await prisma.appointment.findMany({
        where: { patientId: sessionUser.patientId },
        include: {
          doctor: {
            include: { user: true }
          }
        },
        orderBy: { date: "asc" }
      });
      return NextResponse.json({ appointments });
    }
    
    if (sessionUser.role === "DOCTOR" && sessionUser.doctorId) {
      const appointments = await prisma.appointment.findMany({
        where: { doctorId: sessionUser.doctorId },
        include: {
          patient: {
            include: { user: true }
          }
        },
        orderBy: { date: "asc" }
      });
      return NextResponse.json({ appointments });
    }
    
    if (sessionUser.role === "ADMIN") {
      const appointments = await prisma.appointment.findMany({
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } }
        },
        orderBy: { date: "asc" }
      });
      return NextResponse.json({ appointments });
    }
    
    return NextResponse.json({ appointments: [] });
  } catch (err) {
    console.error("Fetch appointments error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("smileos-session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    const sessionStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const sessionUser = JSON.parse(sessionStr);
    
    if (sessionUser.role !== "PATIENT" || !sessionUser.patientId) {
      return NextResponse.json({ error: "Only patients can book appointments" }, { status: 403 });
    }
    
    const { doctorId, date, timeSlot, treatmentName, notes } = await request.json();
    
    if (!doctorId || !date || !timeSlot || !treatmentName) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }
    
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        timeSlot,
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    });
    
    if (existing) {
      return NextResponse.json({ error: "The selected dentist is already booked for this timeslot. Please select another slot." }, { status: 409 });
    }
    
    const appointment = await prisma.appointment.create({
      data: {
        patientId: sessionUser.patientId,
        doctorId,
        date,
        timeSlot,
        treatmentName,
        status: "CONFIRMED",
        notes
      }
    });
    
    return NextResponse.json({ appointment });
  } catch (err) {
    console.error("Create appointment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
