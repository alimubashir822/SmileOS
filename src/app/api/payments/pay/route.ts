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
    
    const { paymentId } = await request.json();
    
    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }
    
    const payment = await prisma.invoice.update({
      where: { id: paymentId },
      data: { status: "PAID" }
    });
    
    return NextResponse.json({ success: true, payment });
  } catch (err) {
    console.error("Payment API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
