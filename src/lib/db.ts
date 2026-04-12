import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Enable query logging in development
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
