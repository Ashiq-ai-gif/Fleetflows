# Fleet Flows — Hostinger VPS (all-in-one)

This path runs **Next.js** and **PostgreSQL** on the same VPS, with **Nginx** terminating TLS. Vercel is not required.

**Related:** product scope and acceptance tests in [docs/PRD.md](docs/PRD.md); generic env notes in [DEPLOYMENT.md](DEPLOYMENT.md).

## 1. Server assumptions

- Ubuntu 22.04 LTS or similar (Hostinger VPS template).
- Non-root deploy user with `sudo`.
- Domain `app.example.com` pointing to the VPS public IP (A record).

## 2. Install system packages

```bash
sudo apt update && sudo apt install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx ufw git curl
```

## 3. PostgreSQL

```bash
sudo -u postgres psql
CREATE USER fleetflows_user WITH PASSWORD 'strongpassword';
CREATE DATABASE fleetflows_db OWNER fleetflows_user;
GRANT ALL PRIVILEGES ON DATABASE fleetflows_db TO fleetflows_user;
\q
```

Set `DATABASE_URL` (use SSL if you enable `hostssl` in `pg_hba.conf`; for localhost-only, typical dev/prod on one box):

```env
DATABASE_URL="postgresql://fleetflows_user:strongpassword@127.0.0.1:5432/fleetflows_db?schema=public"
```

Ensure PostgreSQL listens only on localhost unless you have a separate DB tier.

## 4. Node.js

Install Node **20 LTS** or newer (matches [package.json](package.json) engines if present; use 20+).

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 5. Application deploy

Example layout:

```text
/var/www/fleet-flows/releases/<git-sha>   # one folder per deploy
/var/www/fleet-flows/current -> symlink to active release
```

On the server:

```bash
sudo mkdir -p /var/www/fleet-flows/releases
cd /var/www/fleet-flows/releases
sudo git clone <YOUR_REPO_URL> $(date +%Y%m%d%H%M)
cd <that-folder>
sudo npm ci
sudo npx prisma migrate deploy
sudo npm run build
```

Place environment variables in `/var/www/fleet-flows/current/.env.production` (permissions `600`, owned by deploy user). Required variables are listed in [docs/PRD.md](docs/PRD.md#9-environments-and-configuration).

If you are testing manually and already cloned the repo to `/root/Fleetflows`, Git commands will work there, but the provided `systemd` template assumes a non-root app path such as `/var/www/fleet-flows/current`. Keeping the app under `/root` is not recommended when the service runs as `www-data`.

Start the app on loopback:

```bash
cd /var/www/fleet-flows/current && NODE_ENV=production npm run start -- -p 3000
```

Use **systemd** or **PM2** so the process restarts on reboot — see [scripts/vps/fleet-flows.service](scripts/vps/fleet-flows.service) and [scripts/vps/README.md](scripts/vps/README.md).

## 6. Nginx reverse proxy

Copy and edit [scripts/vps/nginx-fleet-flows.conf](scripts/vps/nginx-fleet-flows.conf): replace `app.example.com` and SSL paths. Enable site:

```bash
sudo cp nginx-fleet-flows.conf /etc/nginx/sites-available/fleet-flows
sudo ln -sf /etc/nginx/sites-available/fleet-flows /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 7. TLS (Let’s Encrypt)

```bash
sudo certbot --nginx -d app.example.com
```

After certificates exist, set:

```env
AUTH_URL="https://app.example.com"
```

(or `NEXTAUTH_URL` with the same value).

## 8. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 9. Seed (first run only)

From the release directory, with `DATABASE_URL` set:

```bash
export SEED_SUPER_ADMIN_PASSWORD='use-a-long-random-secret'
npx tsx scripts/seed.ts
```

Unset the variable afterward. Log in, **change the password** in-app or by re-seeding with a new env value.

## 10. Mobile builds

Set `EXPO_PUBLIC_API_URL=https://app.example.com/api` in your EAS secrets or `.env` for Expo, then build. Never ship production mobile builds pointing at `http://` or raw IPs.
