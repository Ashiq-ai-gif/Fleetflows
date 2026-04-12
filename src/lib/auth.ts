import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import { verifyDriverCredential, verifyEmployeeCredential } from "@/lib/driver-employee-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        type: { label: "Role Type", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Driver Login
          if (credentials.type === "DRIVER") {
            const driver = await db.driver.findFirst({
              where: { phone: credentials.email as string },
              include: { tenant: true }
            });

            if (!driver || !(await verifyDriverCredential(driver, credentials.password as string))) {
              return null;
            }

            return {
              id: driver.id,
              email: driver.phone, // NextAuth requires an email field, using phone
              name: driver.name,
              role: "DRIVER",
              tenantId: driver.tenantId,
              tenantName: driver.tenant?.name || "Unknown Company"
            };
          }

          // Employee Login
          if (credentials.type === "EMPLOYEE") {
            const employee = await db.employee.findUnique({
              where: { email: credentials.email as string },
              include: { tenant: true }
            });

            if (!employee || !(await verifyEmployeeCredential(employee, credentials.password as string))) {
              return null;
            }

            return {
              id: employee.id,
              email: employee.email,
              name: employee.name,
              role: "EMPLOYEE",
              tenantId: employee.tenantId,
              tenantName: employee.tenant?.name || "Unknown Company"
            };
          }

          // Admin Login (Default)
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
            include: { tenant: true }
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            tenantName: user.tenant?.name || "Unknown Company"
          };
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      }
    })
  ],
});
