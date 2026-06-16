import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

function getDentalFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  
  if (q.includes("implant") && (q.includes("care") || q.includes("after") || q.includes("recover") || q.includes("pain"))) {
    return "### Post-Op Care for Dental Implants\n\n1. **First 24 Hours**: Keep ice packs applied to the cheek (20 mins on, 20 mins off) to reduce swelling. Avoid hot foods, carbonated drinks, spitting, and straw usage.\n2. **Diet**: Stick to soft, cool foods like yogurt, ice cream, cool soups, mashed potatoes, and protein shakes.\n3. **Oral Hygiene**: Do not brush the surgery area directly today. Starting tomorrow, gently rinse with warm saltwater (1/2 tsp salt in warm water) after meals.\n4. **Pain Control**: Take your prescribed pain relievers before the local anesthesia wears off completely to stay ahead of discomfort.";
  }
  if (q.includes("whitening") && (q.includes("sensitive") || q.includes("hurt") || q.includes("care"))) {
    return "### Whitening Aftercare & Sensitivity\n\n1. **Sensitivity**: It is completely normal to experience 'zings' or mild sensitivity for 24-48 hours. Use a sensitive toothpaste (containing potassium nitrate) and avoid extremely hot or ice-cold drinks.\n2. **The 48-Hour White Diet**: Avoid dark-colored foods and beverages that could stain your freshly bleached teeth. Stay away from coffee, tea, red wine, soy sauce, tobacco, tomato paste, and chocolate. Stick to chicken, pasta, rice, and water.";
  }
  if (q.includes("braces") || q.includes("pain") || q.includes("aligner") || q.includes("sore")) {
    return "### Managing Orthodontic Discomfort\n\n1. **Soft Diet**: Focus on eating soft foods (mashed potatoes, scrambled eggs, yogurt, and oatmeal) for the first 2-3 days following an adjustment.\n2. **Dental Wax**: Apply a small pea-sized ball of dental wax over any wire brackets or sharp edges that are rubbing or causing sores on your gums or cheeks.\n3. **Saltwater Rinse**: Rinse with warm saltwater to speed up the healing of any minor mouth sores.\n4. **Pain Relievers**: Over-the-counter pain medications like ibuprofen work well to relieve tension and soreness.";
  }
  if (q.includes("insurance") || q.includes("pay") || q.includes("cost") || q.includes("price") || q.includes("plan")) {
    return "### Financials & Insurances\n\nWe accept major PPO insurance networks including **Delta Dental**, **MetLife**, and **Cigna**.\n* You can review coverage stats under the **Insurance Profile** panel.\n* Invoices and balances can be paid or financed via the **Payment Portal** tab, offering 0% APR installment plans split up to 12 months.";
  }
  if (q.includes("cleaning") || q.includes("hygiene")) {
    return "### Clinical Cleanings\n\nStandard cleanings remove calcified tartar and dental plaque, preventing gingivitis and gum recession.\n* **Frequency**: Healthy patients should book a cleaning every 6 months.\n* **Time**: Cleanings take about 45 minutes.\n* **Coverage**: Most preventive insurance plans cover cleanings 100%.";
  }
  
  return "Hello! I am your **SmileOS AI Dental Assistant**. I can explain dental procedures (implants, cleanings, braces, fillings), offer recovery care instructions, and explain insurance coverage rules. \n\n*Note: I cannot diagnose medical issues. If you are experiencing severe pain, swelling, or bleeding, please call our clinic directly at (415) 555-0130.*";
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
      return NextResponse.json({ error: "Only patients can chat with the assistant" }, { status: 403 });
    }
    
    const patientId = sessionUser.patientId;
    const { message: prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Empty prompt" }, { status: 400 });
    }
    
    await prisma.message.create({
      data: {
        patientId,
        sender: "PATIENT",
        text: prompt,
      }
    });

    let aiText = "";
    
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
                content: "You are a professional AI Dental Assistant for SmileOS. Answer patient queries about dental procedures, recovery, insurance, and pre-op preparation. Never give actual medical diagnoses. If asked for diagnosis, advise them to consult Dr. Ahmed or Dr. Smith. Keep answers friendly, formatted in markdown, and direct." 
              },
              { role: "user", content: prompt }
            ]
          })
        });
        
        if (response.ok) {
          const aiData = await response.json();
          aiText = aiData.choices[0].message.content;
        } else {
          aiText = getDentalFallbackResponse(prompt);
        }
      } catch (_) {
        aiText = getDentalFallbackResponse(prompt);
      }
    } else {
      aiText = getDentalFallbackResponse(prompt);
    }
    
    const aiMsg = await prisma.message.create({
      data: {
        patientId,
        sender: "AI",
        text: aiText,
      }
    });
    
    return NextResponse.json({ aiMsg });
  } catch (err) {
    console.error("AI Chat API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
