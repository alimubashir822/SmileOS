import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("smileos-session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    const { appointmentId } = await request.json();
    
    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 });
    }
    
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" }
    });
    
    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
