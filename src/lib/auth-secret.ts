/**
 * Mobile JWT signing secret. Never use a hardcoded fallback in production.
 */
export function getMobileJwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is required in production for mobile JWT and NextAuth.");
    }
    return "dev_only_mobile_jwt_secret_set_AUTH_SECRET";
  }
  return secret;
}
