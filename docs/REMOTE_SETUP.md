# Connect this repo to GitHub

The workspace is initialized with git. To push to GitHub:

1. Create a **new empty** repository on GitHub (no README) named e.g. `fleet-flows`.
2. From the project root:

```bash
git remote add origin https://github.com/<your-account>/<your-repo>.git
git push -u origin main
```

3. Optional: protect `main` and require PR reviews in GitHub repository settings.

**Baseline tag:** `baseline-prd-vps-2026-04-12` marks the state after PRD, VPS docs, migrations, and auth/mobile updates.
