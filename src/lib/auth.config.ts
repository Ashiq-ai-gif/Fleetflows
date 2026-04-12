import NextAuth from "next-auth";
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
      async authorize(credentials) {
        // This is a placeholder since we can't use DB in Edge
        // The real authorize happens in auth.ts which is not used by middleware
        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantName = token.tenantName as string;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
} satisfies NextAuthConfig;
