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
    
    if (!["DENTIST", "DOCTOR", "ASSISTANT", "RECEPTIONIST"].includes(sessionUser.role)) {
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
          include: { phases: true }
        }
      }
    });
    
    if (!patient) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }
    
    const activeTreatment = patient.treatments.find(t => t.status === "IN_PROGRESS");
    
    const mockExplanation = `### AI Patient-Friendly Care Guide: ${activeTreatment ? activeTreatment.name : "Routine Care"}
    
#### What This Treatment Accomplishes
The titanium anchor replacement mimics your natural tooth root. Once integrated into the jawbone, a customized zirconium crown is attached. This stops bone regression, restores chewing bite force, and aligns the surrounding teeth.

#### Clinical Roadmap & Costs
* **Phase 1-2 (Scans & Cleanings)**: Completed (Cost: $400.00, Paid)
* **Phase 3 (Implant Placement Surgery)**: In Progress (Cost: $1,150.00, Paid)
* **Phase 4 (Final Crown Fitting)**: Upcoming (Billed Co-Pay: $450.00 pending)

#### Patient Post-Op Instructions
1. **Diet**: Stay on soft, cool foods (yogurts, cold purees) for the first 48 hours. Avoid straw usage.
2. **Hygiene**: Brush other areas normally, but avoid brushing the surgical site today. Rinse gently with warm saltwater after day 2.
3. **Meds**: Complete the prescribed post-op antibiotic course to prevent site infection.`;

    let explanationText = mockExplanation;

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
                content: "You are a professional dental AI consultant. Write a patient-friendly care guide explaining their current treatment phases, costs, risks, and recovery steps. Make it clear and structured in markdown."
              },
              {
                role: "user",
                content: `Patient Name: ${patient.user.name}
Treatment Journey: ${activeTreatment ? activeTreatment.name : "Routine"}
Phases Billed: ${activeTreatment ? activeTreatment.phases.map(ph => `${ph.name} ($${ph.cost}) - ${ph.status}`).join(", ") : "N/A"}`
              }
            ]
          })
        });
        
        if (response.ok) {
          const aiData = await response.json();
          explanationText = aiData.choices[0].message.content;
        }
      } catch (_) {
        // fall back to mockExplanation
      }
    }

    // Audit Logging
    await logAction(
      sessionUser.id,
      "EDIT_TREATMENT",
      `Dentist generated AI Patient Explanation guide for: ${patient.user.name} (ID: ${patient.id})`
    );

    return NextResponse.json({ explanation: explanationText });
  } catch (err) {
    console.error("AI Explain API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
