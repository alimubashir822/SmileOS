import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAction } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    let targetRole = role;
    if (role === "DOCTOR") targetRole = "DENTIST";

    if (role && user.role !== targetRole) {
      return NextResponse.json({ error: "Unauthorized role access" }, { status: 403 });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "DENTIST" ? "DOCTOR" : user.role,
      patientId: user.patient?.id || undefined,
      doctorId: user.doctor?.id || undefined,
    };

    const sessionStr = Buffer.from(JSON.stringify(sessionUser)).toString("base64");
    const response = NextResponse.json({ user: sessionUser });
    
    response.cookies.set("smileos-session", sessionStr, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    // Write audit log log
    await logAction(user.id, "LOGIN", `User authenticated successfully with role: ${user.role}.`);

    return response;
  } catch (err: any) {
    console.error("Login route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
