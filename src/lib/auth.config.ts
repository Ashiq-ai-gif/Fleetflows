import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        type: { label: "Role Type", type: "text" }
      },
      async authorize() {
        // Placeholder – real authorize is in auth.ts (Node runtime, not Edge)
        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user, trigger, session }: any) {
      // On initial sign-in, stamp the user's properties into the token
      if (user) {
        token.id         = user.id;
        token.role       = user.role;
        token.tenantId   = user.tenantId;
        token.tenantName = user.tenantName;
      }

      // Impersonation: allow client-side session.update() to swap context
      if (trigger === "update" && session) {
        if (session.tenantId)              token.tenantId       = session.tenantId;
        if (session.role)                  token.role           = session.role;
        if (session.tenantName)            token.tenantName     = session.tenantName;
        if (session.isImpersonating !== undefined) {
          token.isImpersonating = session.isImpersonating;
        }
        // Store original super-admin tenantId so we can "exit" impersonation
        if (session.originalTenantId !== undefined) {
          token.originalTenantId = session.originalTenantId;
        }
      }

      return token;
    },
    session({ session, token }: any) {
      if (token && session.user) {
        session.user.id              = token.id            as string;
        session.user.role            = token.role          as string;
        session.user.tenantId        = token.tenantId      as string;
        session.user.tenantName      = token.tenantName    as string;
        session.user.isImpersonating = token.isImpersonating as boolean | undefined;
        session.user.originalTenantId = token.originalTenantId as string | undefined;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
} satisfies NextAuthConfig;
