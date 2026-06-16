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
    
    const invoices = await prisma.invoice.findMany({
      where: { patientId: sessionUser.patientId },
    });
    
    const payments = invoices.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      date: inv.dueDate,
      description: inv.description,
      status: inv.status
    }));
    
    return NextResponse.json({ payments });
  } catch (err) {
    console.error("Fetch payments error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
