import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getMobileJwtSecret } from "@/lib/auth-secret";

export interface MobileJWTPayload {
  id: string;
  role: string;
  tenantId: string;
  iat: number;
  exp: number;
}

export function verifyMobileAuth(req: Request): MobileJWTPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    
    // Verify token
    const decoded = jwt.verify(token, getMobileJwtSecret()) as MobileJWTPayload;
    return decoded;
  } catch (error) {
    return null; // Invalid, expired, or tampered token
  }
}

export function unauthenticatedResponse() {
  return NextResponse.json(
    { error: "Unauthorized. Invalid or missing Bearer token." },
    { status: 401 }
  );
}
