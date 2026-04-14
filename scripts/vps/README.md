# VPS helper files

These files are **templates**. Copy them to the server and edit hostnames/paths before use.

Use a non-root app path such as `/var/www/fleet-flows/current` or `/home/<deploy-user>/Fleetflows` when the service runs as `www-data`. A checkout inside `/root/Fleetflows` is fine for first-time manual testing, but it is not a good default for `systemd`.

| File | Purpose |
|------|---------|
| [nginx-fleet-flows.conf](nginx-fleet-flows.conf) | Nginx reverse proxy to `127.0.0.1:3000` + ACME webroot / Certbot-friendly server block. |
| [fleet-flows.service](fleet-flows.service) | systemd unit: runs `npm run start` from `/var/www/fleet-flows/current`. |

## Install systemd unit (example)

```bash
sudo cp fleet-flows.service /etc/systemd/system/fleet-flows.service
sudo systemctl daemon-reload
sudo systemctl enable fleet-flows
sudo systemctl start fleet-flows
sudo systemctl status fleet-flows
```

Adjust `User`, `Group`, and `WorkingDirectory` in the unit file to match your server.

## Deploy script (local or CI)

From repo root, [deploy-vps.sh](../deploy-vps.sh) documents suggested steps; customize `DEPLOY_HOST` and paths for your environment.
