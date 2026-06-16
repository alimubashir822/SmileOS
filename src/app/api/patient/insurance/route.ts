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
    
    if (!sessionUser.patientId) {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }
    
    const patient = await prisma.patient.findUnique({
      where: { id: sessionUser.patientId }
    });
    
    return NextResponse.json({ patient });
  } catch (err) {
    console.error("Fetch insurance error:", err);
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
    
    if (!sessionUser.patientId) {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }
    
    const { provider, memberId } = await request.json();
    
    if (!provider || !memberId) {
      return NextResponse.json({ error: "Missing insurance card fields" }, { status: 400 });
    }
    
    const patient = await prisma.patient.update({
      where: { id: sessionUser.patientId },
      data: {
        insuranceProvider: provider,
        insuranceMemberId: memberId,
        insuranceCoverage: "Active",
        insuranceCardUrl: "/assets/mock-card.jpg"
      }
    });
    
    return NextResponse.json({ success: true, patient });
  } catch (err) {
    console.error("Update insurance error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
