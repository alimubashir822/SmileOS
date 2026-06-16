import prisma from "@/lib/prisma";

export async function logAction(userId: string, action: string, details: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
      },
    });
  } catch (err) {
    console.error("Audit log creation failed:", err);
  }
}
