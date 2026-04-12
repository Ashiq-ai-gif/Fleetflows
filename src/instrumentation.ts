export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.AUTH_SECRET) missing.push("AUTH_SECRET");
  if (missing.length > 0) {
    throw new Error(`Fleet Flows: missing required env in production: ${missing.join(", ")}`);
  }

  const publicUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!publicUrl) {
    console.warn(
      "Fleet Flows: AUTH_URL or NEXTAUTH_URL is unset in production — set it to your public https origin."
    );
  }
}
