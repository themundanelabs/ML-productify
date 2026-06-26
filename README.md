# ProductivityHub

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support%20this%20project-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/johnsebastian97)

> I'm a developer who loves solving problems, improving systems, and sharing useful insights along the way. If my work helps you, your support keeps it going ☕

---

An open-source dashboard that brings 10 self-hosted productivity tools together in one place. One server, one login screen, one interface to launch and monitor everything.

---

## What's included

| # | Tool | What it does | URL after deploy |
|---|------|-------------|-----------------|
| 1 | [cal.diy](https://github.com/calcom/cal.diy) | Scheduling & calendar booking | `cal.yourdomain.com` |
| 2 | [Plausible Analytics](https://github.com/plausible/analytics) | Privacy-first web analytics | `analytics.yourdomain.com` |
| 3 | [Ghost](https://github.com/tryghost/ghost) | Blog, newsletter & memberships | `blog.yourdomain.com` |
| 4 | [n8n](https://github.com/n8n-io/n8n) | Workflow automation | `n8n.yourdomain.com` |
| 5 | [Supabase](https://github.com/supabase/supabase) | Postgres DB, auth & storage | `supabase.yourdomain.com` |
| 6 | [Medusa](https://github.com/medusajs/medusa) | E-commerce engine | `store.yourdomain.com` |
| 7 | [AppFlowy Cloud](https://github.com/AppFlowy-IO/AppFlowy-Cloud) | Docs, notes & kanban (Notion alt.) | `docs.yourdomain.com` |
| 8 | [Coolify](https://github.com/coollabsio/coolify) | Self-hosted PaaS & deployment | `coolify.yourdomain.com` |
| 9 | [Listmonk](https://github.com/knadh/listmonk) | Email campaigns & mailing lists | `campaigns.yourdomain.com` |
| 10 | [Penpot](https://github.com/penpot/penpot) | UI/UX design tool (Figma alt.) | `design.yourdomain.com` |

---

## Server requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 16 GB | 24 GB |
| CPU | 4 cores | 8 cores |
| SSD | 80 GB | 150 GB |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Open ports | 80, 443 | 80, 443 |

**Estimated cost:** ~$40–80/month on [Hetzner CX52](https://www.hetzner.com/cloud), DigitalOcean, or Vultr.

---

## Prerequisites

Install these on your server before starting.

### 1. Docker & Docker Compose

```bash
# Install Docker (Ubuntu)
curl -fsSL https://get.docker.com | sh

# Add your user to the docker group (so you don't need sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### 2. Git

```bash
sudo apt update && sudo apt install -y git
```

### 3. openssl (usually pre-installed)

```bash
openssl version  # if missing: sudo apt install -y openssl
```

---

## Installation

### Step 1 — Clone the repository

```bash
git clone https://github.com/themundanelabs/ML-productify.git
cd ML-productify
```

### Step 2 — Run the setup script

This does three things automatically: checks your prerequisites, generates all secrets and database passwords, and creates the Docker network.

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

After it runs, you'll see a table of DNS records printed in your terminal. **Keep that terminal window open** — you'll need those records in Step 4.

### Step 3 — Edit your `.env` file

The setup script created a `.env` file for you. Open it and fill in the four values marked below. Everything else was auto-generated and doesn't need to be changed.

```bash
nano .env
```

Find and update these four lines:

```bash
BASE_DOMAIN=yourdomain.com        # ← your actual domain (no https://)
ACME_EMAIL=you@yourdomain.com     # ← your email (used for TLS certificates)
ADMIN_EMAIL=admin@yourdomain.com  # ← your dashboard login email
ADMIN_PASSWORD=yourpassword       # ← your dashboard login password (min 12 chars recommended)
```

Save and close (`Ctrl+X`, then `Y`, then `Enter` in nano).

> **Supabase note:** The `.env` file also contains `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY` which require JWT tokens, not plain passwords. Generate them with this command (run it twice — once for each key):
>
> ```bash
> node -e "const c=require('crypto');const h={alg:'HS256',typ:'JWT'};const p={role:'anon',iss:'supabase',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+315360000};const e=s=>Buffer.from(JSON.stringify(s)).toString('base64url');const sig=c.createHmac('sha256',process.env.SUPABASE_DB_PASSWORD||'secret').update(e(h)+'.'+e(p)).digest('base64url');console.log(e(h)+'.'+e(p)+'.'+sig)"
> ```
>
> Copy the output into `SUPABASE_ANON_KEY`, then change `role:'anon'` to `role:'service_role'` and run again for `SUPABASE_SERVICE_KEY`.

### Step 4 — Set up DNS records

Log in to your domain registrar (Namecheap, Cloudflare, GoDaddy, etc.) and create **A records** pointing each subdomain to your server's IP address.

You need **11 records** total:

| Type | Name | Value |
|------|------|-------|
| A | `@` or `yourdomain.com` | `your.server.ip` |
| A | `cal` | `your.server.ip` |
| A | `analytics` | `your.server.ip` |
| A | `blog` | `your.server.ip` |
| A | `n8n` | `your.server.ip` |
| A | `supabase` | `your.server.ip` |
| A | `store` | `your.server.ip` |
| A | `docs` | `your.server.ip` |
| A | `coolify` | `your.server.ip` |
| A | `campaigns` | `your.server.ip` |
| A | `design` | `your.server.ip` |

> **Cloudflare users:** Set the proxy status to **DNS only** (grey cloud) for all records while setting up. You can enable the proxy after everything works.

DNS propagation can take a few minutes to 48 hours. You can check it with:

```bash
dig +short yourdomain.com
```

### Step 5 — Start everything

```bash
docker compose up -d --build
```

This will:
- Build the dashboard (Next.js app) — takes ~2 minutes
- Pull all 10 tool images from Docker Hub — depends on your connection
- Start all containers in the background

**First start takes 5–15 minutes.** The databases need to initialise before the tools become available. Check progress with:

```bash
docker compose ps        # shows which containers are running
docker compose logs -f   # stream all logs (Ctrl+C to stop)
```

### Step 6 — Open the dashboard

Once all containers show `healthy` or `running`, open your browser and go to:

```
https://yourdomain.com
```

Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in Step 3.

---

## First-time setup for each tool

The dashboard is ready immediately after login. Each tool, however, needs a one-time admin account setup the first time you open it. Click a tool card from the dashboard to open it, then follow the steps below.

| Tool | First-time setup |
|------|-----------------|
| **cal.diy** | Click "Get Started", create an admin account |
| **Plausible** | Click "Register", enter your email and password |
| **Ghost** | Go to `blog.yourdomain.com/ghost` — it will walk you through creating the admin account |
| **n8n** | The setup wizard launches automatically on first visit |
| **Supabase** | Access the Studio — database is pre-configured, create tables as needed |
| **Medusa** | Visit `store.yourdomain.com/app` — create your admin account |
| **AppFlowy** | Register a new account on first visit |
| **Coolify** | The onboarding wizard launches automatically — create your admin account |
| **Listmonk** | Default login: `admin` / `listmonk` — **change this immediately** in Settings → Users |
| **Penpot** | Register a new account on first visit |

> **Listmonk default credentials are public knowledge.** Change them as soon as you log in the first time.

---

## Dashboard features

Once logged in, you get:

- **Bento grid** — all 10 tools displayed as cards with live status (online / degraded / offline)
- **Health monitoring** — auto-refreshes every 30 seconds, shows response latency per tool
- **Category filter** — filter by Scheduling, Analytics, Publishing, Automation, etc.
- **Embedded view** — click a card to open any tool inside the dashboard (iframe), with reload and fullscreen controls
- **New tab tools** — Coolify and Penpot open in a new tab (they block iframes by default)
- **Collapsible sidebar** — click `‹` to collapse; status dots remain visible
- **Dark / Light / System theme** — toggle in the top-right header
- **Settings page** — shows all service URLs and the environment variables reference

---

## Architecture

```
Your browser
     │
     ▼
Traefik (ports 80 & 443)
  Auto-issues TLS certs via Let's Encrypt
     │
     ├── yourdomain.com          →  ProductivityHub dashboard
     ├── cal.yourdomain.com      →  cal.diy
     ├── analytics.yourdomain.com →  Plausible Analytics
     ├── blog.yourdomain.com     →  Ghost
     ├── n8n.yourdomain.com      →  n8n
     ├── supabase.yourdomain.com →  Supabase Studio
     ├── store.yourdomain.com    →  Medusa
     ├── docs.yourdomain.com     →  AppFlowy Cloud
     ├── coolify.yourdomain.com  →  Coolify
     ├── campaigns.yourdomain.com →  Listmonk
     └── design.yourdomain.com  →  Penpot
```

All containers run on an internal `hub` Docker network. No ports are exposed directly to the internet — all traffic goes through Traefik, which handles HTTPS automatically.

---

## Configuration reference

All configuration is in the `.env` file at the root of the project. The only values you ever need to edit manually are:

| Variable | Description |
|----------|-------------|
| `BASE_DOMAIN` | Your root domain (e.g. `acme.com`) |
| `ACME_EMAIL` | Email for TLS certificate registration |
| `ADMIN_EMAIL` | Your login email for the dashboard |
| `ADMIN_PASSWORD` | Your login password for the dashboard |
| `TIMEZONE` | Your timezone (default: `UTC`) — affects n8n scheduling |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Optional — enables Ghost to send emails |

Everything else (database passwords, encryption keys, JWT secrets) is auto-generated by `./scripts/setup.sh` and should not be changed after first start without also re-initialising the affected database.

---

## Useful commands

```bash
# Check which containers are running
docker compose ps

# See logs for all services
docker compose logs -f

# See logs for one service only (e.g. ghost)
docker compose logs -f ghost

# Restart a single service
docker compose restart n8n

# Stop everything (data is preserved in Docker volumes)
docker compose down

# Stop everything AND delete all data (irreversible)
docker compose down -v
```

---

## Updating

```bash
# Pull latest tool images
docker compose pull

# Rebuild and restart the dashboard (after code changes)
docker compose up -d --build dashboard

# Rebuild and restart everything
docker compose up -d --build
```

---

## Troubleshooting

**A tool shows "Offline" in the dashboard**
The service is still starting up or its database hasn't finished initialising. Wait 2–3 minutes and click the refresh button. Check logs with `docker compose logs -f <service-name>`.

**TLS certificate not issued / site shows "Not Secure"**
- Confirm all DNS records point to your server: `dig +short yourdomain.com`
- Make sure ports 80 and 443 are open in your server's firewall: `sudo ufw allow 80 && sudo ufw allow 443`
- Traefik logs show certificate errors: `docker compose logs -f traefik`

**Dashboard login fails**
Double-check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. Both are case-sensitive. After changing `.env`, restart the dashboard: `docker compose up -d dashboard`.

**n8n or Ghost not sending emails**
Configure SMTP settings in `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`) and restart: `docker compose up -d ghost n8n`.

**Listmonk database error on first start**
Listmonk runs its own install migration on startup. If it fails, restart it once: `docker compose restart listmonk`.

**Out of disk space**
Clean up unused Docker images and volumes: `docker system prune -f`. Check space with `df -h`.

---

## Adding more tools

1. Add the service to `docker-compose.yml` with Traefik labels (copy any existing service block as a template)
2. Add it to `dashboard/lib/services.ts` in the `SERVICES` array
3. Add a DNS record for its subdomain
4. Rebuild: `docker compose up -d --build dashboard`

---

## License

MIT — free to use, fork, and deploy.
