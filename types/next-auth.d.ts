import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    tenantId: string;
    tenantName: string;
  }

  interface Session {
    user: User;
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    tenantId: string;
    tenantName: string;
  }
}
