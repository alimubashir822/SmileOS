import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = "file:" + path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding SmileOS database...");

  // Clean tables (respecting dependencies)
  await prisma.followUp.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.treatmentPhase.deleteMany({});
  await prisma.treatment.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.clinic.deleteMany({});

  console.log("Cleared database.");

  // 1. Create Clinics
  const clinicSF = await prisma.clinic.create({
    data: {
      name: "SmileOS SF Branch",
      location: "100 Health Science Blvd, Suite A, San Francisco, CA 94107",
      phone: "(415) 555-0130",
    },
  });

  const clinicOakland = await prisma.clinic.create({
    data: {
      name: "SmileOS Oakland Branch",
      location: "500 Broadway, Suite 200, Oakland, CA 94607",
      phone: "(510) 555-0180",
    },
  });

  console.log("Created Clinics.");

  // 2. Create Users
  // Admin
  const adminUser = await prisma.user.create({
    data: {
      name: "Clinic Admin",
      email: "admin@smileos.com",
      password: "password",
      role: "ADMIN",
    },
  });

  // Dentist 1: Dr. Ahmed (SF)
  const dentistUser1 = await prisma.user.create({
    data: {
      name: "Dr. Ahmed",
      email: "ahmed@smileos.com",
      password: "password",
      role: "DENTIST",
    },
  });

  // Dentist 2: Dr. Smith (Oakland)
  const dentistUser2 = await prisma.user.create({
    data: {
      name: "Dr. Smith",
      email: "smith@smileos.com",
      password: "password",
      role: "DENTIST",
    },
  });

  // Assistant (SF)
  const assistantUser = await prisma.user.create({
    data: {
      name: "Jane Doe (Assistant)",
      email: "assistant@smileos.com",
      password: "password",
      role: "ASSISTANT",
    },
  });

  // Receptionist (SF)
  const receptionistUser = await prisma.user.create({
    data: {
      name: "Mark Wood (Receptionist)",
      email: "receptionist@smileos.com",
      password: "password",
      role: "RECEPTIONIST",
    },
  });

  // Patient 1: Sarah
  const patientUser1 = await prisma.user.create({
    data: {
      name: "Sarah Connor",
      email: "sarah@smileos.com",
      password: "password",
      role: "PATIENT",
    },
  });

  // Patient 2: Leo (Child dependent)
  const patientUser2 = await prisma.user.create({
    data: {
      name: "Leo Connor (Child)",
      email: "leo@smileos.com",
      password: "password",
      role: "PATIENT",
    },
  });

  console.log("Created Users.");

  // 3. Create Doctor Profiles
  const doctorAhmed = await prisma.doctor.create({
    data: {
      userId: dentistUser1.id,
      clinicId: clinicSF.id,
      specialty: "Implantologist",
      bio: "Board-certified in complex oral implantology and reconstructive maxillofacial styling.",
      availableSlots: "10:00 AM;1:30 PM;3:00 PM;4:30 PM",
    },
  });

  const doctorSmith = await prisma.doctor.create({
    data: {
      userId: dentistUser2.id,
      clinicId: clinicOakland.id,
      specialty: "Orthodontist",
      bio: "Specialist in brackets, Invisalign braces, and adolescent dental alignments.",
      availableSlots: "09:00 AM;11:00 AM;1:30 PM;4:00 PM",
    },
  });

  console.log("Created Dentist Profiles.");

  // 4. Create Patient Profiles (Family Relations)
  const patientSarah = await prisma.patient.create({
    data: {
      userId: patientUser1.id,
      clinicId: clinicSF.id,
      phone: "+1 555-0199",
      address: "123 Cyberdyne Way, Los Angeles, CA 90210",
      insuranceProvider: "Delta Dental",
      insuranceMemberId: "DD-88492-X",
      insuranceCoverage: "Active",
    },
  });

  const patientLeo = await prisma.patient.create({
    data: {
      userId: patientUser2.id,
      clinicId: clinicSF.id,
      parentId: patientSarah.id, // Linked under Sarah Connor
      phone: "+1 555-0199",
      address: "123 Cyberdyne Way, Los Angeles, CA 90210",
      insuranceProvider: "Delta Dental",
      insuranceMemberId: "DD-88492-X",
      insuranceCoverage: "Active",
    },
  });

  console.log("Created Patient Profiles.");

  // 5. Create Treatments and Phases
  const treatmentImplant = await prisma.treatment.create({
    data: {
      patientId: patientSarah.id,
      name: "Dental Implant Journey",
      status: "IN_PROGRESS",
      cost: 2000.0,
      paid: 1550.0,
      remaining: 450.0,
      progressPercent: 60,
      currentStage: "Implant Placement Surgery",
    },
  });

  await prisma.treatmentPhase.createMany({
    data: [
      {
        treatmentId: treatmentImplant.id,
        name: "Phase 1: Diagnosis & Planning",
        status: "COMPLETED",
        cost: 250.0,
        order: 1,
      },
      {
        treatmentId: treatmentImplant.id,
        name: "Phase 2: Preventive Scaling & Care",
        status: "COMPLETED",
        cost: 150.0,
        order: 2,
      },
      {
        treatmentId: treatmentImplant.id,
        name: "Phase 3: Implant Placement Surgery",
        status: "IN_PROGRESS",
        cost: 1150.0,
        order: 3,
      },
      {
        treatmentId: treatmentImplant.id,
        name: "Phase 4: Crown Fabrication & Fitting",
        status: "UPCOMING",
        cost: 450.0,
        order: 4,
      },
    ],
  });

  console.log("Created Treatments & Phases.");

  // 6. Create Invoices
  await prisma.invoice.create({
    data: {
      patientId: patientSarah.id,
      treatmentId: treatmentImplant.id,
      amount: 400.0,
      insuranceSplit: 320.0,
      patientSplit: 80.0,
      dueDate: "10 June 2026",
      description: "Diagnostics, X-Rays, & Pre-op Cleaning (Phases 1-2)",
      status: "PAID",
    },
  });

  await prisma.invoice.create({
    data: {
      patientId: patientSarah.id,
      treatmentId: treatmentImplant.id,
      amount: 1150.0,
      insuranceSplit: 650.0,
      patientSplit: 500.0,
      dueDate: "15 June 2026",
      description: "Implant Placement Post-Op Surgical Fee (Phase 3)",
      status: "PAID",
    },
  });

  await prisma.invoice.create({
    data: {
      patientId: patientSarah.id,
      treatmentId: treatmentImplant.id,
      amount: 450.0,
      insuranceSplit: 0.0,
      patientSplit: 450.0,
      dueDate: "20 June 2026",
      description: "Zirconium Crown Fabrication & Placement (Phase 4)",
      status: "PENDING",
    },
  });

  console.log("Created Invoices.");

  // 7. Create Appointments
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  await prisma.appointment.create({
    data: {
      patientId: patientSarah.id,
      doctorId: doctorAhmed.id,
      date: tomorrowStr,
      timeSlot: "3:00 PM",
      treatmentName: "Implant Placement Surgery",
      status: "CONFIRMED",
      notes: "Stage 3 implant site check. Torque validation and gum inspection.",
    },
  });

  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 5);
  const pastDateStr = pastDate.toISOString().split("T")[0];

  await prisma.appointment.create({
    data: {
      patientId: patientSarah.id,
      doctorId: doctorAhmed.id,
      date: pastDateStr,
      timeSlot: "10:30 AM",
      treatmentName: "Diagnosis & Planning",
      status: "CONFIRMED",
      notes: "Panoramic X-Ray scans completed. Jawbone volume is optimal.",
    },
  });

  console.log("Created Appointments.");

  // 8. Create Documents
  await prisma.document.create({
    data: {
      patientId: patientSarah.id,
      name: "Panoramic Jaw X-Ray",
      fileUrl: "/assets/mock-xray.jpg",
      type: "X_RAY",
      tag: "jaw-bone",
      uploadedAt: pastDate,
    },
  });

  await prisma.document.create({
    data: {
      patientId: patientSarah.id,
      name: "Surgical Antibiotic Prescription",
      fileUrl: "/assets/prescription.pdf",
      type: "PRESCRIPTION",
      tag: "antibiotic",
      uploadedAt: pastDate,
    },
  });

  console.log("Created Documents.");

  // 9. Follow-Up automations
  await prisma.followUp.createMany({
    data: [
      {
        patientId: patientSarah.id,
        message: "Hi Sarah, how are you feeling after your consultation?",
        date: pastDateStr,
        sent: true,
        type: "DAY_1",
      },
      {
        patientId: patientSarah.id,
        message: "Please share details about your surgical recovery timeline tomorrow.",
        date: tomorrowStr,
        sent: false,
        type: "DAY_7",
      },
      {
        patientId: patientSarah.id,
        message: "Your standard bimonthly dental hygiene appointment is due.",
        date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        sent: false,
        type: "DAY_30",
      },
    ],
  });

  console.log("Created FollowUps.");

  // 10. Messages
  await prisma.message.createMany({
    data: [
      {
        patientId: patientSarah.id,
        sender: "PATIENT",
        text: "Hi, I have surgery tomorrow. Is laser alignment painful?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        patientId: patientSarah.id,
        sender: "AI",
        text: "Hello Sarah! Laser alignment and surgical scans are pain-free. We use localized numbing so you will not feel discomfort during the session. Let me know if you would like post-surgical care tips!",
        timestamp: new Date(Date.now() - 3500000),
      },
    ],
  });

  console.log("Created Messages.");

  // 11. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUser.id,
        action: "LOGIN",
        details: "Admin user logged in from branch terminal.",
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        userId: dentistUser1.id,
        action: "VIEW_PATIENT",
        details: `Doctor viewed record folder of patient: Sarah Connor (ID: ${patientSarah.id})`,
        timestamp: new Date(Date.now() - 3600000),
      },
    ],
  });

  console.log("Created Audit Logs.");
  console.log("SmileOS database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding SmileOS database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
