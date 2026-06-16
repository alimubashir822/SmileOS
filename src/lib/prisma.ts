import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import fs from "fs";

let prisma: PrismaClient;

const isVercel = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_VERSION;

let dbFilePath: string;

if (isVercel) {
  dbFilePath = "/tmp/dev.db";
  // Copy template.db to /tmp/dev.db on first load if it doesn't exist
  if (!fs.existsSync(dbFilePath)) {
    const templatePath = path.join(process.cwd(), "prisma", "template.db");
    if (fs.existsSync(templatePath)) {
      try {
        fs.copyFileSync(templatePath, dbFilePath);
        console.log("Successfully copied template database to /tmp/dev.db");
      } catch (err) {
        console.error("Failed to copy template database:", err);
      }
    } else {
      console.error("Template database not found at:", templatePath);
    }
  }
} else {
  dbFilePath = path.join(process.cwd(), "dev.db");
}

const dbPath = "file:" + dbFilePath;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  prisma = new PrismaClient({ adapter });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: dbPath });
    globalWithPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
