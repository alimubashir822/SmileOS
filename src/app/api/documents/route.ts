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
    
    const documents = await prisma.document.findMany({
      where: { patientId: sessionUser.patientId },
      orderBy: { uploadedAt: "desc" }
    });
    
    return NextResponse.json({ documents });
  } catch (err) {
    console.error("Fetch documents error:", err);
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
    
    const { name, type } = await request.json();
    
    if (!name || !type) {
      return NextResponse.json({ error: "Missing required document details" }, { status: 400 });
    }
    
    const document = await prisma.document.create({
      data: {
        patientId: sessionUser.patientId,
        name,
        type,
        fileUrl: type === "X_RAY" ? "/assets/mock-xray.jpg" : "/assets/prescription.pdf",
      }
    });
    
    return NextResponse.json({ document });
  } catch (err) {
    console.error("Create document error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
