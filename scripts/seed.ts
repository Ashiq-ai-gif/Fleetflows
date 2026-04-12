import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const plainPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;
  if (!plainPassword || plainPassword.length < 12) {
    throw new Error(
      "Set SEED_SUPER_ADMIN_PASSWORD in the environment (min 12 characters) before running seed."
    );
  }

  console.log("Seeding initial super admin...");

  // 1. Create the system tenant
  const tenant = await prisma.tenant.upsert({
    where: { domain: "fleetflows.com" },
    update: {},
    create: {
      name: "Fleet Flows HQ",
      domain: "fleetflows.com",
      plan: "ENTERPRISE",
    },
  });

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 3. Create the Super Admin user
  const admin = await prisma.user.upsert({
    where: { email: "ashiq.rahaman@fleetflows.com" },
    update: {
      password: hashedPassword, // Reset password if run again
      role: "SUPER_ADMIN"
    },
    create: {
      email: "ashiq.rahaman@fleetflows.com",
      name: "Ashiq Rahaman",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      tenantId: tenant.id,
    },
  });

  console.log("Seed successful!");
  console.log("Login Email:", admin.email);
  console.log("Tenant:", tenant.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
