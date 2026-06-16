import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("smileos-session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const sessionStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const user = JSON.parse(sessionStr);

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Session route error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
