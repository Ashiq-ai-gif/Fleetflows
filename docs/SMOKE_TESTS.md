# Fleet Flows — Smoke tests and rollback

Use this after each production deploy. Track pass/fail in your runbook.

## Preconditions

- `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL` (or `NEXTAUTH_URL`) are set on the server.
- `NODE_ENV=production`.
- `ALLOW_DEMO_DRIVER_EMPLOYEE_AUTH` is **unset** or `false` in production unless you intentionally run a staging-style demo.
- When demo auth is off, **Driver** and **Employee** rows must have **`loginPinHash`** set (bcrypt of the PIN you choose). Until then, mobile login returns invalid credentials. Use a one-off script, Prisma Studio, or a future admin UI to set hashes.

## Smoke checklist

### Web

1. **HTTPS** — Open `https://<your-domain>/login`. Certificate valid; no mixed-content warnings.
2. **Manager login** — Email/password for a `User` with role MANAGER or ADMIN succeeds; session persists across refresh.
3. **Super admin** — SUPER_ADMIN login reaches `/admin` area (if account exists).
4. **Driver web path** — If you use driver login at `/driver/login`, verify expected credential policy (PIN hash or documented demo flag on staging only).
5. **Dashboard** — Home dashboard loads without 500 errors.
6. **CRUD spot check** — Create or edit one employee; one vehicle appears in list after save (adjust to your tenant data).

### API

7. **Health via app** — Open a dashboard page that lists trips or employees; network tab shows `200` on internal API fetches.
8. **Mobile auth** — `POST /api/mobile/v1/auth/login` with valid body returns `success: true` and a JWT when credentials are valid.

### Mobile (Expo)

9. **Build config** — App built with `EXPO_PUBLIC_API_URL=https://<your-domain>/api` (no `http://` IP literals).
10. **Driver flow** — Login → daily trips loads (may be empty array).
11. **Employee flow** — Login → daily trips loads.

### Database

12. **Migrations** — On server after deploy: `npx prisma migrate deploy` reports up to date (or runs pending migrations successfully).

## Rollback

### Application-only rollback

1. Keep previous release as a directory on the VPS (e.g. `/var/www/fleet-flows/releases/<previous-sha>`).
2. Point symlink `current` back to `<previous-sha>`.
3. Restart the Node process (`systemctl restart fleet-flows` or `pm2 restart fleet-flows`).
4. If the new release ran **forward-only** migrations that are incompatible, prefer restoring from DB backup (below) instead of only swapping code.

### Database rollback

- Prisma migrations are **forward** by default; **down** migrations are not generated automatically.
- **Before risky releases:** take a `pg_dump` or provider snapshot.
- **To restore:** stop app → restore dump to clean database → point `DATABASE_URL` → start app → verify smoke checklist.

### TLS / Nginx

- If a bad Nginx config blocks traffic: use Hostinger **web console** or SSH; restore last known-good config from `/etc/nginx/sites-available/` backup; `nginx -t` then `systemctl reload nginx`.

## Sign-off

| Date | Deployer | Git ref | Smoke result (pass/fail) | Notes |
|------|----------|---------|--------------------------|-------|
|      |          |         |                          |       |
