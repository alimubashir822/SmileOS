# SmileOS — AI-Powered Dental Operating System

SmileOS is an enterprise-grade, multi-role Practice Management and Patient Care Operating System built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, and **Prisma 7 + SQLite**. 

Rather than a basic booking site, SmileOS is engineered to solve expensive business problems for dental groups—driving patient retention, accelerating treatment acceptance, automating clinical follow-ups, and securing compliance logs.

---

## 🚀 Key Features & Premium SaaS Modules

### 1. 🧠 AI Treatment Acceptance Assistant
Cosmetic and structural dental treatments (implants, veneers, crowns) are expensive. SmileOS features an **AI Explainer** that translates clinical terminology (e.g. bone graft procedures, titanium anchors) into patient-friendly benefit sheets, helping users understand timelines, values, and payment options to confidently approve treatments.

### 2. 💬 AI Lead Receptionist Chatbot
A floating public assistant on the clinic landing page that engages potential leads, explains whitening vs veneer options, answers insurance/pricing questions, and routes qualified prospects directly to the scheduling calendar.

### 3. ✨ Interactive Smile Transformation Simulator
An interactive visual slider on the patient dashboard allowing users to preview smile shifts (Veneers, Whitening, Invisalign Aligners) in real-time. Features a clip-path divider mask and simulated selfie upload to project cosmetic results.

### 4. 🔏 HIPAA Digital Consent sign-off
A clinical agreement tracker. Patients can review surgical details, sign digital consent forms online, update the database, and trigger a secure HIPAA audit entry automatically before clinical procedures begin.

### 5. 🔍 Compliance Audit Log Ledger
To assure absolute health data security, an immutable audit trail records logins, patient records inspects, consent signatures, and treatment phase edits, visible directly inside the Admin portal.

### 6. 📅 Roster Schedules & Clinical Pre-Op Briefs
When a dentist logs in, they see their daily clinic timeline. For any patient, the dentist can generate an AI Briefing Sheet summarizing history, scans, allergies, and surgical checkpoints.

### 7. 💳 Phased Billing splits & Payment plans
Every treatment plan is broken into cost phases. Billing is split between insurance claims and patient co-pay fees, with flexible 0% APR payments simulated at checkout.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide Icons, Framer Motion
* **Database & ORM**: Prisma 7 Client, SQLite database engine, `@prisma/adapter-better-sqlite3` driver adapter
* **Routing & Guards**: Custom Session Auth Proxy (`src/proxy.ts`)
* **Utilities**: Custom audit logging helpers (`src/lib/audit.ts`)

---

## 📊 Database Schema Architecture

The relational database modeling (`prisma/schema.prisma`) includes:
* **`Clinic`**: Represents physical branches (San Francisco, Oakland).
* **`User`**: Core accounts supporting `ADMIN`, `DENTIST`, `ASSISTANT`, `RECEPTIONIST`, and `PATIENT` roles.
* **`Patient`**: Handles medical records, insurance providers, and self-referencing dependents (`parentId`) for Family Tree switcher grids.
* **`Doctor`**: Roster schedules, specialties, and bio details.
* **`Appointment`**: Manages date, time, notes, and lifecycle status (`PENDING`, `CONFIRMED`, `CANCELLED`).
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

### 4. Run Development Server
Start the local server at `http://localhost:3000`:
```bash
npm run dev
```

### 5. Build for Production
Check for Typescript type-safety and generate static pages:
```bash
npm run build
```

---

## 🔑 Demo Access Credentials

The database contains pre-configured profiles for testing:

| Portal Role | Demo Email | Password | Features to Test |
| :--- | :--- | :--- | :--- |
| **Patient** | `sarah@smileos.com` | `password` | Smile Journey map, Family profile switcher (Leo Connor), Overdue cleaning alert, Dental Records Vault, Smile Simulator, and AI Chat Assistant. |
| **Dentist** | `ahmed@smileos.com` | `password` | Daily clinical roster schedules, patient detail summaries, AI pre-operative briefings, and AI Treatment Accept explainer generator. |
| **Admin** | `admin@smileos.com` | `password` | Operational metrics (billed vs paid ratios, no-show rates), user directories, and live HIPAA Compliance Audit log table. |

---

## 🧪 E2E Verification Guide

To test the system flow:
1. **AI Chatbot**: Open `http://localhost:3000/`, open the virtual receptionist in the bottom-right corner, and ask: *"Do you offer Dental Implants?"*
2. **Book Appointment**: Navigate to `/book`, choose `Implant Placement` with `Dr. Ahmed`, select a slot, input `sarah@smileos.com` for quick-sync, and confirm.
3. **Digital Consent**: Log in as Sarah, navigate to *Treatment Journey*, scroll to the *Clinical Consent* card, type your name to sign, and submit.
4. **Audit Logs**: Log out, sign in as `admin@smileos.com`, and check the **HIPAA Compliance Audit Ledger** to verify the `SIGN_CONSENT` action was securely logged.
