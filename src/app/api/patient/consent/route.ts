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
    
    if (!sessionUser.patientId) {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }

    const { treatmentId, signatureName } = await request.json();
    
    if (!treatmentId || !signatureName) {
      return NextResponse.json({ error: "Missing treatmentId or signatureName" }, { status: 400 });
    }

    // Update treatment record
    const updatedTreatment = await prisma.treatment.update({
      where: { id: treatmentId },
      data: {
        consentSigned: true,
        consentSignedAt: new Date()
      }
    });

    // Write to HIPAA Compliance Audit Logs
    await logAction(
      sessionUser.id,
      "SIGN_CONSENT",
      `Patient ${sessionUser.name} (ID: ${sessionUser.patientId}) digitally signed consent form for treatment: ${updatedTreatment.name}. Signed as: "${signatureName}"`
    );

    return NextResponse.json({ success: true, treatment: updatedTreatment });
  } catch (err) {
    console.error("Consent signature API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
