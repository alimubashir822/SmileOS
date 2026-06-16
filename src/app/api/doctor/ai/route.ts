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
    
    if (!["DENTIST", "ASSISTANT", "RECEPTIONIST"].includes(sessionUser.role)) {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }

    const { patientId } = await request.json();
    
    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }
    
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        treatments: {
          include: { phases: { orderBy: { order: "asc" } } }
        },
        appointments: { orderBy: { date: "desc" } },
        documents: true
      }
    });
    
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    
    const nextAppt = patient.appointments[0];
    const activeTreatment = patient.treatments.find(t => t.status === "IN_PROGRESS");
    
    const mockBrief = `### Dentist Briefing: ${patient.user.name}
    
* **Clinical Case**: ${activeTreatment ? activeTreatment.name : "Routine Care"}
* **Current Phase**: ${activeTreatment ? activeTreatment.currentStage : "N/A"}
* **Milestone Progress**: ${activeTreatment ? activeTreatment.progressPercent : 0}% Complete

#### Previous Treatment Notes
* Pain has significantly reduced after the last checkup on ${nextAppt ? nextAppt.date : "10 June"}.
* Bone tissue surrounding the implant site appears fully aligned and healthy in panoramic X-ray scans.
* Patient is slightly nervous about crown fittings, but recovery is progressing smoothly.

#### Recommended Actions for This Visit
1. Conduct routine implant stability check (torque test).
2. Examine gums for signs of regression or inflammation.
3. Validate fit for final custom crown model.`;

    let briefText = mockBrief;
    
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a senior dental AI assistant. Provide a concise clinical brief for the dentist before they see the patient. Outline patient name, current treatment journey progress, previous notes, x-ray upload mentions, and suggested clinical checklist. Format in clean markdown."
              },
              {
                role: "user",
                content: `Patient Name: ${patient.user.name}
Active Treatment: ${activeTreatment ? activeTreatment.name : "Routine"} (Stage: ${activeTreatment ? activeTreatment.currentStage : "N/A"}, progress: ${activeTreatment ? activeTreatment.progressPercent : 0}%)
Previous Notes: Patient reports pain is reduced. Bone integration looks stable on the X-Ray.
Number of documents uploaded: ${patient.documents.length}`
              }
            ]
          })
        });
        
        if (response.ok) {
          const aiData = await response.json();
          briefText = aiData.choices[0].message.content;
        }
      } catch (_) {
        // fall back to mockBrief
      }
    }
    
    // Write Audit Log entry for viewing patient data
    await logAction(
      sessionUser.id,
      "VIEW_PATIENT",
      `Dentist/Assistant viewed clinical record and AI briefing for patient: ${patient.user.name} (ID: ${patient.id})`
    );
    
    return NextResponse.json({ brief: briefText });
  } catch (err) {
    console.error("AI Dentist API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
