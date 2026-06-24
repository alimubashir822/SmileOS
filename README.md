Created & Developed by [Mubashir Ali](#developer-creator) (Full-Stack Healthcare Technology Engineer | AI Healthcare Solutions Builder)

# SmileOS — AI-Powered Dental Operating System

SmileOS is an enterprise-grade, multi-role Practice Management and Patient Care Operating System built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, and **Prisma 7 + SQLite**. 

Rather than a basic booking site, SmileOS is engineered to solve expensive business problems for dental groups—driving patient retention, accelerating treatment acceptance, automating clinical workflows, and securing HIPAA-compliant audit logs.

---

## 🚀 Key Features & Premium SaaS Modules

### 1. 🧠 AI Treatment Acceptance Assistant
Cosmetic and structural dental treatments (implants, veneers, crowns) are expensive. SmileOS features an **AI Explainer** that translates clinical terminology (e.g. bone graft procedures, titanium anchors) into patient-friendly benefit sheets, helping users understand timelines, values, and payment options to confidently approve treatments.

### 2. 💬 AI Lead Receptionist Chatbot
A floating public assistant on the clinic landing page that engages potential leads, explains whitening vs veneer options, answers insurance/pricing questions, and routes qualified prospects directly to the scheduling calendar.

### 3. 🦷 Interactive Digital Tooth Chart
Created a visual, SVG-like dental map representing Teeth 1–32 (divided into upper and lower arches) inside the dentist patient view. Clicking any tooth highlights its clinical condition (Healthy, Decay, Active Treatment, Restored), displays localized patient records/notes, and allows dentists to type and save custom clinical logs dynamically.

### 4. 📲 Self-Service QR Check-In & Live Stepper
Patients can click "Check-In QR Code" on their dashboard to display a clinic terminal scan code. Clicking **Simulate QR Scan (Check In)** calls the backend, updates their status from `SCHEDULED` to `CHECKED_IN`, and updates the patient's Live Visit Stepper (`Scheduled` ➔ `Checked In` ➔ `With Dentist` ➔ `Completed`) in real-time.

### 5. 📋 Dentist Waiting Room Queue Stats
The Dentist daily agenda sidebar displays active waiting room metrics: **Scheduled**, **Waiting (Checked In)**, **In Chair (With Dentist)**, and **Done (Completed)**. Dentists can click buttons inside the details panel to advance a patient from waiting room ➔ dental chair ➔ completed session.

### 6. ✨ Interactive Smile Transformation Simulator
An interactive visual slider on the patient dashboard allowing users to preview smile shifts (Veneers, Whitening, Invisalign Aligners) in real-time. Features a clip-path divider mask and simulated selfie upload to project cosmetic results.

### 7. 🔏 HIPAA Digital Consent Sign-off
A clinical agreement tracker. Patients can review surgical details, sign digital consent forms online, update the database, and trigger a secure HIPAA audit entry automatically before clinical procedures begin.

### 8. 🔍 Compliance Audit Log Ledger
To assure absolute health data security, an immutable audit trail records logins, patient record inspections, check-ins, consent signatures, and treatment phase edits, visible directly inside the Admin portal.

### 9. 💳 Phased Billing Splits & Payment Plans
Every treatment plan is broken into cost phases. Billing is split between insurance claims and patient co-pay fees, with flexible 0% APR payments simulated at checkout.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide Icons, Framer Motion
* **Database & ORM**: Prisma 7 Client, SQLite database engine, `@prisma/adapter-better-sqlite3` driver adapter
* **Routing & Guards**: Custom Session Auth Proxy (`src/proxy.ts`)
* **Utilities**: Custom audit logging helpers (`src/lib/audit.ts`)
* **Serverless SQLite Adapter**: Dynamic file-copy copy (`fs.copyFileSync`) transferring [prisma/template.db](file:///c:/Users/Mubashir%20Ali/Desktop/SmileOS/prisma/template.db) to writable `/tmp/dev.db` folder on serverless cold starts (Vercel deployment helper).

---

## 📊 Database Schema Architecture

The relational database modeling (`prisma/schema.prisma`) includes:
* **`Clinic`**: Represents physical branches (San Francisco, Oakland).
* **`User`**: Core accounts supporting `ADMIN`, `DENTIST`, `ASSISTANT`, `RECEPTIONIST`, and `PATIENT` roles.
* **`Patient`**: Handles medical records, insurance providers, and self-referencing dependents (`parentId`) for Family Profile switchers.
* **`Doctor`**: Roster schedules, specialties, and bio details.
* **`Appointment`**: Manages date, timeslots, doctor assignments, and live status (`visitStatus`: `SCHEDULED`, `CHECKED_IN`, `WITH_DENTIST`, `COMPLETED`).
* **`Treatment` & `TreatmentPhase`**: Stores phased clinical plans, cost metrics, and digital consent signature locks.
* **`Invoice`**: Billed splits tracking insurance payouts and patient co-pays (`PAID`, `PENDING`, `OVERDUE`).
* **`Document`**: File locker housing Panoramic X-Rays, prescriptions, and custom tags.
* **`AuditLog`**: Immutable HIPAA tracking logs.
* **`FollowUp`**: Advanced automated recall system tracking overdue hygiene cleanings.

---

## 📦 Getting Started

### 1. Install Dependencies
Clone the repository, navigate to the directory, and run:
```bash
npm install
```

### 2. Push Database Schema
Sync the SQLite database structure:
```bash
npx prisma db push
```

### 3. Seed Mock Database Data
Execute the seed script to populate clinics, specialists, medical timelines, and demo accounts:
```bash
npx tsx prisma/seed.ts
```

### 4. Copy Database Template (Required for Vercel Deployment)
Make sure `prisma/template.db` is present for serverless packaging:
```bash
Copy-Item dev.db prisma/template.db -Force
```

### 5. Run Development Server
Start the local server at `http://localhost:3000`:
```bash
npm run dev
```

### 6. Build for Production
Check for TypeScript type-safety and generate static pages:
```bash
npm run build
```

---

## 🔑 Demo Access Credentials

The database contains pre-configured profiles for testing:

| Portal Role | Demo Email | Password | Features to Test |
| :--- | :--- | :--- | :--- |
| **Patient** | `sarah@smileos.com` | `password` | Smart greeting banner, self-service QR check-in modal, Live Visit status tracker stepper, Smile Journey map, Family profile switcher (Leo Connor), Overdue cleaning alert, Dental Records Vault, Smile Simulator, and AI Chat Assistant. |
| **Dentist** | `ahmed@smileos.com` | `password` | Daily clinic agenda waitlist stats counters, visit status badges, Interactive Digital Tooth Chart (click/modify Teeth 1–32 notes & status), Patient details folder, and AI Pre-Op briefings. |
| **Admin** | `admin@smileos.com` | `password` | Operational metrics (revenue, appointments, no-show rates), user directories, and live HIPAA Compliance Audit log table. |

---

## 🧪 E2E Verification Guide

To test the system flow:
1. **AI Chatbot**: Open `http://localhost:3000/`, open the virtual receptionist in the bottom-right corner, and ask: *"Do you offer Dental Implants?"*
2. **Book Appointment**: Navigate to `/book`, choose `Implant Placement` with `Dr. Ahmed`, select a slot, input `sarah@smileos.com` for quick-sync, and confirm.
3. **Patient Self Check-In**: Log in as Sarah Connor (`sarah@smileos.com`), click **Check-In QR Code** on your visit status card, and click **Simulate QR Scan (Check In)**. Accept the check-in confirmation alert and verify the stepper advances to **Checked In**.
4. **Dentist Console waitlist**: Log out and log in as Dr. Ahmed (`ahmed@smileos.com`). In the sidebar stats, verify **Waiting** count is `1` and Sarah Connor's item has a blue waiting badge.
5. **Interactive Tooth Chart**: Click on Sarah Connor, click **Tooth 3** (implant) and **Tooth 14** (restored) to check their notes. Type a new clinical log, save it, and check that the record updates.
6. **Patient Visit Progression**: Click **Call to Dental Chair** and verify the status changes to "In Chair" (sidebar stats sync). Click **Complete Visit** to complete the visit.
7. **Audit Logs**: Log out, sign in as `admin@smileos.com`, and check the **HIPAA Compliance Audit Ledger** to verify the check-in and treatment updates were securely logged.

---

<a id="developer-creator"></a>
## 👤 Developer & Creator

I am a Full-Stack Healthcare Technology Developer specializing in building modern, scalable, and AI-powered healthcare platforms. I create high-performance digital solutions using React.js, Next.js, TypeScript, and Tailwind CSS to deliver fast, secure, and user-friendly experiences.

My expertise covers complete application development, from frontend architecture and responsive interfaces to backend systems powered by Node.js, REST APIs, GraphQL, PostgreSQL, and Prisma ORM. I build reliable platforms designed for scalability, performance, and long-term growth.

I work with modern cloud infrastructure including AWS, Vercel Edge, Google Cloud, Cloudflare CDN, Docker, and CI/CD pipelines to deploy secure and optimized applications.

With a strong focus on healthcare technology, I develop solutions including patient portals, AI automation systems, EHR integrations, and healthcare applications built around industry standards such as FHIR APIs and HIPAA compliance requirements.

My goal is to combine modern software engineering, cloud technologies, and healthcare innovation to help organizations build smarter digital experiences that improve patient engagement, operational efficiency, and healthcare delivery.

### 📫 Connect with Me

- 💼 **LinkedIn**: <a href="https://linkedin.com/in/mubashirali822" target="_blank" rel="noopener noreferrer">mubashirali822</a>
- 📧 **Email**: <a href="mailto:alimubashir822@gmail.com" target="_blank" rel="noopener noreferrer">alimubashir822@gmail.com</a>
- 🌐 **Website**: <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer">medclinicx.com</a>
- 🏥 **View More Healthcare Solutions**: <a href="https://www.medclinicx.com/demo" target="_blank" rel="noopener noreferrer">medclinicx.com/demo</a>

⭐ *Building the next generation of digital healthcare technology.*
