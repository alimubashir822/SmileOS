import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    return NextResponse.json({ doctors });
  } catch (err) {
    console.error("Fetch doctors error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
