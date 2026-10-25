import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Normalize SQLite url to absolute path if running with file:
const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.startsWith("file:") && !envUrl.includes(":") && !envUrl.startsWith("file:/")) {
    const relPath = envUrl.replace(/^file:/, "");
    const absPath = path.resolve(process.cwd(), relPath).replace(/\\/g, "/");
    return `file:${absPath}`;
  }
  if (envUrl) {
    return envUrl;
  }
  const defaultPath = path.resolve(process.cwd(), "prisma/dev.db").replace(/\\/g, "/");
  return `file:${defaultPath}`;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

