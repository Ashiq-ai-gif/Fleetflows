import bcrypt from "bcryptjs";

/**
 * Legacy demo PINs (1234 / license as password) are allowed only when this returns true.
 * Production defaults to false unless ALLOW_DEMO_DRIVER_EMPLOYEE_AUTH=true (staging).
 */
export function allowLegacyDriverEmployeeDemoAuth(): boolean {
  if (process.env.NODE_ENV === "production") {
    return process.env.ALLOW_DEMO_DRIVER_EMPLOYEE_AUTH === "true";
  }
  return process.env.ALLOW_DEMO_DRIVER_EMPLOYEE_AUTH !== "false";
}

export async function verifyDriverCredential(
  driver: { loginPinHash: string | null; licenseNumber: string },
  password: string
): Promise<boolean> {
  if (driver.loginPinHash) {
    return bcrypt.compare(password, driver.loginPinHash);
  }
  if (!allowLegacyDriverEmployeeDemoAuth()) {
    return false;
  }
  return password === "1234" || password === driver.licenseNumber;
}

export async function verifyEmployeeCredential(
  employee: { loginPinHash: string | null },
  password: string
): Promise<boolean> {
  if (employee.loginPinHash) {
    return bcrypt.compare(password, employee.loginPinHash);
  }
  if (!allowLegacyDriverEmployeeDemoAuth()) {
    return false;
  }
  return password === "1234";
}
